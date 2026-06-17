import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const HealthPlan = () => {
    const [diagnosis, setDiagnosis] = useState("")
    const [patientProfile, setPatientProfile] = useState({ name: "", age: "", gender: "", lifestyle: "" })
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const handleGenerate = async() => {
        if(!diagnosis) return
        try {
            setLoading(true)
            const res = await api.post("/ai/health-plan", { diagnosis, patientProfile })
            setResult(res.data.result)
            console.log(res.data.result.recoveryPlan)
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

    const inputStyle = {
        width: "100%", padding: "12px", border: "1px solid #E5E7EB",
        borderRadius: "8px", fontSize: "14px", outline: "none",
        background: "#F9FAFB", boxSizing: "border-box"
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/patient/dashboard")}>
                    <span style={{ fontSize: "20px" }}>🏥</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <span style={{ fontWeight: "700", color: "#374151" }}>AI Health Plan</span>
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

            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 32px" }}>

                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ width: "64px", height: "64px", background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>💚</div>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>AI Personal Health Plan</h1>
                    <p style={{ color: "#6B7280" }}>Get a personalized recovery plan based on your diagnosis</p>
                </div>

                {/* Form Card */}
                <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Name</label>
                            <input placeholder="Enter your name"
                                value={patientProfile.name}
                                onChange={(e) => setPatientProfile({ ...patientProfile, name: e.target.value })}
                                style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Age</label>
                            <input placeholder="Enter your age"
                                value={patientProfile.age}
                                onChange={(e) => setPatientProfile({ ...patientProfile, age: e.target.value })}
                                style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Gender</label>
                            <select value={patientProfile.gender}
                                onChange={(e) => setPatientProfile({ ...patientProfile, gender: e.target.value })}
                                style={inputStyle}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Lifestyle</label>
                            <select value={patientProfile.lifestyle}
                                onChange={(e) => setPatientProfile({ ...patientProfile, lifestyle: e.target.value })}
                                style={inputStyle}>
                                <option value="">Select lifestyle</option>
                                <option value="Sedentary">Sedentary</option>
                                <option value="Lightly Active">Lightly Active</option>
                                <option value="Moderately Active">Moderately Active</option>
                                <option value="Very Active">Very Active</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Current Diagnosis / Health Condition</label>
                        <input placeholder="e.g. Type 2 Diabetes, Hypertension..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            style={inputStyle} />
                    </div>
                    <button onClick={handleGenerate} disabled={loading || !diagnosis}
                        style={{ width: "100%", padding: "14px", background: "#16A34A", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: diagnosis ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        {loading ? "Generating..." : "✨ Generate Health Plan"}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Recovery Plan */}
                        <div style={{ background: "#EFF6FF", borderRadius: "16px", padding: "28px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                📅 Recovery Plan
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {result.recoveryPlan.map((day, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                        <div style={{ width: "28px", height: "28px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                                            {day.day}
                                        </div>
                                        <p style={{ color: "#374151", fontSize: "14px", paddingTop: "4px" }}>{day.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Diet */}
                        <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "28px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                🥗 Diet Recommendations
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                                {result.dietRecommendations.map((diet, i) => (
                                    <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px" }}>
                                        <p style={{ fontWeight: "700", color: "#111827", marginBottom: "6px", fontSize: "14px" }}>{diet.foodType}</p>
                                        <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: "1.5" }}>{diet.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exercise */}
                        <div style={{ background: "#FFFBEB", borderRadius: "16px", padding: "28px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                🏃 Exercise Suggestions
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                                {result.exerciseSuggestions.map((ex, i) => (
                                    <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px" }}>
                                        <p style={{ fontWeight: "700", color: "#111827", marginBottom: "6px", fontSize: "14px" }}>{ex.exerciseType}</p>
                                        <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: "1.5" }}>{ex.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Medication */}
                        <div style={{ background: "#F5F3FF", borderRadius: "16px", padding: "28px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                💊 Medication Reminders
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                                {result.medicationReminders.map((med, i) => (
                                    <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                            <p style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>{med.medication}</p>
                                            <span style={{ background: "#EDE9FE", color: "#7C3AED", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>{med.dosage}</span>
                                        </div>
                                        <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: "1.5" }}>{med.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HealthPlan