import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api.js"

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", role: "patient"
    })
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(formData.password !== confirmPassword){
            return setError("Passwords do not match")
        }
        try {
            await api.post("/auth/register", formData)
            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
        }
    }

    const inputStyle = {
        width: "100%",
        padding: "14px 14px 14px 42px",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        fontSize: "15px",
        outline: "none",
        background: "#F9FAFB",
        boxSizing: "border-box"
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <button onClick={() => navigate("/login")}
                    style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
                    Login
                </button>
            </nav>

            {/* Register Card */}
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 32px" }}>
                <div style={{ background: "white", borderRadius: "16px", padding: "48px 40px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>Create Account</h1>
                    <p style={{ color: "#6B7280", marginBottom: "32px" }}>Join thousands managing their health smarter</p>

                    {error && (
                        <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Full Name</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>👤</span>
                                <input type="text" name="name" placeholder="Enter your full name"
                                    value={formData.name} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>✉️</span>
                                <input type="email" name="email" placeholder="Enter your email"
                                    value={formData.email} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔒</span>
                                <input type={showPassword ? "text" : "password"} name="password"
                                    placeholder="Create a password"
                                    value={formData.password} onChange={handleChange} required
                                    style={{ ...inputStyle, paddingRight: "60px" }} />
                                <span onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                    {showPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>🔒</span>
                                <input type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} required
                                    style={{ ...inputStyle, paddingRight: "60px" }} />
                                <span onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                    {showConfirm ? "Hide" : "Show"}
                                </span>
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div style={{ marginBottom: "32px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>Select Role</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                {[
                                    { value: "patient", icon: "👤", title: "Patient", desc: "Book appointments & manage health" },
                                    { value: "doctor", icon: "🩺", title: "Doctor", desc: "Manage appointments & patients" }
                                ].map((role) => (
                                    <div key={role.value}
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        style={{
                                            padding: "20px 16px",
                                            border: `2px solid ${formData.role === role.value ? "#2563EB" : "#E5E7EB"}`,
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            background: formData.role === role.value ? "#EFF6FF" : "white",
                                            transition: "all 0.2s"
                                        }}>
                                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>{role.icon}</div>
                                        <p style={{ fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{role.title}</p>
                                        <p style={{ fontSize: "13px", color: "#6B7280" }}>{role.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit"
                            style={{ width: "100%", padding: "14px", background: "#2563EB", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                            Create Account
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "24px", color: "#6B7280", fontSize: "14px" }}>
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")}
                            style={{ color: "#2563EB", fontWeight: "700", cursor: "pointer" }}>
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register