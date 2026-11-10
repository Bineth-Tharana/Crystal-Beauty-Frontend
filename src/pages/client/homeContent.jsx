import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsTruck, BsShieldCheck, BsStars, BsHeadset } from "react-icons/bs";
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";

const features = [
    {
        icon: <BsStars />,
        title: "Quality Cosmetics",
        text: "Carefully selected beauty products you can trust.",
    },
    {
        icon: <BsShieldCheck />,
        title: "100% Authentic",
        text: "Genuine products straight from trusted brands.",
    },
    {
        icon: <BsTruck />,
        title: "Island-wide Delivery",
        text: "Fast and safe delivery right to your door.",
    },
    {
        icon: <BsHeadset />,
        title: "Friendly Support",
        text: "Questions about a product? We're happy to help.",
    },
];

export default function HomeContent() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((res) => {
                setProducts(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch(() => {
                setHasError(true);
                setIsLoading(false);
            });
    }, []);

    const inStock = products.filter(
        (p) => p.isAvailable !== false && p.stock > 0
    );
    const featured = inStock.slice(0, 4);
    const onSale = inStock.filter((p) => p.labelledPrice > p.price);
    const maxDiscount = onSale.reduce(
        (max, p) =>
            Math.max(
                max,
                Math.round(((p.labelledPrice - p.price) / p.labelledPrice) * 100)
            ),
        0
    );

    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero */}
            <section className="w-full bg-gradient-to-br from-[#fdf2f8] via-white to-[#fff8e1]">
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <p className="uppercase tracking-[0.3em] text-sm text-[#7B1252] font-semibold">
                            Crystal Beauty Cosmetics
                        </p>
                        <h1 className="mt-4 text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Reveal your{" "}
                            <span className="text-[#7B1252]">natural glow</span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
                            Skincare, makeup and beauty essentials that help you
                            look and feel your best, every single day.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                            <Link
                                to="/products"
                                className="px-8 py-3 rounded-full bg-[#7B1252] text-white font-semibold shadow-lg hover:bg-[#5e0e3f] transition"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/search"
                                className="px-8 py-3 rounded-full border-2 border-[#7B1252] text-[#7B1252] font-semibold hover:bg-[#7B1252] hover:text-white transition"
                            >
                                Search Products
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full bg-gradient-to-tr from-[#7B1252] to-[#f5c542] flex items-center justify-center shadow-2xl">
                            <div className="w-[88%] h-[88%] rounded-full bg-white flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="Crystal Beauty Cosmetics"
                                    className="w-[60%] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why choose us */}
            <section className="w-full max-w-6xl px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#fdf2f8] text-[#7B1252] flex items-center justify-center text-2xl">
                            {f.icon}
                        </div>
                        <h3 className="mt-4 font-bold text-lg text-gray-800">
                            {f.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">{f.text}</p>
                    </div>
                ))}
            </section>

            {/* Featured products */}
            <section className="w-full max-w-7xl px-4 pb-14">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Featured Products
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-20 rounded bg-[#f5c542]" />
                </div>

                {isLoading ? (
                    <div className="h-[300px]">
                        <Loading />
                    </div>
                ) : hasError ? (
                    <p className="text-center text-gray-500">
                        Couldn't load products right now. Please try again
                        later.
                    </p>
                ) : featured.length === 0 ? (
                    <p className="text-center text-gray-500">
                        New products are coming soon.
                    </p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {featured.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link
                        to="/products"
                        className="inline-block px-8 py-3 rounded-full border-2 border-[#7B1252] text-[#7B1252] font-semibold hover:bg-[#7B1252] hover:text-white transition"
                    >
                        View All Products
                    </Link>
                </div>
            </section>

            {/* Sale banner (only when there are discounted items) */}
            {maxDiscount > 0 && (
                <section className="w-full bg-[#7B1252] text-white">
                    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div>
                            <p className="uppercase tracking-widest text-[#f5c542] text-sm font-semibold">
                                Limited time offers
                            </p>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold">
                                Save up to {maxDiscount}% on selected products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="px-8 py-3 rounded-full bg-[#f5c542] text-gray-900 font-semibold hover:bg-white transition"
                        >
                            Grab the Deals
                        </Link>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="w-full bg-gray-900 text-gray-300 mt-0">
                <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="CBC"
                            className="w-12 h-12 object-contain bg-white rounded-full p-1"
                        />
                        <span className="font-semibold text-white">
                            Crystal Beauty Cosmetics
                        </span>
                    </div>
                    <nav className="flex gap-6 text-sm">
                        <Link to="/products" className="hover:text-white">
                            Products
                        </Link>
                        <Link to="/about" className="hover:text-white">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-white">
                            Contact
                        </Link>
                        <Link to="/search" className="hover:text-white">
                            Search
                        </Link>
                    </nav>
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Crystal Beauty Cosmetics.
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
