import { Route, Routes, Link, useLocation, } from "react-router-dom";
import AddProductPage from "./admin/addProductPage";
import AdminProductPage from "./admin/productsPage";
import EditProductPage from "./admin/editProduct";
import AdminOrdersPage from "./admin/adminOrdersPage";
import Loading from "../components/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      window.location.href = "/login";
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.role !== "admin") {
            setStatus("unauthorized");
            toast.error("You are not authorized to access this page");
            window.location.href = "/";
          } else {
            setStatus("authenticated");
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus("unauthenticated");
          toast.error("You are not authenticated, please login");
          window.location.href = "/login";
        });
    }
  }, [status]);

  function getClass(name) {
    if (path.includes(name)) {
      return "bg-accent text-white p-4";
    } else {
      return "text-accent p-4";
    }
  }

  return (
    <div className="w-full h-screen flex bg-accent">
      {status == "loading"?
          <Loading/>:
        <>
          <div className="h-full w-[300px] text-accent font-bold text-xl flex flex-col bg-white">
            <Link className={getClass("products")} to="/admin/products">
              Products
            </Link>
            <Link className={getClass("users")} to="/admin/users">
              Users
            </Link>
            <Link className={getClass("orders")} to="/admin/orders">
              Orders
            </Link>
            <Link className={getClass("reviews")} to="/admin/reviews">
              Reviews
            </Link>
          </div>
          <div className="h-full w-[calc(100%-300px)] border-accent border-4 rounded-xl bg-white">
            <Routes path="/*">
              <Route path="/products" element={<AdminProductPage />} />
              <Route path="/users" element={<h1>Users</h1>} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/reviews" element={<h1>Reviews</h1>} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/edit-product" element={<EditProductPage />} />
            </Routes>
          </div>
        </>
      }
    </div>
  );
}
