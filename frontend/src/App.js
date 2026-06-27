import { useEffect, useState } from "react";
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import "./App.css";

function App() {
  // 🌙 DARK MODE STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 💾 SAVE THEME IN LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
    <Navbar/>
      <div className={`app-layout ${darkMode ? "dark" : ""}`}>

        {/* LEFT SIDEBAR */}
        <div className="left-sidebar">
          <h1 className="insta-logo">Instagram</h1>

          <Link to="/"><FiHome /> Home</Link>
          <Link to="/chat"><FiMessageCircle /> Messages</Link>
          <Link to="/profile"><FiUser /> Profile</Link>
          <Link to="/login">🔐 Login</Link>
          <Link to="/signup">📝 Signup</Link>

          {/* 🌙 DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              marginTop: "20px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;