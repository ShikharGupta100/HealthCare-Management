import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "../redux/authSlice.js"
import api from "../services/api.js"

const Login = () => {
  // useState stores what user types in form
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()   // to update Redux store
  const navigate = useNavigate()   // to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault() // stops page reload on form submit
    try {
      const res = await api.post("/auth/login", { email, password })
      const { user, accessToken } = res.data

      // save token in localStorage so it survives refresh
      localStorage.setItem("token", accessToken)

      // save user info in Redux globally
      dispatch(setCredentials({
        user: user,
        token: accessToken,
        role: user.role
      }))

      // redirect based on role
      if (user.role === "patient") navigate("/patient/dashboard")
      else if (user.role === "doctor") navigate("/doctor/dashboard")
      else if (user.role === "admin") navigate("/admin/dashboard")

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Healthcare Login
        </h2>

        {/* show error if login fails */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login


