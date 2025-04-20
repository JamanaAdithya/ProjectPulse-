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

      {task.timeLogs?.length > 0 ? (
        <div style={{ marginTop: "30px" }}>
          <h3>Time Logs</h3>
          <ul>
            {task.timeLogs.map((log) => (
              <li key={log._id}>
                <strong>User:</strong> {log.user?.name || "Unknown"} <br />
                <strong>Duration:</strong> {log.duration} mins <br />
                <strong>Start:</strong>{" "}
                {new Date(log.startTime).toLocaleString()} <br />
                <strong>End:</strong> {new Date(log.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: "30px" }}>No time logs for this task yet.</p>
      )}
    </div>
  );
};

export default TaskDetail;
