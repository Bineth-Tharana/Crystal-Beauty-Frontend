# Crystal Beauty Cosmetics – Frontend

The storefront and admin dashboard for **Crystal Beauty Cosmetics (CBC)**, an online cosmetics store. Customers can browse products, read and write reviews, and place orders. Admins manage products, orders, users and reviews.

**Live site:** https://crystal-beauty-frontend-pink.vercel.app/
**Backend API:** [Crystal-Beauty-Backend](https://github.com/Bineth-Tharana/Crystal-Beauty-Backend)

## Features

### Customers
- Home page with featured products and current offers
- Product list, product search and detailed product pages with image gallery
- Product reviews with star ratings (login required to write one)
- Shopping cart and checkout
- Register, log in with email and password or with Google, and reset a forgotten password with an emailed one-time code
- About, Contact, Privacy Policy and Terms of Service pages

### Admin dashboard (`/admin`)
- **Products:** add, edit and delete products, with image upload
- **Orders:** view all orders with their products and customer details, and update order status
- **Users:** view all users, and block or unblock accounts
- **Reviews:** view all reviews, hide or show them, and delete them

The admin area is only available to accounts with the `admin` role.

## Tech stack

- [React 19](https://react.dev/) with [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for routing
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Axios](https://axios-http.com/) for API requests
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) for Google login
- [Supabase Storage](https://supabase.com/) for product image uploads
- [react-hot-toast](https://react-hot-toast.com/) for notifications, [react-icons](https://react-icons.github.io/react-icons/) for icons

## Getting started

### Prerequisites

- Node.js 18 or newer
- The [backend](https://github.com/Bineth-Tharana/Crystal-Beauty-Backend) running locally, or its deployed URL

### Installation

```bash
git clone https://github.com/Bineth-Tharana/Crystal-Beauty-Frontend.git
cd Crystal-Beauty-Frontend
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL of the backend API, with no trailing slash |
| `VITE_GOOGLE_CLIENT_ID` | OAuth client ID for "Login with Google" |

Vite reads these when it starts, so restart `npm run dev` after changing `.env`. On Vercel, add the same variables under **Settings → Environment Variables** and redeploy.

### Run the app

```bash
npm run dev
```

Open http://localhost:5173.

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |

## Setting up Google login

1. In [Google Cloud Console](https://console.cloud.google.com/), open **APIs & Services → Credentials** and create (or open) an **OAuth 2.0 Client ID** of type *Web application*.
2. Under **Authorized JavaScript origins**, add every address the site runs on, with no trailing slash or path:
   - `http://localhost:5173`
   - your deployed site, for example `https://crystal-beauty-frontend-pink.vercel.app`
3. Copy the client ID into `VITE_GOOGLE_CLIENT_ID`.
4. If the consent screen is in *Testing* mode, only listed test users can log in. Publish the app so everyone can use it.

If you see `Error 400: origin_mismatch`, the address you are using is missing from the authorized origins.

## Project structure

```
src/
├── App.jsx                 # Top-level routes and Google provider
├── main.jsx                # App entry point
├── index.css               # Tailwind setup and brand colors
├── components/             # Header, product card, image slider, reviews, loading spinner
├── pages/
│   ├── home.jsx            # Layout and routes for the customer pages
│   ├── adminPage.jsx       # Admin layout, sidebar and routes
│   ├── login.jsx, register.jsx, forgetPassword.jsx
│   ├── client/             # Customer pages: home, products, product overview,
│   │                       # search, cart, checkout, about, contact, legal
│   └── admin/              # Admin pages: products, orders, users, reviews
└── utils/
    ├── cart.js             # Shopping cart (saved in the browser)
    └── mediaUpload.jsx     # Image upload to Supabase Storage
```

### Main routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/products`, `/search`, `/overview/:id` | Products, search, single product |
| `/cart`, `/checkout` | Cart and checkout |
| `/about`, `/contact`, `/privacy`, `/terms` | Information pages |
| `/login`, `/signup`, `/forget` | Authentication |
| `/admin/products`, `/admin/orders`, `/admin/users`, `/admin/reviews` | Admin dashboard |

## Deployment

The app is deployed on [Vercel](https://vercel.com/). `vercel.json` rewrites every path to `index.html` so direct links such as `/products` work. Set `VITE_BACKEND_URL` and `VITE_GOOGLE_CLIENT_ID` in the Vercel project settings.

## Author

Bineth Tharana
