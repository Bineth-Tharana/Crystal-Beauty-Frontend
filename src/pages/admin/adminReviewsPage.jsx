import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaComments, FaStar, FaEyeSlash, FaSearch } from "react-icons/fa";
import Loading from "../../components/loading";
import StarRating from "../../components/starRating";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");
  const headers = { Authorization: "Bearer " + token };
  const api = import.meta.env.VITE_BACKEND_URL + "/api/reviews";

  useEffect(() => {
    if (!isLoading) return;

    axios
      .get(api, { headers })
      .then((res) => setReviews(res.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Error fetching reviews")
      )
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  function toggleVisibility(review) {
    axios
      .put(
        `${api}/${review._id}/visibility`,
        { isApproved: !review.isApproved },
        { headers }
      )
      .then(() => {
        toast.success(review.isApproved ? "Review hidden" : "Review visible");
        setReviews((prev) =>
          prev.map((r) =>
            r._id === review._id ? { ...r, isApproved: !r.isApproved } : r
          )
        );
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Failed to update review")
      );
  }

  function deleteReview(review) {
    if (!window.confirm(`Delete the review by ${review.name}? This cannot be undone.`)) {
      return;
    }
    axios
      .delete(`${api}/${review._id}`, { headers })
      .then(() => {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== review._id));
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Failed to delete review")
      );
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      const matchesSearch =
        q === "" ||
        r.name.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
      const matchesRating =
        ratingFilter === "all" || r.rating === Number(ratingFilter);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "visible" ? r.isApproved : !r.isApproved);
      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, search, ratingFilter, statusFilter]);

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const hiddenCount = reviews.filter((r) => !r.isApproved).length;

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Reviews</h1>
        <p className="text-gray-500 mt-1">
          See what customers say and hide or remove inappropriate reviews
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<FaComments />}
          label="Total reviews"
          value={reviews.length}
          color="bg-accent"
        />
        <StatCard
          icon={<FaStar />}
          label="Average rating"
          value={reviews.length === 0 ? "-" : average.toFixed(1)}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<FaEyeSlash />}
          label="Hidden"
          value={hiddenCount}
          color="bg-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, product or comment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-accent"
        >
          <option value="all">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 && "s"}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-accent"
        >
          <option value="all">All statuses</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            {reviews.length === 0
              ? "No reviews yet. Reviews written on product pages will appear here."
              : "No reviews match your filters"}
          </div>
        )}

        {filtered.map((review) => (
          <div
            key={review._id}
            className={`bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-start gap-4 ${
              review.isApproved ? "" : "opacity-60"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <StarRating value={review.rating} />
                <span className="font-semibold text-gray-800">
                  {review.name}
                </span>
                <span className="text-sm text-gray-400">{review.email}</span>
                {!review.isApproved && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-accent font-semibold">
                {review.productName}{" "}
                <span className="text-gray-400 font-normal">
                  ({review.productId})
                </span>
              </p>
              <p className="mt-2 text-gray-700 break-words">{review.comment}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex md:flex-col gap-2 shrink-0">
              <button
                onClick={() => toggleVisibility(review)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-accent text-accent hover:bg-accent hover:text-white transition"
              >
                {review.isApproved ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => deleteReview(review)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow p-5">
      <div
        className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
