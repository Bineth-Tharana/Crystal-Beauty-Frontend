
import axios from "axios";
import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import Loading from "../../components/loading";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaEye,
  FaReceipt,
  FaTag,
  FaClock,
  FaImage
} from "react-icons/fa";

import toast from "react-hot-toast";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Fetch orders
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    axios.get(
      import.meta.env.VITE_BACKEND_URL + "/api/orders",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
    .then((res) => {
      setOrders(res.data);
    })
    .catch((e) => {
      toast.error(
        e.response?.data?.message || "Error fetching orders"
      );
    })
    .finally(() => {
      setIsLoading(false);
    });

  }, []);


  // Format currency
  function formatPrice(price) {

    return Number(price || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  }


  // Format date
  function formatDate(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

  }


  // Format time
  function formatTime(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  }


  // Status styling
  function getStatusStyle(status) {

    switch (status?.toLowerCase()) {

      case "completed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }


  // Find product in sampleProducts
  function findProduct(productId) {

    return sampleProducts.find(
      (product) => product.productId === productId
    );

  }


  // Normalize order product information
  function getOrderedProduct(item) {

    // Your original Mongoose structure
    let product = item.productInfo;

    // Support orders containing only a product ID
    if (!product && typeof item.productId === "string") {
      product = findProduct(item.productId);
    }

    // Support populated productId objects
    if (!product && typeof item.productId === "object") {
      product = item.productId;
    }

    // Support alternative product property
    if (!product && item.product) {
      product = item.product;
    }

    if (!product) return null;

    // Handle productInfo containing only a product ID
    if (typeof product === "string") {
      product = findProduct(product);
    }

    if (!product) return null;

    // If product information is incomplete, look up catalogue
    const catalogueProduct = findProduct(product.productId);

    return {
      productId: product.productId || catalogueProduct?.productId || "N/A",

      name:
        product.name ||
        product.productName ||
        catalogueProduct?.name ||
        "Unnamed Product",

      description:
        product.description ||
        catalogueProduct?.description ||
        "",

      images:
        product.images?.length > 0
          ? product.images
          : catalogueProduct?.images || [],

      labelledPrice: Number(
        product.labelledPrice ??
        catalogueProduct?.labelledPrice ??
        product.price ??
        0
      ),

      price: Number(
        product.price ??
        catalogueProduct?.price ??
        0
      ),

      quantity: Number(item.quantity ?? item.qty ?? 1)
    };

  }


  // Open order modal
  function openOrder(order) {

    setActiveOrder(order);
    setIsModalOpen(true);

  }


  // Close order modal
  function closeOrder() {

    setIsModalOpen(false);
    setActiveOrder(null);

  }


  // Get active order products
  const activeProducts = (activeOrder?.products || [])
    .map(getOrderedProduct)
    .filter(Boolean);


  // Calculate total quantity
  const totalQuantity = activeProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );


  // Calculate labelled total
  const calculatedLabelledTotal = activeProducts.reduce(
    (total, item) =>
      total + item.labelledPrice * item.quantity,
    0
  );


  // Calculate selling total
  const calculatedTotal = activeProducts.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (

    <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6">

      {/* PAGE HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-secondary">
            Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and monitor customer orders
          </p>
        </div>

        <div className="flex items-center gap-2 bg-accent text-white px-4 py-3 rounded-lg shadow-md">
          <FaShoppingBag />
          <span className="font-semibold">Orders</span>
        </div>

      </div>


      {/* ORDERS TABLE */}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

        {isLoading ? (

          <div className="w-full h-[400px] flex justify-center items-center">
            <Loading />
          </div>

        ) : orders.length === 0 ? (

          <div className="w-full h-[400px] flex flex-col justify-center items-center">

            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />

            <h2 className="text-xl font-bold text-secondary">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-2">
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead className="bg-accent text-white">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4 text-center">Total</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center">Details</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order._id || order.orderId}
                    className="border-b border-gray-200 hover:bg-purple-50 transition"
                  >

                    <td className="px-5 py-4 font-semibold text-accent whitespace-nowrap">
                      {order.orderId}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-700">
                      {order.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.email}
                    </td>

                    <td className="px-5 py-4 text-gray-600 max-w-[200px]">
                      {order.address}
                    </td>

                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {order.phone}
                    </td>

                    <td className="px-5 py-4 text-center font-bold text-accent whitespace-nowrap">
                      Rs. {formatPrice(order.total)}
                    </td>

                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize whitespace-nowrap ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <button
                        onClick={() => openOrder(order)}
                        className="p-2 bg-purple-100 text-accent rounded-lg hover:bg-accent hover:text-white transition"
                      >
                        <FaEye size={17} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* TOTAL ORDERS */}

      {!isLoading && (
        <div className="mt-4 text-gray-500 text-sm">
          Total Orders:{" "}
          <span className="font-bold text-accent">
            {orders.length}
          </span>
        </div>
      )}


      {/* ORDER DETAILS MODAL */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeOrder}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        contentLabel="Order Details"

        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px"
          },

          content: {
            position: "relative",
            inset: "auto",
            width: "100%",
            maxWidth: "950px",
            maxHeight: "90vh",
            padding: "0",
            border: "none",
            borderRadius: "16px",
            overflow: "auto",
            background: "#FBFBFB"
          }
        }}
      >

        {activeOrder && (

          <div className="w-full">

            {/* MODAL HEADER */}

            <div className="bg-accent text-white p-6 flex justify-between items-center sticky top-0 z-10">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaReceipt className="text-xl" />

                  <h2 className="text-2xl font-bold">
                    Order Details
                  </h2>
                </div>

                <p className="text-purple-200 text-sm">
                  Order ID: {activeOrder.orderId}
                </p>
              </div>

              <button
                onClick={closeOrder}
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <FaTimes size={22} />
              </button>

            </div>


            <div className="p-6 space-y-6">


              {/* STATUS AND DATE */}

              <div className="flex flex-wrap justify-between items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Order Status
                  </p>

                  <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusStyle(activeOrder.status)}`}>
                    {activeOrder.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    Order Date
                  </p>

                  <div className="flex items-center gap-2 text-secondary font-semibold">
                    <FaCalendarAlt className="text-accent" />
                    {formatDate(activeOrder.date)}
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <FaClock />
                    {formatTime(activeOrder.date)}
                  </div>
                </div>

              </div>


              {/* CUSTOMER INFORMATION */}

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                <h3 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                  <FaUser className="text-accent" />
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Customer Name
                    </p>
                    <p className="font-semibold text-secondary">
                      {activeOrder.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaEnvelope className="text-accent" />
                      Email Address
                    </p>
                    <p className="font-semibold text-secondary break-all">
                      {activeOrder.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaPhone className="text-accent" />
                      Phone Number
                    </p>
                    <p className="font-semibold text-secondary">
                      {activeOrder.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-accent" />
                      Delivery Address
                    </p>
                    <p className="font-semibold text-secondary">
                      {activeOrder.address || "N/A"}
                    </p>
                  </div>

                </div>

              </div>


              {/* ORDERED PRODUCTS */}

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                <div className="flex justify-between items-center mb-5">

                  <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                    <FaShoppingBag className="text-accent" />
                    Ordered Products
                  </h3>

                  <span className="bg-purple-100 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                    {totalQuantity} Items
                  </span>

                </div>


                {activeProducts.length > 0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                      <thead className="bg-purple-50 text-accent">

                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3 text-center">Quantity</th>
                          <th className="p-3 text-right">Labelled Price</th>
                          <th className="p-3 text-right">Selling Price</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>

                      </thead>

                      <tbody>

                        {activeProducts.map((product, index) => (

                          <tr
                            key={product.productId + "-" + index}
                            className="border-b border-gray-100 hover:bg-purple-50 transition"
                          >

                            {/* PRODUCT */}

                            <td className="p-3 min-w-[250px]">

                              <div className="flex items-center gap-3">

                                {product.images?.[0] ? (

                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                  />

                                ) : (

                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FaImage className="text-2xl text-gray-400" />
                                  </div>

                                )}

                                <div>
                                  <p className="font-semibold text-secondary">
                                    {product.name}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    ID: {product.productId}
                                  </p>
                                </div>

                              </div>

                            </td>


                            {/* QUANTITY */}

                            <td className="p-3 text-center">
                              <span className="bg-purple-100 text-accent px-3 py-1 rounded-md font-semibold">
                                {product.quantity}
                              </span>
                            </td>


                            {/* LABELLED PRICE */}

                            <td className="p-3 text-right whitespace-nowrap text-gray-500">
                              Rs. {formatPrice(product.labelledPrice)}
                            </td>


                            {/* SELLING PRICE */}

                            <td className="p-3 text-right whitespace-nowrap font-semibold text-secondary">
                              Rs. {formatPrice(product.price)}
                            </td>


                            {/* SUBTOTAL */}

                            <td className="p-3 text-right whitespace-nowrap font-bold text-accent">
                              Rs. {formatPrice(product.price * product.quantity)}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="text-center py-10 bg-gray-50 rounded-lg">

                    <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-3" />

                    <p className="text-gray-600 font-semibold">
                      No Product Details Available
                    </p>

                    <p className="text-gray-400 text-sm mt-2">
                      No purchased product IDs or product information were found in this order.
                    </p>

                    <p className="text-xs text-gray-400 mt-3">
                      Order product count: {activeOrder.products?.length || 0}
                    </p>

                  </div>

                )}

              </div>


              {/* PAYMENT SUMMARY */}

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                <h3 className="text-lg font-bold text-secondary mb-5 flex items-center gap-2">
                  <FaTag className="text-accent" />
                  Payment Summary
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between text-gray-600">
                    <span>Labelled Total</span>
                    <span className="font-semibold">
                      Rs. {formatPrice(activeOrder.labelledTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      - Rs. {formatPrice(
                        Number(activeOrder.labelledTotal || 0) -
                        Number(activeOrder.total || 0)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Calculated Products Total</span>
                    <span>
                      Rs. {formatPrice(calculatedTotal)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-3">

                    <div className="flex justify-between items-center">

                      <span className="text-lg font-bold text-secondary">
                        Final Total
                      </span>

                      <span className="text-2xl font-bold text-accent">
                        Rs. {formatPrice(activeOrder.total)}
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* CLOSE BUTTON */}

              <div className="flex justify-end">

                <button
                  onClick={closeOrder}
                  className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition duration-300"
                >
                  Close Details
                </button>

              </div>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}
