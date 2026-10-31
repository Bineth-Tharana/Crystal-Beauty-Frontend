import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((e) => {
          toast.error(e.response?.data?.message || "Failed to load products");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  function deleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Product deleted successfully");
        setIsLoading(true);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to delete product");
      });
  }

  return (
    <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Products</h1>

          <p className="text-gray-500 mt-1">Manage your store products</p>
        </div>

        <Link
          to="/admin/add-product"
          className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-secondary transition duration-300"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>

      {/* Product Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {isLoading ? (
          /* Loading Spinner */
          <div className="w-full h-[400px] flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>

            <p className="text-gray-500 mt-4">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="w-full h-[400px] flex flex-col justify-center items-center">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />

            <h2 className="text-xl font-bold text-secondary">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-2">
              Start by adding your first product.
            </p>

            <Link
              to="/admin/add-product"
              className="mt-5 bg-accent text-white px-5 py-2 rounded-lg hover:bg-secondary transition"
            >
              Add Product
            </Link>
          </div>
        ) : (
          /* Product Table */
          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">
              <thead className="bg-accent text-white">
                <tr>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Image</th>
                  <th className="px-6 py-4 text-center">Labelled Price</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr
                    key={item.productId}
                    className="border-b border-gray-200 hover:bg-purple-50 transition duration-200"
                  >
                    {/* Product ID */}
                    <td className="px-6 py-4 font-semibold text-secondary">
                      {item.productId}
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {item.productName || item.name}
                    </td>

                    {/* Product Image */}
                    <td className="px-6 py-3">
                      <div className="flex justify-center">
                        <img
                          src={item.images?.[0]}
                          alt={item.productName || item.name}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    </td>

                    {/* Labelled Price */}
                    <td className="px-6 py-4 text-center text-gray-600">
                      Rs. {item.labelledPrice}
                    </td>

                    {/* Selling Price */}
                    <td className="px-6 py-4 text-center font-bold text-accent">
                      Rs. {item.price}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            navigate("/admin/edit-product", {
                              state: item,
                            });
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
                          title="Edit Product"
                        >
                          <FaEdit size={17} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteProduct(item.productId)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                          title="Delete Product"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Count */}
      {!isLoading && (
        <p className="text-gray-500 text-sm mt-4">
          Total Products:{" "}
          <span className="font-bold text-accent">{products.length}</span>
        </p>
      )}
    </div>
  );
}
