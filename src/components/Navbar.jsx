import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout request failed:", err);
    } finally {
      localStorage.removeItem("rememberEmail"); // 👈 clear stored email
      setUser(null);
      navigate("/login");
    }
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-[7vh] bg-[#1c1b1b] rounded-t px-3 py-2 flex items-center justify-between">
      <Link to={"/"}>
        <h1 className="text-2xl pl-4 tracking-[0.09rem] text-white font-[lobster]">
          Geeth Playlist
        </h1>
      </Link>

      <div className="flex items-center gap-3.5 text-white">
        {user ? (
          <>
            <div className="flex items-center gap-1">
              {/* Greeting + Dropdown */}
              <div ref={menuRef} className="relative inline-block text-left">
                {/* Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="text-white border border-transparent cursor-pointer"
                >
                  <div className="flex flex-col justify-center items-center leading-tight hover:text-blue-500 cursor-pointer">
                    <span className="text-white text-[0.88rem] font-semibold">
                      {user.role === "admin"
                        ? "Namaste Boss 🔱"
                        : `Hello, ${user.name?.split(" ")[0] || "User"} 🦋`}
                    </span>
                    <span className="text-white/80 text-[0.7rem] ">
                      {user.role === "admin"
                        ? "Admin Panel Access"
                        : "Premium Listener"}
                    </span>
                  </div>
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute left-1  mt-3.5 z-20 bg-[#111] border border-[#4c4949] rounded-lg w-38 shadow-lg">
                    <ul className="p-1.5 text-sm text-white font-medium">
                      <li>
                        <Link
                          to="/"
                          className="flex items-center justify-center w-full p-1 rounded hover:bg-[#1e1e1e]"
                          onClick={() => setOpen(false)}
                        >
                          Home
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center justify-center w-full p-1 rounded hover:bg-[#1e1e1e]"
                          onClick={() => setOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="w-full p-1 rounded hover:bg-[#1e1e1e] flex justify-center gap-3 items-center"
                          onClick={() => setOpen(false)}
                        >
                          Profile
                          <span>
                            <RxAvatar className="font-bold p-0.5 size-6 text-white bg-gradient-to-br from-purple-600 to-blue-600 rounded-full" />
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Avatar circle */}
              <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user.avatar ? (
                  <img
                    src={`${API_URL}${user.avatar}?v=${user.updatedAt}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitial(user.name)
                )}
              </Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-[4.2rem] h-[2.2rem] rounded-full bg-[#2e2e2e] font-roboto text-[0.80rem] border-none outline-none text-white font-semibold transition-all duration-700 ease-out hover:bg-white hover:text-black hover:text-[0.8rem] cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          // Guest / not logged in
          <div className="flex items-center gap-2.5">
            <Link to="/">
              <span className="text-[0.89rem] text-gray-400 font-semibold hover:text-white cursor-pointer">
                Welcome, Guest!
              </span>
            </Link>
            <button
              onClick={() => navigate("/login")}
              className="w-[4.2rem] h-[2.2rem] rounded-full bg-[#2e2e2e] font-roboto text-[0.80rem] border-none outline-none text-white font-semibold transition-all duration-700 ease-out hover:bg-white hover:text-black hover:text-[0.8rem] cursor-pointer"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
