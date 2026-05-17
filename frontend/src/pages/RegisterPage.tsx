import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { getApiErrorMessage } from "../utils/apiError";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const backendStatus = useBackendStatus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (backendStatus === "offline") {
      setError("Backend is not running. Start Spring Boot on port 8080.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      showToast("Account created successfully!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(err, "Registration failed.");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Your projects are saved to PostgreSQL">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <label className="field-label">Full name</label>
        <div className="input-with-icon">
          <span className="input-icon input-icon--user" aria-hidden />
          <input
            className="field-input field-input--icon"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            minLength={2}
          />
        </div>

        <label className="field-label">Email address</label>
        <div className="input-with-icon">
          <span className="input-icon input-icon--mail" aria-hidden />
          <input
            className="field-input field-input--icon"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            required
          />
        </div>

        <label className="field-label">Password</label>
        <div className="input-with-icon">
          <span className="input-icon input-icon--lock" aria-hidden />
          <input
            className="field-input field-input--icon"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />
          <button
            type="button"
            className="input-toggle input-toggle--eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
        </div>

        <label className="field-label">Confirm password</label>
        <div className="input-with-icon">
          <span className="input-icon input-icon--lock" aria-hidden />
          <input
            className="field-input field-input--icon"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="auth-btn auth-btn--signin"
          disabled={loading || backendStatus === "offline"}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Link to="/login" className="auth-btn auth-btn--outline-cyan">
          <span className="auth-btn__icon">←</span>
          Already have an account? Sign in
        </Link>

        <Link to="/designer" className="auth-btn auth-btn--outline-grey">
          <span className="auth-btn__icon">→</span>
          Continue as guest
        </Link>
      </form>
    </AuthLayout>
  );
}
