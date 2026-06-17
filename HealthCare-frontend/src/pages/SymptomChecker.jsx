import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("")
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const handleCheck = async() => {
        if(!symptoms) return
        try {
            setLoading(true)
            const res = await api.post("/ai/symptom-check", { symptoms })
            setResult(res.data.result)
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/patient/dashboard")}>
                    <span style={{ fontSize: "20px" }}>🏥</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <span style={{ fontWeight: "700", color: "#374151" }}>AI Symptom Checker</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                        {initials}
                    </div>
                    <button onClick={handleLogout}
                        style={{ padding: "8px 16px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 32px" }}>

                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>AI Symptom Checker</h1>
                    <p style={{ color: "#6B7280" }}>Describe your symptoms and get instant AI-powered health insights</p>
                </div>

                {/* Input Card */}
                <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
                    <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                        Describe your symptoms in detail...
                    </label>
                    <textarea
                        placeholder="Describe your symptoms in detail..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={5}
                        style={{ width: "100%", padding: "14px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "15px", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "16px" }}
                    />
                    <button onClick={handleCheck} disabled={loading || !symptoms}
                        style={{ width: "100%", padding: "14px", background: "#7C3AED", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: symptoms ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        {loading ? "Analyzing..." : "✨ Analyze Symptoms"}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            ✅ Analysis Results
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { label: "Possible Condition", value: result.condition, bg: "#EFF6FF", dot: "#2563EB", textColor: "#2563EB" },
                                { label: "Recommended Specialist", value: result.specialist, bg: "#F0FDF4", dot: "#16A34A", textColor: "#16A34A" },
                                { label: "Severity Level", value: result.severity, bg: "#FFFBEB", dot: "#D97706", textColor: "#D97706" },
                                { label: "Medical Advice", value: result.advice, bg: "#F9FAFB", dot: "#9CA3AF", textColor: "#6B7280" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px", background: item.bg, borderRadius: "10px", borderLeft: `4px solid ${item.dot}` }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.dot, flexShrink: 0 }}></div>
                                        <span style={{ fontWeight: "700", color: item.textColor, fontSize: "14px" }}>{item.label}</span>
                                    </div>
                                    <span style={{ color: "#374151", fontSize: "14px", textAlign: "right", maxWidth: "55%" }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SymptomChecker