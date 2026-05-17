import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { getApiErrorMessage } from "../utils/apiError";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const backendStatus = useBackendStatus();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast("Welcome back!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(err, "Login failed.");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    if (backendStatus === "offline") {
      setError("Backend is not running. Start Spring Boot on port 8080.");
      return;
    }
    setLoading(true);
    try {
      await login("demo@nettopo.com", "demo123");
      showToast("Welcome!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(err, "Demo login failed.");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Access your saved topology projects">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

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
            autoComplete="email"
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="input-toggle input-toggle--eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
        </div>

        <button
          type="submit"
          className="auth-btn auth-btn--signin"
          disabled={loading || backendStatus === "offline"}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="auth-btn auth-btn--outline-purple"
          onClick={handleDemoLogin}
          disabled={loading || backendStatus === "offline"}
        >
          <span className="auth-btn__icon">⚡</span>
          Quick demo login
        </button>

        <Link to="/register" className="auth-btn auth-btn--outline-cyan">
          <span className="auth-btn__icon">+</span>
          Create new account
        </Link>

        <Link to="/designer" className="auth-btn auth-btn--outline-grey">
          <span className="auth-btn__icon">→</span>
          Continue as guest
        </Link>
      </form>
    </AuthLayout>
  );
}
