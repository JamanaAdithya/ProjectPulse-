import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user?.name || "User"} 👋
        </h1>
        <p className="text-gray-600 mb-6">You are now logged in.</p>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;