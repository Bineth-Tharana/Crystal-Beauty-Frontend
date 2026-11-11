import { Link } from "react-router-dom";
import { BsGem, BsHeart, BsShieldCheck, BsPeople } from "react-icons/bs";

const values = [
    {
        icon: <BsGem />,
        title: "Quality First",
        text: "Every product is carefully selected so you get cosmetics that perform and last.",
    },
    {
        icon: <BsShieldCheck />,
        title: "Authenticity",
        text: "We only sell genuine products, so you can shop with complete confidence.",
    },
    {
        icon: <BsHeart />,
        title: "Care for Your Skin",
        text: "Beauty starts with healthy skin. We choose products that are kind and effective.",
    },
    {
        icon: <BsPeople />,
        title: "Customer Happiness",
        text: "Your satisfaction matters. Our team is always ready to help you find the right match.",
    },
];

const stats = [
    { value: "100%", label: "Authentic products" },
    { value: "24/7", label: "Online shopping" },
    { value: "Island-wide", label: "Delivery" },
];

export default function AboutContent() {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero */}
            <section className="w-full bg-gradient-to-br from-[#fdf2f8] via-white to-[#fff8e1]">
                <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
                    <p className="uppercase tracking-[0.3em] text-sm text-[#7B1252] font-semibold">
                        About Us
                    </p>
                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
                        Beauty that makes you{" "}
                        <span className="text-[#7B1252]">feel confident</span>
                    </h1>
                    <p className="mt-5 text-lg text-gray-600">
                        Crystal Beauty Cosmetics (CBC) is an online beauty store
                        created to bring quality skincare and cosmetics to
                        everyone, with simple shopping and delivery to your
                        door.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="w-full max-w-6xl px-6 py-14 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 flex justify-center">
                    <div className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full bg-gradient-to-tr from-[#7B1252] to-[#f5c542] flex items-center justify-center shadow-xl">
                        <div className="w-[88%] h-[88%] rounded-full bg-white flex items-center justify-center">
                            <img
                                src="/logo.png"
                                alt="Crystal Beauty Cosmetics"
                                className="w-[60%] object-contain"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Our Story
                    </h2>
                    <div className="mt-3 h-1 w-20 rounded bg-[#f5c542]" />
                    <p className="mt-5 text-gray-600 leading-relaxed">
                        Crystal Beauty Cosmetics started with a simple idea:
                        everyone deserves access to trustworthy beauty products
                        without the hassle of searching shop after shop.
                    </p>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        Today we offer a growing range of skincare, makeup and
                        beauty essentials, all in one place. Browse, compare
                        prices and order in a few clicks, and we'll take care
                        of the rest.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full bg-[#7B1252] text-white">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-3xl font-bold text-[#f5c542]">
                                {s.value}
                            </p>
                            <p className="mt-1 text-sm uppercase tracking-wider">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="w-full max-w-6xl px-6 py-14">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">
                        What We Stand For
                    </h2>
                    <div className="mx-auto mt-3 h-1 w-20 rounded bg-[#f5c542]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v) => (
                        <div
                            key={v.title}
                            className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#fdf2f8] text-[#7B1252] flex items-center justify-center text-2xl">
                                {v.icon}
                            </div>
                            <h3 className="mt-4 font-bold text-lg text-gray-800">
                                {v.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {v.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to action */}
            <section className="w-full bg-gradient-to-br from-[#fdf2f8] to-[#fff8e1]">
                <div className="max-w-4xl mx-auto px-6 py-14 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Ready to find your glow?
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Explore our collection or get in touch, we'd love to
                        hear from you.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/products"
                            className="px-8 py-3 rounded-full bg-[#7B1252] text-white font-semibold shadow-lg hover:bg-[#5e0e3f] transition"
                        >
                            Shop Now
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-3 rounded-full border-2 border-[#7B1252] text-[#7B1252] font-semibold hover:bg-[#7B1252] hover:text-white transition"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
