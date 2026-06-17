import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"
import DoctorCard from "../components/DoctorCard"

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        const fetchDoctors = async() => {
            setLoading(true)
            const res = await api.get("/doctors")
            setDoctors(res.data.doctors)
            setLoading(false)
        }
        fetchDoctors()
    }, [])

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => navigate("/symptom-checker")}
                        style={{ padding: "8px 16px", background: "#7C3AED", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                        🤖 AI Symptom Checker
                    </button>
                    <button onClick={() => navigate("/health-plan")}
                        style={{ padding: "8px 16px", background: "#16A34A", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                        📋 AI Health Plan
                    </button>
                    <button onClick={() => navigate("/my-prescriptions")}
                        style={{ padding: "8px 16px", background: "#0891B2", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                        💊 My Prescriptions
                    </button>
                    <button onClick={() => navigate("/my-appointments")}
                        style={{ padding: "8px 16px", background: "#F59E0B", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                        📅 My Appointments
                    </button>
                    <div style={{ width: "40px", height: "40px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
                        {initials}
                    </div>
                    <button onClick={handleLogout}
                        style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                        ↪ Logout
                    </button>
                </div>
            </nav>

            {/* Header */}
            <div style={{ padding: "32px 32px 0" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Find Your Doctor</h1>
                <p style={{ color: "#6B7280" }}>Search from our network of verified specialists</p>
            </div>

            {/* Search Bar */}
            <div style={{ padding: "24px 32px" }}>
                <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: "200px" }}>
                        <span style={{ color: "#9CA3AF" }}>🔍</span>
                        <input
                            placeholder="Search by doctor name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: "15px", width: "100%", background: "transparent" }}
                        />
                    </div>
                    <button style={{ padding: "10px 24px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        🔍 Search
                    </button>
                </div>
            </div>

            {/* Doctors Grid */}
            <div style={{ padding: "0 32px 32px" }}>
                {loading && <p style={{ color: "#6B7280", textAlign: "center" }}>Loading doctors...</p>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                    {doctors
                        .filter(doctor => doctor &&
                            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((doctor) => (
                            <DoctorCard key={doctor._id} doctor={doctor} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PatientDashboard