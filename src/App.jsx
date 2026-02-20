import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/loginPage";
import Dashboard from "./Pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setIsLoggedIn(true);
    localStorage.setItem("token", tokenData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard user={user} token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
