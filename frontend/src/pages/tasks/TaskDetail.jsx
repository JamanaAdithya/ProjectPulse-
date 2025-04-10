import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data.task);
      } catch (error) {
        console.log(
          "Error fetching task: ",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>{task.title}</h2>
      <p>
        <strong>Description:</strong>{" "}
        {task.description || "No description provided"}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
      </p>
      <p>
        <strong>Assigned To:</strong> {task.assignedTo?.name || "Not assigned"}
      </p>
      <p>
        <strong>Project:</strong> {task.project?.name || "Unknown"}
      </p>

      <button
        onClick={() => navigate(`/dashboard/tasks/${id}/edit`)}
        style={{ marginTop: "15px" }}
      >
        Edit Task
      </button>
    </div>
  );
};

export default TaskDetail;
