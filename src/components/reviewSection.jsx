import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import StarRating from "./starRating";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const api = import.meta.env.VITE_BACKEND_URL + "/api/reviews";

  function loadReviews() {
    axios
      .get(`${api}/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch(() => toast.error("Could not load reviews"))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadReviews();
  }, [productId]);

  function handleSubmit(e) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (comment.trim() === "") {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    axios
      .post(
        api,
        { productId, rating, comment },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => {
        toast.success("Thank you for your review!");
        setRating(0);
        setComment("");
        loadReviews();
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Failed to add review")
      )
      .finally(() => setIsSubmitting(false));
  }

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="mx-auto mt-3 h-1 w-20 rounded bg-[#f5c542]" />
        {reviews.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <StarRating value={average} size={22} />
            <span className="text-gray-600">
              {average.toFixed(1)} out of 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      <div className="mb-8 p-6 rounded-xl border border-gray-100 shadow-sm">
        {token == null ? (
          <p className="text-center text-gray-600">
            <Link to="/login" className="text-accent font-semibold underline">
              Login
            </Link>{" "}
            to write a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h3 className="font-bold text-lg text-gray-800">
              Write a review
            </h3>
            <StarRating value={rating} onChange={setRating} size={28} />
            <textarea
              rows={4}
              maxLength={1000}
              placeholder="Share your experience with this product"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-accent resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="self-start px-8 py-2.5 rounded-full bg-accent text-white font-semibold hover:bg-accent/80 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">
                    {review.name}
                  </span>
                  <StarRating value={review.rating} size={16} />
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 text-gray-600 break-words">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
