import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import Lottie from "lottie-react";
import cinemaAnimation from "../assets/cinema-popcorn.json";

const trailers = [
  { title: "Devara: Part 1", videoUrl: "S5wQD_0WGTA" },
  { title: "Family Star", videoUrl: "xB7b3RzicUU" },
  { title: "Pushpa 2: The Rule", videoUrl: "Q1NKMPhP8PY" },
  { title: "Deadpool & Wolverine", videoUrl: "uJMCNJP2ipI" },
  { title: "Inside Out 2", videoUrl: "LEjhY15eCx0" },
  { title: "Dune: Part Two", videoUrl: "Way9Dexny3w" },
  { title: "Game Changer", videoUrl: "zHiKFSBO_JE" },
  { title: "Kraven The Hunter", videoUrl: "krYauKDFXCE" },
  { title: "Viswam", videoUrl: "yMlTqbOgmnA" },
  { title: "Laila", videoUrl: "YAk2UKzfa8Y" },
  { title: "Retro", videoUrl: "LEjhY15eCx0" },
  { title: "Calculator", videoUrl: "Way9Dexny3w" },
];

const TrailersPage = ({ user }) => {
  const navigate = useNavigate();
  const playerRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleBackToDashboard = () => {
    navigate("/user-dashboard");
  };

  const handlePlayClick = (index) => {
    if (!user || !user.isSubscribed) {
      alert("Please subscribe to watch trailers.");
      return;
    }

    if (activeIndex !== null && activeIndex !== index) {
      alert("🎬 Trailer is locked until current one finishes.");
      return;
    }

    setActiveIndex(index);
    const player = playerRefs.current[index];
    if (player && typeof player.playVideo === "function") {
      player.playVideo();
    }
  };

  const onPlayerReady = (event, index) => {
    playerRefs.current[index] = event.target;
  };

  const onPlayerStateChange = (event, index) => {
    if (event.data === 0) {
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      trailers.forEach((trailer, index) => {
        new window.YT.Player(`player-${index}`, {
          videoId: trailer.videoUrl,
          events: {
            onReady: (event) => onPlayerReady(event, index),
            onStateChange: (event) => onPlayerStateChange(event, index),
          },
        });
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, sm: 4 },
        color: "#fff",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, right: 30 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          sx={{
            backgroundColor: "#ff4081",
            color: "#fff",
            borderRadius: "30px",
            px: 3,
            py: 1,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f50057",
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box textAlign="center" mb={6} display="flex" flexDirection="column" alignItems="center">
        <Box sx={{ width: 120, mb: 1 }}>
          <Lottie animationData={cinemaAnimation} loop autoplay />
        </Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#ff4081"
          letterSpacing={1}
        >
          ALL TRAILERS
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.7 }}>
          Explore what’s trending across industries 🍿
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {trailers.map((trailer, index) => {
          const isLocked = activeIndex !== null && activeIndex !== index;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <Card
                sx={{
                  backgroundColor: "#1c1c1c",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.3s",
                  },
                }}
                onClick={() => handlePlayClick(index)}
              >
                <div
                  id={`player-${index}`}
                  style={{
                    height: "180px",
                    width: "100%",
                    backgroundColor: "#000",
                    position: "relative",
                  }}
                >
                  {isLocked && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        zIndex: 2,
                      }}
                    >
                      <LockIcon sx={{ fontSize: 40, color: "#ff4081" }} />
                      <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
                        Trailer is locked until current one finishes.
                      </Typography>
                    </Box>
                  )}
                </div>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      textAlign: "center",
                      fontSize: "0.95rem",
                    }}
                  >
                    {trailer.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TrailersPage;
