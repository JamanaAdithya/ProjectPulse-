import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import TaskList from "./pages/tasks/TaskList";
import TaskForm from "./pages/tasks/TaskForm";
import TaskDetail from "./pages/tasks/TaskDetail";
import TimeLogForm from "./pages/timeLogs/timeLogForm";
import TaskStats from "./pages/stats/TaskStats";  
import TimeStats from "./pages/stats/TimeStats";  
import ProductivityStats from "./pages/stats/productivityStats";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Route for Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {/* ✅ Nested Routes inside Dashboard */}
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/new" element={<TaskForm />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="tasks/:id/edit" element={<TaskForm />} />
        <Route path="log-time" element={<TimeLogForm />} />
        <Route path="task-stats" element={<TaskStats />} />
        <Route path="time-stats" element={<TimeStats />} />
        <Route path="productivity-score" element={<ProductivityStats />} />
      </Route>
    </Routes>
  );
}

export default App;
