import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ProductivityStats = () => {
  const { token } = useContext(AuthContext);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductivityScore = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/productivity-score",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setScore(res.data.productivityScore);
      } catch (error) {
        console.error("Error fetching productivity score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityScore();
  }, []);

  if (loading) return <p>Loading Productivity score...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Productivity Score</h2>
      {score !== null ? (
        <p className="text-lg">
          Your productivity score today: <strong>{score}</strong>
        </p>
      ) : (
        <p>No productivity data available for today.</p>
      )}
    </div>
  );
};

export default ProductivityStats;
