import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched tasks response:", res.data); // 👀
        setTasks(Array.isArray(res.data.tasks) ? res.data.tasks : []);
      } catch (error) {
        console.error(
          "Error fetching tasks",
          error.response?.data || error.message
        );
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <div>
      <h2>All Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
                padding: "8px 0",
              }}
              onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
            >
              <strong>{task.title}</strong> — {task.status} — {task.priority}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
