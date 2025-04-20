import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [languageFilter, setLanguageFilter] = useState("English");
  const [movieStats, setMovieStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resMovies = await axios.get("/api/movies/stats");
        const resUsers = await axios.get("/api/users/stats");
        setMovieStats(resMovies.data);
        setUserStats(resUsers.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2>Dashboard Preview</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li><a href="#admin" style={linkStyle}>Admin Dashboard</a></li>
          <li><a href="#user" style={linkStyle}>User Dashboard</a></li>
        </ul>
      </div>

      {/* Content Area for both Dashboards */}
      <div style={dualDashboardContainer}>
        {/* Admin Dashboard */}
        <div id="admin" style={dashboardBox}>
          <h1>Admin Dashboard</h1>
          <div style={quickStatsContainer}>
            <div style={statCardStyle}>Total Users: {userStats.totalUsers}</div>
            <div style={statCardStyle}>Total Movies: {movieStats.totalMovies}</div>
            <div style={statCardStyle}>Total Views: {movieStats.totalViews}</div>
            <div style={statCardStyle}>Avg. Watch Time: {movieStats.avgWatchTime} hrs</div>
          </div>
          <h3>Manage Movies</h3>
          <p>Track and manage all movies in the platform.</p>
          <h3>User Management</h3>
          <p>Monitor and manage users, including suspension and banning actions.</p>
          <h3>Moderate Comments</h3>
          <p>Moderate user reviews and comments for inappropriate language.</p>
        </div>

        {/* User Dashboard */}
        <div id="user" style={dashboardBox}>
          <h1>Welcome back, John!</h1>
          <h4>Your personalized movie dashboard</h4>

          <div style={sectionStyle}>
            <h3>Choose Your Language</h3>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>

          <div style={sectionStyle}>
            <h3>Continue Watching</h3>
            <div style={movieRowStyle}>
              <img src="movie1.jpg" alt="Movie 1" style={movieImageStyle} />
              <img src="movie2.jpg" alt="Movie 2" style={movieImageStyle} />
              <img src="movie3.jpg" alt="Movie 3" style={movieImageStyle} />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3>Recommended For You</h3>
            <div style={movieRowStyle}>
              <img src="movie4.jpg" alt="Movie 4" style={movieImageStyle} />
              <img src="movie5.jpg" alt="Movie 5" style={movieImageStyle} />
              <img src="movie6.jpg" alt="Movie 6" style={movieImageStyle} />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3>Your Watchlist</h3>
            <ul style={watchlistStyle}>
              <li>Movie Title 1</li>
              <li>Movie Title 2</li>
              <li>Movie Title 3</li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3>Download Movies (Limit: 3)</h3>
            <p>You can download up to 3 movies. After that, you need a subscription to download more.</p>
            <button
              onClick={() => setDownloadCount(downloadCount + 1)}
              style={downloadButtonStyle}
              disabled={downloadCount >= 3}
            >
              {downloadCount >= 3 ? "Download Limit Reached" : "Download Movie"}
            </button>
          </div>

          <div style={warningBoxStyle}>
            <h4>Warning: Please use appropriate language when commenting. Repeated offenses may lead to account suspension.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const sidebarStyle = {
  width: "220px",
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
};

const dualDashboardContainer = {
  flex: 1,
  display: "flex",
  gap: "20px",
  padding: "20px",
  flexWrap: "wrap",
};

const dashboardBox = {
  flex: "1 1 48%",
  backgroundColor: "#f4f4f4",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  minWidth: "350px",
};

const quickStatsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "20px",
};

const statCardStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "15px",
  borderRadius: "5px",
  flex: "1 1 45%",
  textAlign: "center",
};

const sectionStyle = { marginBottom: "30px" };
const movieRowStyle = { display: "flex", overflowX: "auto" };
const movieImageStyle = { width: "120px", marginRight: "10px", borderRadius: "5px" };
const selectStyle = { padding: "10px", borderRadius: "5px", width: "200px" };
const watchlistStyle = { listStyleType: "none", padding: 0 };
const downloadButtonStyle = { padding: "10px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", border: "none" };
const warningBoxStyle = { backgroundColor: "#f8d7da", padding: "20px", borderRadius: "5px" };
const linkStyle = { color: "#fff", textDecoration: "none", display: "block", marginBottom: "10px" };

export default Dashboard;
