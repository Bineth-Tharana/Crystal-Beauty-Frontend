import { FaStar, FaRegStar } from "react-icons/fa";

// Read-only stars, e.g. <StarRating value={4} />
// Clickable stars, e.g. <StarRating value={rating} onChange={setRating} size={28} />
export default function StarRating({ value = 0, onChange, size = 18 }) {
  return (
    <div className="flex items-center gap-0.5 text-[#f5c542]">
      {[1, 2, 3, 4, 5].map((star) => {
        const Icon = star <= Math.round(value) ? FaStar : FaRegStar;
        return (
          <Icon
            key={star}
            size={size}
            className={onChange ? "cursor-pointer" : ""}
            onClick={onChange ? () => onChange(star) : undefined}
          />
        );
      })}
    </div>
  );
}
