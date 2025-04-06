import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in with: ", formData);
    await login(formData.email, formData.password);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-2x1 font-bold text-gray-800">
          Welcome back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 p-3 text-while transition hover:bg-blue-600"
          >
            {" "}
            Login
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-md border p-3 transition hover:bg-gray-100">
          <FcGoogle size={20} />
          Login with Google
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
