// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setMsg({ type: "error", text: "All fields are required!" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/login/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.data_received.token);
        setMsg({ type: "success", text: "Login successful! Redirecting..." });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMsg({ type: "error", text: data.error || "Login failed!" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Server error, try again later!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-primary">Welcome Back</h2>
        {msg && (
          <div className={`p-2 rounded text-center ${msg.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
            {msg.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-[#4caf50] rounded-xl shadow hover:bg-green-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-[#4caf50] cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
