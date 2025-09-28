import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "", user_type: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Strong password regex
  const isStrongPassword = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.user_type) {
      setMsg({ type: "error", text: "All fields are required!" });
      return;
    }

    // ✅ Check strong password
    if (!isStrongPassword(form.password)) {
      setMsg({
        type: "error",
        text:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/sign-up/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.status === "success") {
        setMsg({
          type: "success",
          text: "Signup successful! Please wait for approval.",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMsg({ type: "error", text: data.message || "Signup failed!" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Server error, try again later!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-green-200">
        <h2 className="text-3xl font-bold text-center text-green-600">
          🌿 Milk Shop Signup
        </h2>

        {msg && (
          <div
            className={`p-2 rounded text-center ${
              msg.type === "error"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
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
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <select
            name="user_type"
            value={form.user_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select User Type</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
