import Movie from "../models/Movie.js";

// 1. Get All Reviews (Admin)
export const getAllReviews = async (req, res) => {
    try {
        const movies = await Movie.find({}, "title reviews");

        const allReviews = [];

        movies.forEach((movie) => {
            movie.reviews.forEach((review) => {
                allReviews.push({
                    _id: review._id,
                    movieId: movie._id,
                    movieTitle: movie.title,
                    user: {
                        id: review.userId,
                        name: review.userName
                    },
                    comment: review.comment,
                    rating: review.rating,
                    likes: review.likes || [],
                    dislikes: review.dislikes || [],
                    createdAt: review.createdAt
                });
            });
        });

        res.status(200).json({ reviews: allReviews });
    } catch (err) {
        console.error("Error fetching reviews:", err.message);
        res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
    }
};

// 2. Delete Review by ID (Admin - searches all movies)
export const deleteReviewById = async (req, res) => {
    const { id: reviewId } = req.params;

    try {
        const movie = await Movie.findOne({ "reviews._id": reviewId });
        if (!movie) {
            return res.status(404).json({ message: "Review not found in any movie" });
        }

        movie.reviews = movie.reviews.filter(
            (review) => review._id.toString() !== reviewId
        );

        await movie.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ message: "Failed to delete review", error: err.message });
    }
};

// 3. Like a Movie Review
export const likeMovie = async (req, res) => {
    const { movieId, reviewId } = req.params;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const review = movie.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Prevent multiple likes by the same user
        if (!review.likes.includes(req.user._id)) {
            review.likes.push(req.user._id);
            await movie.save();
            return res.status(200).json({ message: "Movie liked successfully" });
        }

        return res.status(400).json({ message: "You already liked this movie" });
    } catch (err) {
        console.error("Error liking movie:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 4. Dislike a Movie Review
export const dislikeMovie = async (req, res) => {
    const { movieId, reviewId } = req.params;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const review = movie.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Prevent multiple dislikes by the same user
        if (!review.dislikes.includes(req.user._id)) {
            review.dislikes.push(req.user._id);
            await movie.save();
            return res.status(200).json({ message: "Movie disliked successfully" });
        }

        return res.status(400).json({ message: "You already disliked this movie" });
    } catch (err) {
        console.error("Error disliking movie:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 5. Add or Update a Review for a Movie
export const addOrUpdateReview = async (req, res) => {
    const { movieId } = req.params;
    const { comment, rating } = req.body;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const existingReview = movie.reviews.find(
            (review) => review.userId.toString() === req.user._id.toString()
        );

        if (existingReview) {
            // Update existing review
            existingReview.comment = comment;
            existingReview.rating = rating;
        } else {
            // Add a new review
            movie.reviews.push({
                userId: req.user._id,
                userName: req.user.name,
                comment,
                rating,
                likes: [],
                dislikes: []
            });
        }

        await movie.save();

        res.status(200).json({ message: "Review added or updated successfully" });
    } catch (err) {
        console.error("Error adding or updating review:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 6. Rate a Movie (Assign a rating to a movie review)
export const rateMovie = async (req, res) => {
    const { movieId, reviewId } = req.params;
    const { rating } = req.body;  // Assuming rating is passed in the body

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const review = movie.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Update the rating of the review
        review.rating = rating;

        await movie.save();

        res.status(200).json({ message: "Review rating updated successfully" });
    } catch (err) {
        console.error("Error rating movie:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};