export default function ProductCard(props) {
    const product = props.product;

    const discount =
        product.labelledPrice > product.price
            ? Math.round(
                  ((product.labelledPrice - product.price) /
                      product.labelledPrice) *
                      100
              )
            : 0;

    return (
        <div className="w-[300px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

            {/* Product Image */}
            <div className="relative w-full h-[220px] bg-gray-100">
                <img
                    src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/300x220?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {discount}% OFF
                    </span>
                )}

                {/* Stock Status */}
                <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                        product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
            </div>

            {/* Product Details */}
            <div className="p-5 flex flex-col">

                {/* Product Name */}
                <h2 className="text-xl font-bold text-gray-800">
                    {product.name}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-2">
                    {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl font-bold text-blue-600">
                        Rs. {product.price?.toLocaleString()}
                    </span>

                    {product.labelledPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            Rs. {product.labelledPrice?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock */}
                <p className="text-xs text-gray-500 mt-2">
                    {product.stock > 0
                        ? `${product.stock} items available`
                        : "Currently unavailable"}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-5">

                    <button
                        disabled={product.stock <= 0}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Add to Cart
                    </button>

                    <button
                        disabled={product.stock <= 0}
                        className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Buy
                    </button>

                </div>
            </div>
        </div>
    );
}


