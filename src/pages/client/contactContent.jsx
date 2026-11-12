import { useState } from "react";
import toast from "react-hot-toast";
import { BsGeoAlt, BsTelephone, BsEnvelope, BsClock } from "react-icons/bs";

const SHOP = {
    email: "bineththarana@gmail.com",
    phone: "+94 77 279 1085",
    address: "123 Main Street, Colombo, Sri Lanka",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
};

const details = [
    { icon: <BsGeoAlt />, title: "Visit Us", text: SHOP.address },
    { icon: <BsTelephone />, title: "Call Us", text: SHOP.phone },
    { icon: <BsEnvelope />, title: "Email Us", text: SHOP.email },
    { icon: <BsClock />, title: "Opening Hours", text: SHOP.hours },
];

const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#7B1252] focus:ring-2 focus:ring-[#7B1252]/20 transition";

export default function ContactContent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in your name, email and message");
            return;
        }

        // Opens the customer's email app with everything filled in.
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto =
            `mailto:${SHOP.email}` +
            `?subject=${encodeURIComponent(subject || "Message from website")}` +
            `&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
        toast.success("Opening your email app...");
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero */}
            <section className="w-full bg-gradient-to-br from-[#fdf2f8] via-white to-[#fff8e1]">
                <div className="max-w-4xl mx-auto px-6 py-14 md:py-20 text-center">
                    <p className="uppercase tracking-[0.3em] text-sm text-[#7B1252] font-semibold">
                        Contact Us
                    </p>
                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
                        We'd love to{" "}
                        <span className="text-[#7B1252]">hear from you</span>
                    </h1>
                    <p className="mt-5 text-lg text-gray-600">
                        Questions about a product or an order? Send us a message
                        and we'll get back to you as soon as we can.
                    </p>
                </div>
            </section>

            {/* Details + form */}
            <section className="w-full max-w-6xl px-6 py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Details */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {details.map((d) => (
                        <div
                            key={d.title}
                            className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition"
                        >
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#fdf2f8] text-[#7B1252] flex items-center justify-center text-xl">
                                {d.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">
                                    {d.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 break-words">
                                    {d.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="lg:col-span-3 p-6 md:p-8 rounded-xl border border-gray-100 shadow-lg flex flex-col gap-4"
                >
                    <h2 className="text-2xl font-bold text-gray-900">
                        Send us a message
                    </h2>
                    <div className="h-1 w-16 rounded bg-[#f5c542] -mt-2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                        />
                        <input
                            type="email"
                            placeholder="Your email *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={inputClass}
                    />
                    <textarea
                        rows={6}
                        placeholder="Your message *"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={inputClass + " resize-none"}
                    />
                    <button
                        type="submit"
                        className="self-start px-8 py-3 rounded-full bg-[#7B1252] text-white font-semibold shadow-lg hover:bg-[#5e0e3f] transition"
                    >
                        Send Message
                    </button>
                </form>
            </section>
        </div>
    );
}
