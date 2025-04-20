import {useEffect, useState, useContext} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import TaskStats from "./TaskStats";
import TimeStats from "./TimeStats";

const StatsOverview = () => {
    const {token} = useContext(AuthContext);
    const [taskStats, setTaskStats] = useState(null);
    const [timeStats, setTimeStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const taskRes = await axios.get("http://localhost:5000/api/dashboard/task-stats", {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const timeRes = await axios.get("http://localhost:5000/api/dashboard/time-stats", {
                    headers: {Authorization: `Bearer ${token}`},
                });

                setTaskStats(taskRes.data);
                setTimeStats(timeRes.data);
            } catch (error) {
                console.error("Error fetching stats:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchstats();
    }, []);
    
    if (loading) return <p>Loading productivity stats...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Productivity Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskStats data={taskStats} />
        <TimeStats data={timeStats} />
      </div>
    </div>
  );
};

export default StatsOverview;