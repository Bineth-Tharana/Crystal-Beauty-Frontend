import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import ProductCard from "./components/productCard";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import AdminPage from "./pages/adminPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPasswordPage from "./pages/forgetPassword";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div>
          <Toaster position="top-right" />
          <Routes path="/*">
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget" element={<ForgetPasswordPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
