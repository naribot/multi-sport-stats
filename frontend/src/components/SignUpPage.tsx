import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      form.username.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      form.password === form.confirmPassword
    ) {
      // Save username for log in later
      localStorage.setItem("user", form.username.trim());
      navigate("/soccer");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1>Create Your Account</h1>

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button className="signup-submit" onClick={handleSubmit}>
          Sign Up
        </button>

        <button className="back-to-login" onClick={() => navigate(-1)}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
