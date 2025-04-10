import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskForm = () => {
  const { id } = useParams(); // task ID if editing
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    dueDate: "",
    priority: "low",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing task if in edit mode
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        const task = res.data.task;
        setFormData({
          title: task.title,
          description: task.description || "",
          project: task.project?._id || "",
          assignedTo: task.assignedTo?._id || "",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          priority: task.priority || "low",
          status: task.status || "pending",
        });
      } catch (error) {
        console.error(
          "Failed to fetch task:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (id) {
        // Editing
        await axios.put(
          `http://localhost:5000/api/tasks/${id}`,
          formData,
          config
        );
        console.log("Task updated successfully");
      } else {
        // Creating
        await axios.post("http://localhost:5000/api/tasks", formData, config);
        console.log("Task created successfully");
      }

      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error(
        "Error submitting task:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Edit Task" : "Create New Task"}</h2>

      <input
        name="title"
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        name="project"
        type="text"
        placeholder="Project ID"
        value={formData.project}
        onChange={handleChange}
        required
      />
      <input
        name="assignedTo"
        type="text"
        placeholder="Assigned To (User ID)"
        value={formData.assignedTo}
        onChange={handleChange}
      />

      <input
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : id ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
