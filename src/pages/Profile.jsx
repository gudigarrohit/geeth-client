// client/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("user"); // "user" | "admin"

  // toast = { type: "success" | "error", message: string }
  const [toast, setToast] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // modal state for ban/unban
  const [confirmUser, setConfirmUser] = useState(null);
  const [banAction, setBanAction] = useState(null); // "ban" | "unban"

  const isAdmin = user?.role === "admin";
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch current user
  useEffect(() => {
    async function loadMe() {
      try {
        setLoadingMe(true);
        const res = await fetch(`${API_URL}/auth/api/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingMe(false);
      }
    }
    loadMe();
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Fetch all users when switching to admin mode
  useEffect(() => {
    if (mode !== "admin" || !isAdmin) return;

    async function loadUsers() {
      try {
        setLoadingUsers(true);
        setError("");
        setInfo("");

        const res = await fetch(
          `${API_URL}/auth/api/admin/users`,
          {
            credentials: "include",
          }
        );

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Failed to load users");
        }

        const list = Array.isArray(data) ? data : data.users || [];
        setAllUsers(list);
      } catch (err) {
        setError(err.message || "Failed to load users");
        setToast({ type: "error", message: err.message || "Failed to load users" });
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, [mode, isAdmin]);

  // Open modal with chosen user + action
  const openBanModal = (u, action) => {
    setConfirmUser(u); // full user object
    setBanAction(action); // "ban" or "unban"
  };
  const handleConfirmBan = async () => {
    if (!confirmUser || !banAction) return;

    try {
      setDeletingId(confirmUser._id);
      setError("");
      setInfo("");
      setToast(null);

      const res = await fetch(
        `${API_URL}/auth/api/admin/users/${confirmUser._id}/ban`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            isBanned: banAction === "ban",
          }),
        }
      );

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      console.log("BAN RESPONSE:", res.status, data);

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      // update list
      setAllUsers((prev) =>
        prev.map((u) =>
          u._id === confirmUser._id
            ? { ...u, isBanned: banAction === "ban" }
            : u
        )
      );

      const msg =
        data.message ||
        (banAction === "ban" ? "User banned successfully." : "User unbanned.");

      setInfo(msg);
      setToast({ type: "success", message: msg });
    } catch (err) {
      const msg = err.message || "Failed to update user status";
      setError(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setDeletingId(null);
      setConfirmUser(null);
      setBanAction(null);
    }
  };

  if (loadingMe) {
    return (
      <div className="min-h-screenflex items-center justify-center bg-[#050505] text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        Please login to view profile.
      </div>
    );
  }
  const handleHardDelete = async (id) => {
    if (!window.confirm("This will permanently delete this user. Continue?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setInfo("");
      setToast(null);

      const res = await fetch(
        `${API_URL}/auth/api/admin/users/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setToast({
        type: "success",
        message: data.message || "User deleted permanently.",
      });
    } catch (err) {
      const msg = err.message || "Failed to delete user";
      setToast({ type: "error", message: msg });
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <>
      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-2 rounded-lg text-sm shadow-lg border
          ${toast.type === "success"
                ? "bg-emerald-600/90 border-emerald-400 text-white"
                : "bg-red-600/90 border-red-400 text-white"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#050505] text-white flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-[#111111] rounded-3xl overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.7)] border border-white/5">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700">
            {user.banner && (
              <img
                src={`${API_URL}${user.banner}`}
                alt="Banner"
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          {/* Top section: avatar + info + mode switch */}
          <div className="px-6 pb-8 -mt-10 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Avatar + name */}
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 md:w-28 md:h-28 z-30 rounded-full border-4 border-[#111111] overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                  {user.avatar ? (
                    <img
                      src={`${API_URL}${user.avatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 ">
                    <h1 className="text-2xl md:text-3xl font-semibold ">
                      {user.name}
                    </h1>
                    {isAdmin && (
                      <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40 uppercase tracking-[0.12em]">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70">{user.email}</p>
                  <p className="text-xs text-purple-300 mt-1">
                    {isAdmin
                      ? mode === "admin"
                        ? "You are managing users and system controls."
                        : "You are in user view. Switch to Admin Mode to manage others."
                      : "Artist / Listener • Your personal Geeth Playlist profile."}
                  </p>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex items-center justify-start md:justify-end">
                <div className="bg-[#1b1b1b] rounded-full p-1 flex gap-1 border border-white/10">
                  <button
                    onClick={() => setMode("user")}
                    className={`px-3 py-1.5 text-[0.7rem] rounded-full transition-all ${mode === "user"
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:text-white"
                      }`}
                  >
                    User Mode
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setMode("admin")}
                      className={`px-3 py-1.5 text-[0.7rem] rounded-full transition-all ${mode === "admin"
                        ? "bg-purple-500 text-white shadow-md"
                        : "text-white/60 hover:text-white"
                        }`}
                    >
                      Admin Mode
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inline messages */}
            {(error || info) && (
              <div className="mt-1">
                {error && (
                  <div className="text-red-400 text-xs bg-red-900/20 border border-red-700/50 px-3 py-2 rounded-lg mb-1">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="text-green-400 text-xs bg-green-900/20 border border-green-700/50 px-3 py-2 rounded-lg">
                    {info}
                  </div>
                )}
              </div>
            )}

            {/* MODE: USER VIEW */}
            {mode === "user" && (
              <div className="mt-2 bg-[#151515] border border-white/5 rounded-2xl p-5 md:p-6">
                {user.bio && (
                  <p className="text-sm text-white/80 leading-relaxed">
                    {user.bio}
                  </p>
                )}
                {!user.bio && (
                  <p className="text-sm text-white/50 italic">
                    No bio added yet. Go to Dashboard → Profile Settings to add
                    something about yourself.
                  </p>
                )}

                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-xs text-white/60">
                  <div className="bg-[#191919] border border-[#333] rounded-xl p-3">
                    <p className="uppercase tracking-[0.16em] text-[0.6rem] text-white/40 mb-1">
                      Email
                    </p>
                    <p className="text-[0.8rem] text-white/80">{user.email}</p>
                  </div>
                  <div className="bg-[#191919] border border-[#333] rounded-xl p-3">
                    <p className="uppercase tracking-[0.16em] text-[0.6rem] text-white/40 mb-1">
                      Role
                    </p>
                    <p className="text-[0.8rem] text-white/80">
                      {isAdmin ? "Admin" : "User"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODE: ADMIN VIEW */}
            {mode === "admin" && isAdmin && (
              <div className="mt-2 bg-[#151515] border border-purple-500/30 rounded-2xl p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">User Management</h2>
                    <p className="text-[0.8rem] text-white/60">
                      Search users, view roles, and ban/unban when needed.
                    </p>
                  </div>

                  {/* search box */}
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      className="w-full bg-[#191919] border border-[#333] rounded-full px-3 py-1.5 text-xs outline-none focus:border-purple-500"
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loadingUsers && (
                  <span className="text-[0.7rem] text-white/50">
                    Loading users...
                  </span>
                )}

                {!loadingUsers && allUsers.length === 0 && (
                  <p className="text-sm text-white/50">
                    No users found yet. Once people sign up, they will appear
                    here.
                  </p>
                )}

                {!loadingUsers && allUsers.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scroll">
                    {allUsers
                      .filter((u) => {
                        if (!searchTerm.trim()) return true;
                        const term = searchTerm.toLowerCase();
                        return (
                          u.name?.toLowerCase().includes(term) ||
                          u.email?.toLowerCase().includes(term)
                        );
                      })
                      .map((u) => {
                        const isSelf = u._id === user._id;
                        const banned = !!u.isBanned;

                        return (
                          <div
                            key={u._id}
                            className="flex items-center gap-3 bg-[#191919] border border-[#333] rounded-xl px-3 py-2.5 text-sm"
                          >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-semibold">
                              {u.avatar ? (
                                <img
                                  src={`${API_URL}${u.avatar}`}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (u.name?.charAt(0)?.toUpperCase() || "U")
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="truncate text-[0.9rem]">
                                {u.name || "Unnamed user"}
                              </p>
                              <p className="truncate text-[0.75rem] text-white/60">
                                {u.email}
                              </p>
                              <p className="text-[0.65rem] text-white/40 mt-0.5">
                                Role:{" "}
                                <span
                                  className={
                                    u.role === "admin"
                                      ? "text-amber-300"
                                      : "text-white/55"
                                  }
                                >
                                  {u.role || "user"}
                                </span>{" "}
                                • Status:{" "}
                                <span
                                  className={
                                    banned ? "text-red-300" : "text-emerald-300"
                                  }
                                >
                                  {banned ? "Banned" : "Active"}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              {isSelf ? (
                                <span className="text-[0.65rem] text-emerald-300">
                                  It&apos;s you
                                </span>
                              ) : u.role === "admin" ? (
                                <span className="text-[0.65rem] text-amber-300">
                                  Admin protected
                                </span>
                              ) : (
                                <>
                                  {/* Ban / Unban button */}
                                  <button
                                    onClick={() => openBanModal(u, banned ? "unban" : "ban")}
                                    disabled={deletingId === u._id}
                                    className={`text-[0.7rem] px-2 py-1 rounded-md font-semibold cursor-pointer  ${banned
                                      ? "bg-emerald-600 hover:bg-emerald-700"
                                      : "bg-red-600/80 hover:bg-red-500"
                                      } disabled:bg-gray-700 disabled:cursor-not-allowed`}
                                  >
                                    {deletingId === u._id
                                      ? "Updating..."
                                      : banned
                                        ? "Unban"
                                        : "Ban"}
                                  </button>

                                  {/* Delete permanently – only when banned */}
                                  {!isSelf && u.role !== "admin" && banned && (
                                    <button
                                      onClick={() => handleHardDelete(u._id)}
                                      className="text-[0.7rem] px-2 py-1 rounded-md bg-red-500 hover:bg-red-700 mt-0.5  cursor-pointer font-semibold"
                                    >
                                      Delete permanently
                                    </button>
                                  )}
                                </>
                              )}
                            </div>


                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* If not admin but somehow in admin mode */}
            {mode === "admin" && !isAdmin && (
              <div className="mt-4 text-sm text-red-400">
                You do not have admin rights to view this section.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#171717] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {banAction === "ban" ? "Ban user?" : "Unban user?"}
              </h3>
              <button
                className="text-white/40 hover:text-white text-xl leading-none"
                onClick={() => {
                  setConfirmUser(null);
                  setBanAction(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm text-white/80 mb-2">
                {banAction === "ban"
                  ? `This will block ${confirmUser.name || "this user"
                  } from using the platform. You can unban them later.`
                  : `This will restore access for ${confirmUser.name || "this user"
                  } to the platform.`}
              </p>
              <p className="text-[0.75rem] text-white/40">
                Their data will remain intact. Use{" "}
                <span className="text-red-300 font-semibold">
                  Delete permanently
                </span>{" "}
                if you want to remove the account forever.
              </p>
            </div>

            <div className="px-5 py-4 bg-black/20 border-t border-white/5 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-full text-sm bg-white/5 hover:bg-white/10 text-white/80"
                onClick={() => {
                  setConfirmUser(null);
                  setBanAction(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${banAction === "ban"
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-emerald-600 hover:bg-emerald-800"
                  }`}
                onClick={handleConfirmBan}
              >
                {banAction === "ban" ? "Ban user" : "Unban user"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Profile;
