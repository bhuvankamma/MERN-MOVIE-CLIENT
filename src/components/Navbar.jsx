import React, { useState } from "react";
import { Link } from "react-router-dom"; // ⬅️ Add this import for navigation

const Navbar = ({ onSignInClick }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      alert(`You searched for: ${searchTerm}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navbarStyle = {
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 100,
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  };

  const logoStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#e50914",
    letterSpacing: "1.5px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  };

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative",
  };

  const searchIconStyle = {
    fontSize: "1.4rem",
    color: "#fff",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontWeight: "bold",
  };

  const searchInputStyle = {
    padding: "6px 10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    width: "200px",
    transition: "all 0.3s ease",
    display: showSearch ? "block" : "none",
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "#fff",
    zIndex: 10,
  };

  const signInButtonStyle = {
    padding: "8px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const moviesLinkStyle = {
    padding: "8px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <nav style={navbarStyle}>
      <div style={logoStyle}>NETFLIX</div>

      <div style={rightSectionStyle}>
        <button
          style={searchIconStyle}
          onClick={() => setShowSearch(!showSearch)}
          title="Search"
        >
          🔍
        </button>
        <input
          type="text"
          placeholder="Search..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* 🔗 Movies Navigation Link */}
        <Link to="/movies" style={moviesLinkStyle}>
          Movies
        </Link>

        <button
          style={signInButtonStyle}
          onClick={onSignInClick}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f40612")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e50914")}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
