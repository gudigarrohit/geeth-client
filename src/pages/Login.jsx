import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useUser } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // normal login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // forgot-password flow state
  const [mode, setMode] = useState("login"); // 'login' | 'forgot-email' | 'forgot-otp' | 'reset-password'
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // loading + cooldown
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0); // seconds remaining


  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  // 👇 Place the two useEffects here
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }
  }, [rememberMe, email]);

  const startOtpCooldown = () => {
    setOtpCooldown(30); // start from 30 seconds
  };


  // ⏱ OTP cooldown timer: counts down from 30 to 0
  useEffect(() => {
    if (otpCooldown <= 0) return; // nothing to do

    const id = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id); // cleanup
  }, [otpCooldown]);


  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setEmail("");
      setPassword("");

      setUser(data.user);
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  // helper: reset messages when mode changes
  useEffect(() => {
    setError("");
    setInfo("");
  }, [mode]);

  function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) return { label: "", color: "" };
    if (score <= 1) return { label: "Weak", color: "text-red-500" };
    if (score === 2) return { label: "Medium", color: "text-amber-500" };
    return { label: "Strong", color: "text-green-500" };
  }

  return (
    <div className="min-h-screen w-full bg-[#05a1f2] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-white/10 rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-sm border border-white/40">
        {/* LEFT: Hero image + text */}
        <div className="hidden md:flex md:w-1/2 relative">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/372098/pexels-photo-372098.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-8 text-white">
            <div>
              <h2 className="text-3xl font-[lobster] mb-2 tracking-wide">
                1-Minute Geeth
              </h2>
              <p className="text-sm text-white/90 max-w-xs">
                Music that finds you in 60 seconds. Discover playlists, artists,
                and vibes that match your mood.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-white/70">
                Curated playlists • Smart recommendations • Social listening
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/60">
                  <img
                    src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Creator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-semibold">Rohit A G</p>
                  <p className="text-white/70">@geeth_playlist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Login / Forgot-password card */}
        <div className="w-full md:w-1/2 bg-white rounded-[28px] md:rounded-l-none p-8 md:p-10 flex flex-col">
          {/* Top mini brand */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <span className="text-xs text-sky-500 font-semibold uppercase tracking-[0.15em]">
              {mode === "login" ? "Welcome back" : "Password help"}
            </span>
            <span className="text-[0.65rem] text-gray-400">
              Geeth Playlist • v1.0
            </span>
          </div>

          <h1 className="text-3xl font-bold text-sky-500 mb-2">
            {mode === "login"
              ? "Welcome"
              : mode === "forgot-email"
                ? "Forgot password?"
                : mode === "forgot-otp"
                  ? "Verify OTP"
                  : "Set new password"}
          </h1>

          <p className="text-xs text-gray-500 mb-4">
            {mode === "login"
              ? "Login with your email or continue with Google to start listening."
              : mode === "forgot-email"
                ? "Enter your registered email to receive a password reset OTP."
                : mode === "forgot-otp"
                  ? `We sent a 6-digit OTP to ${resetEmail}. Enter it below to continue.`
                  : "Choose a strong new password for your account."}
          </p>

          {error && (
            <p className="text-[0.75rem] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}
          {info && (
            <p className="text-[0.75rem] text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
              {info}
            </p>
          )}

          {/* ---------- MODE: LOGIN ---------- */}
          {mode === "login" && (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Email ID
                  </label>
                  <div className="flex items-center border border-sky-200 rounded-lg px-3 py-2.5 focus-within:border-sky-500 transition">
                    <HiOutlineMail className="text-sky-400 mr-2" size={18} />
                    <input
                      type="email"
                      className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="geeth@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[0.7rem] text-sky-500 hover:underline"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="flex items-center border border-sky-200 rounded-lg px-3 py-2.5 focus-within:border-sky-500 transition">
                    <HiOutlineLockClosed
                      className="text-sky-400 mr-2"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[0.75rem]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-sky-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="text-sky-500 hover:underline"
                    onClick={() => {
                      setMode("forgot-email");
                      setResetEmail(email); // prefill with typed email
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg py-2.5 mt-1 transition-shadow shadow-sm hover:shadow"
                >
                  LOGIN
                </button>
              </form>

              {/* Divider + social only in login mode */}
              <div className="flex items-center my-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="mx-2 text-[0.7rem] text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                  title="Continue with Google"
                >
                  <FcGoogle size={20} />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                  <FaFacebookF className="text-blue-600" size={18} />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                  <FaApple className="text-black" size={20} />
                </button>
              </div>
            </>
          )}

          {/* ---------- MODE: FORGOT EMAIL ---------- */}
          {mode === "forgot-email" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setInfo("");
                setSendingOtp(true);

                try {
                  const res = await fetch("http://localhost:5000/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resetEmail }),
                  });

                  const data = await res.json();
                  if (!res.ok) {
                    return setError(data.message || "Failed to send OTP");
                  }

                  setInfo(data.message);
                  setMode("forgot-otp");
                  startOtpCooldown(); // 👈 start countdown here
                } catch (err) {
                  setError(err.message);
                } finally {
                  setSendingOtp(false);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">
                  Registered email
                </label>
                <div className="flex items-center border border-sky-200 rounded-lg px-3 py-2.5 focus-within:border-sky-500 transition">
                  <HiOutlineMail className="text-sky-400 mr-2" size={18} />
                  <input
                    type="email"
                    className="w-full text-sm outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Send OTP button with loading state */}
              <button
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-semibold rounded-lg py-2.5 mt-1"
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>

              <button
                type="button"
                className="w-full text-[0.75rem] text-gray-500 hover:underline mt-2"
                onClick={() => setMode("login")}
              >
                ← Back to login
              </button>
            </form>
          )}

          {/* ---------- MODE: FORGOT OTP ---------- */}
          {mode === "forgot-otp" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setInfo("");
                setVerifyingOtp(true);

                try {
                  const res = await fetch("http://localhost:5000/auth/verify-reset-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resetEmail, otp: resetOtp }),
                  });

                  const data = await res.json();
                  if (!res.ok) return setError(data.message || "OTP verification failed");

                  setResetToken(data.resetToken);
                  setInfo("OTP verified! Set a new password.");
                  setMode("reset-password");
                } catch (err) {
                  setError(err.message);
                } finally {
                  setVerifyingOtp(false);
                }
              }}
              className="space-y-4"
            >
              <label className="text-xs font-semibold text-gray-600">
                Enter OTP sent to {resetEmail}
              </label>

              <input
                type="text"
                maxLength={6}
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm text-center tracking-[0.4em] outline-none focus:border-sky-500"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                required
              />

              {/* Verify button with loading */}
              <button
                disabled={verifyingOtp}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-semibold rounded-lg py-2.5 mt-1"
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP with cooldown */}
              <button
                type="button"
                disabled={otpCooldown > 0}
                onClick={async () => {
                  setError("");
                  setInfo("");

                  setSendingOtp(true);

                  try {
                    const res = await fetch("http://localhost:5000/auth/forgot-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: resetEmail }),
                    });

                    const data = await res.json();
                    if (!res.ok) return setError(data.message || "Failed to resend OTP");

                    setInfo("New OTP sent!");
                    startOtpCooldown(); // 👈 start countdown here
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setSendingOtp(false);
                  }
                }}
                className="w-full text-[0.75rem] text-sky-500 hover:underline disabled:text-gray-400"
              >
                {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                className="w-full text-[0.75rem] text-gray-500 hover:underline"
                onClick={() => setMode("forgot-email")}
              >
                ← Change email
              </button>
            </form>
          )}


          {/* ---------- MODE: RESET PASSWORD ---------- */}
          {mode === "reset-password" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setInfo("");
                setResettingPassword(true);

                try {
                  const res = await fetch("http://localhost:5000/auth/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: resetToken, password: newPassword }),
                  });

                  const data = await res.json();
                  if (!res.ok) return setError(data.message || "Failed to reset password");

                  setInfo("Password updated! You can log in now.");
                  setMode("login");
                  setEmail(resetEmail);
                  setResettingPassword(true);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setResettingPassword(false);
                }
              }}
              className="space-y-4"
            >
              <label className="text-xs font-semibold text-gray-600">New password</label>
              <input
                type="password"
                className="w-full border border-sky-200 rounded-lg px-3 py-2 text-sm outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && (
                <p className={`text-[0.7rem] mt-1 ${getPasswordStrength(newPassword).color}`}>
                  Strength: {getPasswordStrength(newPassword).label}
                </p>
              )}

              <button
                disabled={resettingPassword}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-semibold rounded-lg py-2.5 mt-1"
              >
                {resettingPassword ? "Saving..." : "Save new password"}
              </button>

              <button
                type="button"
                className="w-full text-[0.75rem] text-gray-500 hover:underline"
                onClick={() => setMode("login")}
              >
                ← Back to login
              </button>
            </form>
          )}


          {/* Bottom text (always visible) */}
          <p className="text-[0.78rem] text-center text-gray-500 mt-auto">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-sky-500 font-semibold hover:underline cursor-pointer"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
