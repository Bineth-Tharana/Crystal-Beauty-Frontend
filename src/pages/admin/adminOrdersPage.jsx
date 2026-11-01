
import axios from "axios";
import { useEffect, useState } from "react";
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
  FaClock
} from "react-icons/fa";
import toast from "react-hot-toast";
import Modal from "react-modal";

// Set the application root for accessibility
Modal.setAppElement("#root");

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Fetch Orders
  useEffect(() => {

    if (!isLoading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

  }, [isLoading]);


  // Status Badge Styling
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


  // Open Order Details
  function openOrder(order) {
    setActiveOrder(order);
    setIsModalOpen(true);
  }


  // Format Currency
  function formatPrice(price) {
    return Number(price || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }


  // Format Date
  function formatDate(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }


  // Format Time
  function formatTime(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }


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
                    className="border-b border-gray-200 hover:bg-purple-50 transition duration-200"
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
                        className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <select 
                            onChange={async (e) => {
                              const updatedValue = e.target.value;
                              try {
                                const token = localStorage.getItem("token");
                                await axios.put(
                                  `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order.orderId}/${updatedValue}`,
                                {},
                                {
                                  headers: {
                                      Authorization: "Bearer " + token,
                                  },
                                }
                              );  
                              setIsLoading(true);
                              const updatedOrder = {...activeOrder};
                              updatedOrder.status = updatedValue;
                              setActiveOrder(updatedOrder);
                                
                            } catch(e){
                                  toast.error("Error updating order status")
                                  console.log(e);
                                }
                          }}
                      >
                        <option value="" disabled>Change status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                      </select>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <button
                        onClick={() => openOrder(order)}
                        className="p-2 bg-purple-100 text-accent rounded-lg hover:bg-accent hover:text-white transition duration-200"
                        title="View Order Details"
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
        onRequestClose={() => setIsModalOpen(false)}
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
            padding: "16px",
          },

          content: {
            position: "relative",
            inset: "auto",
            width: "100%",
            maxWidth: "850px",
            maxHeight: "90vh",
            padding: "0",
            border: "none",
            borderRadius: "16px",
            overflow: "auto",
            background: "#FBFBFB",
          },
        }}
      >

        {activeOrder && (

          <div className="w-full">

            {/* MODAL HEADER */}

            <div className="bg-accent text-white p-6 flex justify-between items-center">

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
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition"
                title="Close"
              >
                <FaTimes size={22} />
              </button>

            </div>


            <div className="p-6 space-y-6">


              {/* ORDER STATUS AND DATE */}

              <div className="flex flex-wrap justify-between items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                <div>

                  <p className="text-sm text-gray-500 mb-1">
                    Order Status
                  </p>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusStyle(
                      activeOrder.status
                    )}`}
                  >
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

                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <FaUser className="text-accent" />
                  Customer Information
                </h3>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Customer Name */}

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Customer Name
                    </p>

                    <p className="font-semibold text-secondary">
                      {activeOrder.name || "N/A"}
                    </p>
                  </div>


                  {/* Email */}

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaEnvelope className="text-accent" />
                      Email Address
                    </p>

                    <p className="font-semibold text-secondary break-all">
                      {activeOrder.email || "N/A"}
                    </p>
                  </div>


                  {/* Phone */}

                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FaPhone className="text-accent" />
                      Phone Number
                    </p>

                    <p className="font-semibold text-secondary">
                      {activeOrder.phone || "N/A"}
                    </p>
                  </div>


                  {/* Address */}

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

                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <FaShoppingBag className="text-accent" />
                  Ordered Products
                </h3>


                {activeOrder.products?.length > 0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left">

                      <thead className="bg-purple-50 text-accent">

                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3 text-center">Quantity</th>
                          <th className="p-3 text-right">Price</th>
                        </tr>

                      </thead>


                      <tbody>

                        {activeOrder.products.map((product, index) => (

                          <tr
                            key={product._id || product.productId || index}
                            className="border-b border-gray-100"
                          >

                            <td className="p-3 font-medium text-secondary">
                              {product.productName || product.name || product.productId || "Product"}
                            </td>

                            <td className="p-3 text-center text-gray-600">
                              {product.quantity ?? product.qty ?? 1}
                            </td>

                            <td className="p-3 text-right font-semibold text-secondary whitespace-nowrap">
                              Rs. {formatPrice(
                                product.price ?? product.labelledPrice
                              )}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="text-center py-8">

                    <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-3" />

                    <p className="text-gray-500">
                      No product details available for this order.
                    </p>

                  </div>

                )}

              </div>



              {/* ORDER SUMMARY */}

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

                <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <FaTag className="text-accent" />
                  Payment Summary
                </h3>


                <div className="space-y-3">

                  {/* Labelled Total */}

                  <div className="flex justify-between text-gray-600">

                    <span>Labelled Total</span>

                    <span className="font-semibold">
                      Rs. {formatPrice(activeOrder.labelledTotal)}
                    </span>

                  </div>


                  {/* Discount */}

                  <div className="flex justify-between text-green-600">

                    <span>Discount</span>

                    <span className="font-semibold">
                      - Rs. {formatPrice(
                        Math.max(
                          0,
                          Number(activeOrder.labelledTotal || 0) -
                          Number(activeOrder.total || 0)
                        )
                      )}
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


              {/* MODAL FOOTER */}

              <div className="flex justify-end">

                <button
                  onClick={() => setIsModalOpen(false)}
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
