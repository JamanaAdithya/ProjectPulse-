// src/pages/stats/TimeStats.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const TimeStats = () => {
  const { token } = useContext(AuthContext);
  const [timeStats, setTimeStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/time-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimeStats(res.data.stats);
      } catch (error) {
        console.error("Error fetching time stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading time stats...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Time Logged per Project</h2>
      <ul>
        {timeStats.map((stat, index) => (
          <li key={index}>
            Project ID: {stat._id} - <strong>{stat.totalDuration} mins</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeStats;
