import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Connection error:", err);
    }
  };

  // If user is logged in, show dashboard (Placeholder for now)
  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <h1>Doxa Cleaning Dashboard (UNDER CONSTRUCTION)</h1>
        <p>Welcome, {user.name}!</p>
        <p>Role: {user.role}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "2px dashed #ccc",
          }}
        >
          <h2>TODO:</h2>
          <ul>
            <li>Build job list view</li>
            <li>Build job creation form</li>
            <li>Build employee dashboard</li>
            <li>Add proper styling</li>
          </ul>
        </div>
      </div>
    );
  }

  // If not logged in, show login form
  return (
    <div className="login">
      <h1>Doxa Cleaning Login</h1>
      <p style={{ color: "#666" }}>Frontend is under construction</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <div style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
        <p>Test credentials:</p>
        <p>admin@doxacleaning.com / admin123</p>
      </div>
    </div>
  );
}

export default App;
