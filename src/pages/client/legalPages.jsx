import { Link } from "react-router-dom";

const CONTACT_EMAIL = "bineththarana@gmail.com";
const LAST_UPDATED = "22 November 2026";

function LegalLayout({ label, title, intro, sections }) {
    return (
        <div className="w-full flex flex-col items-center">
            <section className="w-full bg-gradient-to-br from-[#fdf2f8] via-white to-[#fff8e1]">
                <div className="max-w-3xl mx-auto px-6 py-14 text-center">
                    <p className="uppercase tracking-[0.3em] text-sm text-[#7B1252] font-semibold">
                        {label}
                    </p>
                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
                        {title}
                    </h1>
                    <p className="mt-4 text-gray-500">
                        Last updated: {LAST_UPDATED}
                    </p>
                </div>
            </section>

            <article className="w-full max-w-3xl px-6 py-12">
                <p className="text-gray-600 leading-relaxed">{intro}</p>

                {sections.map((s) => (
                    <div key={s.heading} className="mt-8">
                        <h2 className="text-xl font-bold text-[#7B1252]">
                            {s.heading}
                        </h2>
                        {s.paragraphs?.map((p) => (
                            <p
                                key={p}
                                className="mt-2 text-gray-600 leading-relaxed"
                            >
                                {p}
                            </p>
                        ))}
                        {s.list && (
                            <ul className="mt-2 list-disc pl-6 text-gray-600 leading-relaxed space-y-1">
                                {s.list.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    Questions? Email us at{" "}
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[#7B1252] font-semibold underline"
                    >
                        {CONTACT_EMAIL}
                    </a>{" "}
                    or visit our{" "}
                    <Link
                        to="/contact"
                        className="text-[#7B1252] font-semibold underline"
                    >
                        contact page
                    </Link>
                    .
                </div>
            </article>
        </div>
    );
}

export function PrivacyPolicyPage() {
    return (
        <LegalLayout
            label="Legal"
            title="Privacy Policy"
            intro="Crystal Beauty Cosmetics (“we”, “us”) respects your privacy. This policy explains what information we collect when you use our website, how we use it, and the choices you have."
            sections={[
                {
                    heading: "Information we collect",
                    list: [
                        "Account details: your first name, last name, email address and password (stored in encrypted form).",
                        "Google sign-in: if you choose “Login with Google”, we receive your name, email address and profile picture from Google. We do not receive your Google password.",
                        "Order details: your name, phone number, delivery address and the products you order.",
                        "Reviews: the ratings and comments you write about products, shown with your name.",
                        "On your device: a login token and your shopping cart are saved in your browser so you stay signed in and keep your cart.",
                    ],
                },
                {
                    heading: "How we use your information",
                    list: [
                        "To create and manage your account and let you log in.",
                        "To process and deliver your orders and contact you about them.",
                        "To send a one-time code to your email if you reset your password.",
                        "To show your product reviews on our website.",
                        "To keep the website secure and prevent misuse.",
                    ],
                },
                {
                    heading: "Payment information",
                    paragraphs: [
                        "This website does not collect or store your card or bank details.",
                    ],
                },
                {
                    heading: "Sharing your information",
                    paragraphs: [
                        "We do not sell your personal information. We only use trusted services needed to run the website, such as hosting, our database, email delivery and Google sign-in. These services only handle your data to provide their service to us.",
                    ],
                },
                {
                    heading: "Data security and retention",
                    paragraphs: [
                        "Passwords are stored in encrypted form and we take reasonable steps to protect your information. We keep your account and order information for as long as your account is active or as needed to run our business.",
                    ],
                },
                {
                    heading: "Your choices",
                    paragraphs: [
                        `You can ask us to correct or delete your account information at any time by emailing ${CONTACT_EMAIL}. You can also log out and clear your browser data to remove the login token and cart saved on your device.`,
                    ],
                },
                {
                    heading: "Children",
                    paragraphs: [
                        "Our website is not intended for children under 13, and we do not knowingly collect their information.",
                    ],
                },
                {
                    heading: "Changes to this policy",
                    paragraphs: [
                        "We may update this policy from time to time. The date at the top of this page shows when it was last changed.",
                    ],
                },
            ]}
        />
    );
}

export function TermsPage() {
    return (
        <LegalLayout
            label="Legal"
            title="Terms of Service"
            intro="By using the Crystal Beauty Cosmetics website you agree to these terms. Please read them carefully."
            sections={[
                {
                    heading: "Using our website",
                    paragraphs: [
                        "You agree to use the website lawfully and to give accurate information when you register or place an order. You are responsible for keeping your password safe and for activity on your account.",
                    ],
                },
                {
                    heading: "Products and prices",
                    paragraphs: [
                        "We try to describe and photograph our products accurately, but colours and packaging may look slightly different in real life. Prices are shown in Sri Lankan rupees (Rs.) and may change without notice. Products are sold while stock lasts.",
                    ],
                },
                {
                    heading: "Orders",
                    paragraphs: [
                        "Placing an order is an offer to buy. We may cancel or refuse an order, for example if a product is out of stock or details are incorrect, and we will let you know if this happens.",
                    ],
                },
                {
                    heading: "Reviews",
                    paragraphs: [
                        "You may write honest reviews about products. Reviews must not contain offensive, false or unlawful content. We may hide or remove any review at our discretion.",
                    ],
                },
                {
                    heading: "Accounts",
                    paragraphs: [
                        "We may suspend or block accounts that misuse the website or break these terms.",
                    ],
                },
                {
                    heading: "Limitation of liability",
                    paragraphs: [
                        "Cosmetic products can affect people differently. Please check ingredients and do a patch test if you have sensitive skin or allergies. To the extent allowed by law, we are not liable for indirect losses arising from the use of the website or products.",
                    ],
                },
                {
                    heading: "Changes to these terms",
                    paragraphs: [
                        "We may update these terms from time to time. Continuing to use the website means you accept the updated terms.",
                    ],
                },
            ]}
        />
    );
}
