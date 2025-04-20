import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/admin/reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // adjust if needed
        },
      });
      setReviews(data.reviews);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setDeleting(reviewId);
      await axios.delete(`/api/admin/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err.message);
    } finally {
      setDeleting("");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Movie</th>
              <th>User</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Likes</th>
              <th>Dislikes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} className="text-center border-b">
                <td>{r.movieTitle}</td>
                <td>{r.user?.name}</td>
                <td>{r.comment || "No comment"}</td>
                <td>{r.rating}</td>
                <td>{r.likes?.length || 0}</td>
                <td>{r.dislikes?.length || 0}</td>
                <td>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={deleting === r._id}
                    onClick={() => deleteReview(r._id)}
                  >
                    {deleting === r._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewList;
