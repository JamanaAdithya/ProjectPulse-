import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskForm = () => {
  const { id } = useParams();
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
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Projects
  useEffect(() => {
    const FetchProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/projects",
          config
        );
        setProjects(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch Projects: ",
          error.response?.data || error.message
        );
      }
    };
    FetchProjects();
  }, []);

  // fetch Task if editing
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          config
        );
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
          "Failed to fetch task: ",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  // Fetch Project members when project changes
  useEffect(() => {
    const fetchMembers = async () => {
      if (!formData.project) {
        return;
      }
      setMembersLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${formData.project}/members`,
          config
        );
        setProjectMembers(res.data.members);
      } catch (error) {
        console.error(
          "Failed to fetch members: ",
          error.response?.data || error.message
        );
        setProjectMembers([]);
      } finally {
        setMembersLoading(false); 
      }
    };
    fetchMembers();
  }, [formData.project]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(
          `http://localhost:5000/api/tasks/${id}`,
          formData,
          config
        );
        console.log("Task Updated");
      } else {
        await axios.post("http://localhost:5000/api/tasks", formData, config);
        console.log("Task Created");
      }
      navigate("/dashboard");
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

      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        required
      >
        <option value="">Select Project</option>
        {projects.map((proj) => (
          <option key={proj._id} value={proj._id}>
            {proj.name}
          </option>
        ))}
      </select>

      <select
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        disabled={!formData.project || membersLoading}
        required={projectMembers.length > 0}
      >
        <option value="">
          {formData.project
            ? "Select a project first"
            : membersLoading
            ? "Loading members..."
            : projectMembers.length > 0
            ? "Assign to member"
            : "No members available"}
        </option>
        {projectMembers.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name || member.email}
          </option>
        ))}
      </select>

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
