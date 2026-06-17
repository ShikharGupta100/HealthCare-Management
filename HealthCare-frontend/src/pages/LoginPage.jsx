
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "../redux/authSlice.js"
import api from "../services/api.js"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post("/auth/login", { email, password })
            const { user, accessToken } = res.data
            localStorage.setItem("token", accessToken)
            dispatch(setCredentials({ user, token: accessToken, role: user.role }))
            if (user.role === "patient") navigate("/patient/dashboard")
            else if (user.role === "doctor") navigate("/doctor/dashboard")
            else if (user.role === "admin") navigate("/admin/dashboard")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <button onClick={() => navigate("/register")}
                    style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
                    Register
                </button>
            </nav>

            {/* Login Card */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
                <div style={{ background: "white", borderRadius: "16px", padding: "48px 40px", width: "100%", maxWidth: "440px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

                    {/* Icon */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <div style={{ width: "64px", height: "64px", background: "#EEF2FF", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
                            💙
                        </div>
                    </div>

                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "8px" }}>Welcome Back</h1>
                    <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "32px" }}>Sign in to your account</p>

                    {error && (
                        <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>✉️</span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "14px 14px 14px 42px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "15px", outline: "none", background: "#F9FAFB", boxSizing: "border-box" }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "12px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "14px 42px 14px 42px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "15px", outline: "none", background: "#F9FAFB", boxSizing: "border-box" }}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#9CA3AF" }}>
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div style={{ textAlign: "right", marginBottom: "24px" }}>
                            <span style={{ color: "#2563EB", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}>Forgot Password?</span>
                        </div>

                        {/* Login Button */}
                        <button type="submit"
                            style={{ width: "100%", padding: "14px", background: "#2563EB", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                            Login
                        </button>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
                            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }}></div>
                            <span style={{ padding: "0 12px", color: "#9CA3AF", fontSize: "14px" }}>OR</span>
                            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }}></div>
                        </div>

                        {/* Google Button */}
                        <button type="button"
                            style={{ width: "100%", padding: "14px", background: "white", color: "#374151", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                            <span>🇬</span> Continue with Google
                        </button>
                    </form>

                    {/* Register Link */}
                    <p style={{ textAlign: "center", marginTop: "24px", color: "#6B7280", fontSize: "14px" }}>
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/register")}
                            style={{ color: "#2563EB", fontWeight: "700", cursor: "pointer" }}>
                            Register here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login


