import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || "User"} 👋</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {/* Navigation (optional but helpful for now) */}
      <nav>
        <button onClick={() => navigate("/dashboard/tasks")}>All Tasks</button>
        <button onClick={() => navigate("/dashboard/tasks/new")}>
          Create Task
        </button>
      </nav>

      {/* Main Content / Nested Routes */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
