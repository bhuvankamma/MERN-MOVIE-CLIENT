import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Modal,
    Rating,
    Snackbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import DownloadIcon from "@mui/icons-material/Download";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export default function AllMovies() {
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [likeDislikeStatus, setLikeDislikeStatus] = useState(null);
    const [downloaded, setDownloaded] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const [openModal, setOpenModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [ratings, setRatings] = useState({});
    const [movieDetailsVisible, setMovieDetailsVisible] = useState({});
    const [watchLater, setWatchLater] = useState({});
    const [temporaryRating, setTemporaryRating] = useState({});
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("/api/movies/"); // ENSURE TRAILING SLASH FOR CORRECT API CALL
                setMovies(response.data);
                console.log("Fetched movies:", response.data); // Log the fetched data to inspect thumbnailUrl and videoUrl
            } catch (error) {
                console.error("Error fetching movies:", error);
                setSnackbar({ open: true, message: "Failed to load movies." });
            }
        };

        fetchMovies();
    }, []);

    const likeMovie = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/movies/like/${movieId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error liking movie:", error);
        }
    };

    const dislikeMovie = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/movies/dislike/${movieId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error disliking movie:", error);
        }
    };

    const rateMovie = async (movieId, rating) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/movies/rate/${movieId}`, { rating }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error rating movie:", error);
        }
    };

    const handleLike = (movieId, title) => {
        likeMovie(movieId);
        setLikeDislikeStatus(`Liked "${title}"`);
        setTimeout(() => setLikeDislikeStatus(null), 3000);
    };

    const handleDislike = (movieId, title) => {
        dislikeMovie(movieId);
        setLikeDislikeStatus(`Disliked "${title}"`);
        setTimeout(() => setLikeDislikeStatus(null), 3000);
    };

    const handleRatingChange = (movieId, title, newRating) => {
        setRatings((prev) => ({ ...prev, [title]: newRating }));
        setTemporaryRating((prev) => ({ ...prev, [title]: `${newRating}/5` }));
        rateMovie(movieId, newRating);
        setTimeout(() => {
            setTemporaryRating((prev) => ({ ...prev, [title]: "" }));
        }, 3000);
    };

    const handlePlayVideo = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedVideo(null);
    };

    const handleDownload = (movieId, title) => { // Pass movieId for backend integration later
        const token = localStorage.getItem('token');
        axios.put(`/api/movies/download/${movieId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            setDownloaded((prev) => ({ ...prev, [title]: !prev[title] }));
            setSnackbar({ open: true, message: response.data.message });
        })
        .catch(error => {
            console.error("Error toggling download:", error);
            setSnackbar({ open: true, message: error.response?.data?.message || "Failed to toggle download." });
        });
    };

    const handleDashboardClick = () => {
        navigate("/user/dashboard");
    };

    const handleToggleDetails = (title) => {
        setMovieDetailsVisible((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const handleWatchLater = (movieId, title) => {
        const token = localStorage.getItem('token');
        axios.put(`/api/movies/watch-later/${movieId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            
        })
        .then(response => {
            setWatchLater((prev) => ({ ...prev, [title]: !prev[title] }));
            setSnackbar({ open: true, message: response.data.message });
        })
        .catch(error => {
            console.error("Error toggling watch later:", error);
            setSnackbar({ open: true, message: error.response?.data?.message || "Failed to toggle watch later." });
        });
    };

    // *** ONLY CHANGE IS HERE: Made filter comparison case-insensitive ***
    const filteredMovies =
        selectedGenre === "all"
            ? movies
            : movies.filter((movie) =>
                  // Check if movie has a category and compare it case-insensitively
                  movie.category && movie.category.toLowerCase() === selectedGenre.toLowerCase()
              );

    const getGridColumns = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 4;
    };

    return (
        <Box sx={{ minHeight: "100vh", px: 2, py: 4, background: "#141414", color: "#e5e5e5" }}>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                color="primary"
                onClick={handleDashboardClick}
                sx={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    padding: "8px 15px",
                    zIndex: 10,
                    backgroundColor: "#e50914",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#b81d24" },
                }}
            >
                Back
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {["all", "action", "comedy", "drama", "thriller", "romance"].map((genre) => (
                    <Button
                        key={genre}
                        variant={selectedGenre === genre ? "contained" : "outlined"}
                        color="secondary"
                        onClick={() => setSelectedGenre(genre)}
                        sx={{
                            mr: 1,
                            borderRadius: "5px",
                            fontSize: isMobile ? "0.8rem" : "1rem",
                            backgroundColor: selectedGenre === genre ? "#e50914" : "transparent",
                            color: selectedGenre === genre ? "#fff" : "#e5e5e5",
                            borderColor: "#e5e5e5",
                            "&:hover": {
                                backgroundColor: selectedGenre === genre ? "#b81d24" : "#333",
                                borderColor: "#e5e5e5",
                                color: "#fff",
                            },
                        }}
                    >
                        {genre.toUpperCase()}
                    </Button>
                ))}
            </Box>

            <Grid container spacing={2} mt={3} justifyContent="center"> {/* Center the Grid */}
                {filteredMovies.map((movie) => (
                    // Ensure movie._id is available and unique, otherwise use a fallback like movie.title
                    <Grid item xs={12} sm={6} md={4} lg={12 / getGridColumns()} key={movie._id || movie.title}>
                        <Card sx={{
                            backgroundColor: "#222",
                            borderRadius: "8px", // Slightly rounded corners
                            boxShadow: "0 2px 4px rgba(0,0,0,.4)",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                        }}>
                            <CardMedia
                                component="img"
                                height={isMobile ? 150 : 200}
                                // Provide a fallback if thumbnailUrl might be missing
                                image={movie.thumbnailUrl || require('../assets/images/3 idiots.jpg').default}
                                alt={movie.title}
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "8px",
                                    borderTopRightRadius: "8px",
                                }}
                            />
                            <CardContent sx={{ padding: "12px", flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "bold", color: "#fff", mb: 0.5 }}>{movie.title}</Typography>
                                {/* Check if details are visible AND category exists */}
                                {movieDetailsVisible[movie.title] && movie.category && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", color: "#999" }}>
                                        Genre: {movie.category}
                                    </Typography>
                                )}
                                {temporaryRating[movie.title] && (
                                    <Typography variant="body2" color="success" sx={{ fontSize: "0.8rem" }}>
                                        Rated {temporaryRating[movie.title]}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ padding: "8px", justifyContent: "space-between" }}>
                                <Box>
                                    <Tooltip title="Like">
                                        <IconButton onClick={() => handleLike(movie._id, movie.title)} color="success" size="small">
                                            <ThumbUpIcon sx={{ fontSize: "1rem" }} /> {/* Reduced icon size */}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Dislike">
                                        <IconButton onClick={() => handleDislike(movie._id, movie.title)} color="error" size="small">
                                            <ThumbDownIcon sx={{ fontSize: "1rem" }} /> {/* Reduced icon size */}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Box>
                                    <Tooltip title="Watch Later">
                                        <IconButton onClick={() => handleWatchLater(movie._id, movie.title)} color="primary" size="small">
                                            <WatchLaterIcon sx={{ fontSize: "1rem" }} /> {/* Reduced icon size */}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Download">
                                         {/* Span needed for tooltip on disabled button */}
                                        <span>
                                            <IconButton
                                                onClick={() => handleDownload(movie._id, movie.title)}
                                                disabled={!!downloaded[movie.title]}
                                                color="info"
                                                size="small"
                                            >
                                                <DownloadIcon sx={{ fontSize: "1rem" }} /> {/* Reduced icon size */}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </CardActions>
                            <Box sx={{ px: 2, pb: 1 }}>
                                <Rating
                                    // Use unique key for rating name
                                    name={`rating-${movie._id || movie.title}`}
                                    value={ratings[movie.title] || 0}
                                    onChange={(e, newValue) => handleRatingChange(movie._id, movie.title, newValue)}
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 0.5, fontSize: "0.8rem", backgroundColor: "#e50914", "&:hover": { backgroundColor: "#b81d24" }, padding: "6px" }} // Reduced padding for smaller button
                                    // Ensure movie.videoUrl exists
                                    onClick={() => handlePlayVideo(movie.videoUrl)}
                                    startIcon={<PlayCircleFilledWhiteIcon sx={{ fontSize: "1rem" }} />} // Reduced icon size
                                >
                                    Play
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => handleToggleDetails(movie.title)}
                                    sx={{ mt: 0.5, color: "#999", fontSize: "0.7rem" }}
                                >
                                    {movieDetailsVisible[movie.title] ? "Hide Info" : "More Info"}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
                {/* Optional: Display message if filtered list is empty */}
                {filteredMovies.length === 0 && selectedGenre !== "all" && (
                    <Typography sx={{ mt: 4, color: '#aaa', width: '100%', textAlign: 'center' }}>
                        No movies found in the "{selectedGenre}" category.
                    </Typography>
                )}
            </Grid>

            <Modal open={openModal} onClose={handleModalClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isMobile ? "95%" : isTablet ? "80%" : "70%",
                        maxWidth: "900px",
                        bgcolor: "#000",
                        boxShadow: 24,
                        p: 2,
                        borderRadius: "8px",
                    }}
                >
                    {selectedVideo && (
                        <iframe
                            width="100%"
                            height={isMobile ? "200px" : isTablet ? "350px" : "450px"}
                            src={selectedVideo}
                            title="Movie Trailer" // Changed title for clarity
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: "8px" }}
                        ></iframe>
                    )}
                </Box>
            </Modal>

            <Snackbar
                open={likeDislikeStatus !== null}
                autoHideDuration={3000}
                onClose={() => setLikeDislikeStatus(null)}
                message={likeDislikeStatus}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ open: false, message: "" })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
}