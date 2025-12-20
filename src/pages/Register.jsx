import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";


const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setInfo(data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setInfo("Email verified. Logging you in...");
      setUser(data.user); // update global context

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const passwordStrength = getPasswordStrength(form.password);

  const progressColor =
    passwordStrength.label === "Weak"
      ? "bg-red-500"
      : passwordStrength.label === "Medium"
        ? "bg-amber-500"
        : "bg-green-500";

  const progressWidth =
    passwordStrength.label === "Weak"
      ? "33%"
      : passwordStrength.label === "Medium"
        ? "66%"
        : "100%";


  return (
    <div className="min-h-screen w-full bg-[#05a1f2] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-7">
        <h1 className="text-2xl font-bold text-sky-500 mb-2 text-center">
          {step === 1 ? "Create your account" : "Verify your email"}
        </h1>
        <p className="text-xs text-gray-500 text-center mb-4">
          {step === 1
            ? "Sign up with your email and password."
            : `We sent a 6-digit OTP to ${form.email}. Enter it below.`}
        </p>

        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500"
                value={form.password}
                onChange={handleChange}
                required
              />

              {form.password && (
                <>
                  <p className={`text-xs mt-1 font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.label} password
                  </p>

                  <div className="h-1 w-full bg-gray-200 rounded mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ease-out ${progressColor}`}
                      style={{ width: progressWidth }}
                    ></div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg py-2.5 mt-1 transition-shadow shadow-sm hover:shadow"
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500 tracking-[0.4em] text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg py-2.5 mt-1 transition-shadow shadow-sm hover:shadow"
            >
              Verify & Continue
            </button>

            {/* Reuse /auth/register to resend OTP */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full text-[0.75rem] text-sky-500 hover:underline mt-1"
            >
              Resend OTP
            </button>
          </form>
        )}

        <p className="text-[0.78rem] text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
