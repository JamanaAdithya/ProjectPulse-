import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const timeLogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    project: "",
    task: "",
    startTime: "",
    endTime: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Project and tasks
  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
        const projectsRes = await axios.get(
          "http://localhost:5000/api/projects",
          config
        );
        const tasksRes = await axios.get(
          "http://localhost:5000/api/tasks",
          config
        );
        const usersRes = await axios.get(
          "http://localhost:5000/api/users",
          config
        );

        setProjects(projectsRes.data);
        setTasks(tasksRes.data.tasks);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error(
          "Failed to fetch projects, tasks or users: ",
          error.response?.data || error.message
        );
      }
    };

    fetchProjectsAndTasks();
  }, []);

  // Fetch timeLog if editing
  useEffect(() => {
    if (!id) return;
    const fetchTimeLog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/timeLogs/${id}`,
          config
        );
        const timeLog = res.data;
        setFormData({
          user: timeLog.user?._id || "",
          project: timeLog.project?._id || "",
          task: timeLog.task?._id || "",
          startTime: timeLog.startTime ? timeLog.startTime.split("T")[0] : "",
          endTime: timeLog.endTime ? timeLog.endTime.split("T")[0] : "",
          duration: timeLog.duration || "",
        });
      } catch (error) {
        console.error(
          "Failed to fetch time log:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLog();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(
          `http://localhost:5000/api/timeLogs/${id}`,
          formData,
          config
        );
        console.log("TimeLog updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/timeLogs",
          formData,
          config
        );
        console.log("TimeLog created");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error Submitting time log: ",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Edit Time Log" : "Create Time Log"}</h2>

      <select
        name="user"
        value={formData.user}
        onChange={handleChange}
        required
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name || user.email}
          </option>
        ))}
      </select>

      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        required
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>

      <select name="task" value={formData.task} onChange={handleChange}>
        <option value="">Select Task</option>
        {tasks.map((task) => (
          <option key={task._id} value={task._id}>
            {task.title}
          </option>
        ))}
      </select>

      <input
        name="startTime"
        type="datetime-local"
        value={formData.startTime}
        onChange={handleChange}
        required
      />

      <input
        name="endTime"
        type="datetime-local"
        value={formData.endTime}
        onChange={handleChange}
      />

      <input
        name="duration"
        type="number"
        placeholder="Duration in minutes"
        value={formData.duration}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : id ? "Update Time Log" : "Create Time Log"}
      </button>
    </form>
  );
};

export default timeLogForm;
