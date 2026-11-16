import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaUsers, FaUserShield, FaUserSlash, FaSearch } from "react-icons/fa";
import Loading from "../../components/loading";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyEmail, setBusyEmail] = useState(null);

  const token = localStorage.getItem("token");
  const currentEmail = (() => {
    try {
      return JSON.parse(atob(token.split(".")[1])).email;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!isLoading) return;

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/users/all", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => setUsers(res.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Error fetching users")
      )
      .finally(() => setIsLoading(false));
  }, [isLoading, token]);

  function toggleBlock(user) {
    const action = user.isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} ${user.email}?`)) {
      return;
    }

    setBusyEmail(user.email);
    axios
      .put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/users/block/" +
          encodeURIComponent(user.email),
        { isBlocked: !user.isBlocked },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => {
        toast.success(`User ${action}ed`);
        setUsers((prev) =>
          prev.map((u) =>
            u.email === user.email ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || `Failed to ${action} user`)
      )
      .finally(() => setBusyEmail(null));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch =
        q === "" ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-full max-h-full overflow-y-auto bg-primary p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-secondary">Users</h1>
        <p className="text-gray-500 mt-1">
          View and manage registered customers and admins
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<FaUsers />}
          label="Total users"
          value={users.length}
          color="bg-accent"
        />
        <StatCard
          icon={<FaUserShield />}
          label="Admins"
          value={adminCount}
          color="bg-green-600"
        />
        <StatCard
          icon={<FaUserSlash />}
          label="Blocked"
          value={blockedCount}
          color="bg-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-accent"
        >
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-accent text-white text-sm uppercase">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
            {filtered.map((user) => {
              const isSelf = user.email === currentEmail;
              return (
                <tr
                  key={user.email}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.img}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      />
                      <span className="font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                        {isSelf && (
                          <span className="ml-2 text-xs text-gray-400">
                            (you)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{user.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      disabled={isSelf || busyEmail === user.email}
                      onClick={() => toggleBlock(user)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                        user.isBlocked
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow p-5">
      <div
        className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
