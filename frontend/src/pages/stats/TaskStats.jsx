import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const TaskStats = () => {
    const {token} = useContext(AuthContext);
    const [taskStats, setTaskStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/dashboard/task-stats", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setTaskStats(res.data.stats);
            } catch (error) {
                console.error("Error fetching task stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats()
    }, []);

    if (loading) return <p>Loading task stats...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task Statistics</h2>
      <ul>
        {taskStats.map((stat) => (
          <li key={stat._id}>
            {stat._id}: <strong>{stat.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskStats;