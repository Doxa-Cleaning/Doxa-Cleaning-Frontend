import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.user, data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo-large">D</div>
          <h1>Doxa Cleaning</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>
        <div className="login-card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          <div className="test-credentials">
            <p>Test Credentials</p>
            <p>
              <code>admin@doxacleaning.com</code> / <code>admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
