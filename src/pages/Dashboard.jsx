// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, loading: userLoading } = useUser();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  // NEW: mode for dashboard UI
  const [mode, setMode] = useState("profile"); // "profile" | "admin"
  const isAdmin = user?.role === "admin";

  const API_URL = import.meta.env.VITE_API_URL ;

  // Initialize form from user when available
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setBio(user.bio || "");
    if (user.avatar) {
      setAvatarPreview(`${API_URL}${user.avatar}?v=${user.updatedAt}`);
    }
    if (user.banner) {
      setBannerPreview(`${API_URL}${user.banner}?v=${user.updatedAt}`);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (bannerFile) formData.append("banner", bannerFile);

      const res = await fetch(`${API_URL}/auth/api/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save profile");

      setSuccess("Profile updated successfully 🎉");

      const refreshedRes = await fetch(`${API_URL}/auth/api/me`, {
        credentials: "include",
      });
      const refreshedUser = await refreshedRes.json();
      setUser(refreshedUser);

      if (refreshedUser.avatar) {
        setAvatarPreview(
          `${API_URL}${refreshedUser.avatar}?v=${Date.now()}`
        );
      }
      if (refreshedUser.banner) {
        setBannerPreview(
          `${API_URL}${refreshedUser.banner}?v=${Date.now()}`
        );
      }

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      setError(err.message || "Something went wrong ❌");
    } finally {
      setSaving(false);
    }
  };

  // While user auth is loading
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
        Checking login...
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white">
        Please login to edit your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex justify-center px-4 py-6 overflow-x-hidden">
      <div
        className="
    w-full max-w-5xl 
    bg-[#111111] 
    rounded-3xl 
    overflow-hidden 
    shadow-[0_18px_40px_rgba(0,0,0,0.7)] 
    border border-white/5
    max-h-[calc(100vh-3rem)]   /* card never taller than screen */
    flex flex-col              /* so inner content can flex/scroll */
  "
      >
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700">
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner"
              className="w-full h-full object-cover opacity-80"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <label className="absolute bottom-3 right-3 text-xs bg-black/60 px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/80 transition flex items-center gap-1">
            <span className="text-[0.7rem] tracking-wide uppercase text-white/80">
              Change banner
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </label>
        </div>

        {/* Top section: avatar + tabs */}
        {/* Top section: avatar + tabs + forms */}
        <div
          className="
    px-6 pb-8 -mt-10 
    flex flex-col gap-6 
    overflow-y-auto          /* internal vertical scroll */
    scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent
    max-h-[calc(100vh-12rem)]  /* leave space for banner + padding */
  "
        >
          {/* Avatar & title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#111111] overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (name?.charAt(0)?.toUpperCase() || "U")
                  )}
                </div>
                <label className="absolute bottom-0 right-0 text-[0.65rem] bg-black/80 px-2 py-1 rounded-full cursor-pointer hover:bg-black transition">
                  Edit
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {user.name || "Profile Settings"}
                  </h2>
                  {isAdmin && (
                    <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40 uppercase tracking-[0.12em]">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 transition-all duration-300 ease-in-out">
                  {isAdmin
                    ? mode === "admin"
                      ? "You have full control over users, system settings and platform content."
                      : "Manage your admin profile and public visibility."
                    : "Update how you appear and interact on Geeth Playlist."}
                </p>

              </div>
            </div>

            {/* Mode switcher (User / Admin) */}
            <div className="flex items-center justify-start md:justify-end">
              <div className="bg-[#1b1b1b] rounded-full p-1 flex gap-1 border border-white/10">
                <button
                  onClick={() => setMode("profile")}
                  className={`px-3 py-1.5 text-[0.7rem] rounded-full transition-all ${mode === "profile"
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

          {/* MODE: USER PROFILE (existing form) */}
          {mode === "profile" && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 mt-4 bg-[#151515] border border-white/5 rounded-2xl p-5 md:p-6 shadow-inner"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-white/70">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#191919] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-white/70">
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#191919] border border-[#333] rounded-lg px-3 py-2 text-sm text-white/60 outline-none"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/70">Bio</label>
                <textarea
                  className="w-full bg-[#191919] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 min-h-[90px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your listeners something about you..."
                />
                <p className="text-[0.7rem] text-white/40 text-right mt-1">
                  {bio.length}/500
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/50 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-sm bg-green-900/20 border border-green-700/50 px-3 py-2 rounded-lg">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-lg py-2.5 text-sm font-semibold transition-all"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}

          {/* MODE: ADMIN PANEL */}
          {mode === "admin" && isAdmin && (
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {/* Card 1: Role summary */}
              <div className="bg-[#151515] border border-purple-500/40 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
                <p className="text-xs text-purple-300 uppercase tracking-[0.14em]">
                  Admin Access
                </p>
                <h3 className="text-lg font-semibold">You are an Admin</h3>
                <p className="text-[0.78rem] text-white/60">
                  You can manage users, content and advanced features of
                  Geeth Playlist.
                </p>
              </div>

              {/* Card 2: Placeholder stats */}
              <div className="bg-[#151515] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.14em]">
                    Quick Stats
                  </p>
                  <h3 className="text-lg font-semibold mt-1">
                    Coming Soon 🚧
                  </h3>
                  <p className="text-[0.78rem] text-white/60 mt-1">
                    Here you&apos;ll see users, uploads and active sessions.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-3 text-[0.75rem] text-purple-300 hover:text-purple-200 underline-offset-2 hover:underline text-left"
                >
                  Design admin dashboard later →
                </button>
              </div>

              {/* Card 3: Manage users button */}
              <div className="bg-[#151515] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.14em]">
                    Controls
                  </p>
                  <h3 className="text-lg font-semibold mt-1">
                    Manage Application
                  </h3>
                  <p className="text-[0.78rem] text-white/60 mt-1">
                    Later you can add routes for banning users, managing songs,
                    and viewing reports.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full bg-purple-600/80 hover:bg-purple-500 rounded-lg py-2 text-[0.8rem] font-semibold"
                  onClick={() => {
                    // placeholder - navigate to future admin page
                    // navigate("/admin");
                  }}
                >
                  Open Admin Panel (WIP)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
