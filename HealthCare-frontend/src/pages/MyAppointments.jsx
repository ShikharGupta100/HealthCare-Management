import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const fetchAppointments = async() => {
        setLoading(true)
        const res = await api.get("/appointments/my")
        setAppointments(res.data.appointments)
        setLoading(false)
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const handleCancel = async(appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/cancel`)
            alert("Appointment cancelled!")
            fetchAppointments()
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    const statusStyle = (status) => ({
        padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
        background: status === "completed" ? "#F0FDF4" : status === "cancelled" ? "#FEF2F2" : "#FEF3C7",
        color: status === "completed" ? "#16A34A" : status === "cancelled" ? "#DC2626" : "#D97706"
    })

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/patient/dashboard")}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <span style={{ fontWeight: "700", color: "#374151" }}>My Appointments</span>
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

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>My Appointments</h1>
                    <p style={{ color: "#6B7280" }}>View and manage your upcoming appointments</p>
                </div>

                {loading && <p style={{ color: "#6B7280", textAlign: "center" }}>Loading...</p>}

                {appointments.length === 0 && !loading ? (
                    <div style={{ textAlign: "center", padding: "64px", background: "white", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <p style={{ fontSize: "48px", marginBottom: "16px" }}>📅</p>
                        <p style={{ color: "#6B7280", fontSize: "16px" }}>No appointments yet</p>
                        <button onClick={() => navigate("/patient/dashboard")}
                            style={{ marginTop: "16px", padding: "10px 24px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                            Find a Doctor
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {appointments.map((apt) => (
                            <div key={apt._id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div style={{ width: "52px", height: "52px", background: "#EFF6FF", color: "#2563EB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                                            🩺
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: "700", color: "#111827", fontSize: "16px", marginBottom: "2px" }}>
                                                {apt.doctorId?.specialization || "Doctor"}
                                            </p>
                                            <p style={{ color: "#6B7280", fontSize: "13px" }}>
                                                Consultation Fee: ₹{apt.doctorId?.consultationFee}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={statusStyle(apt.status)}>
                                        {apt.status.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ padding: "12px", background: "#F9FAFB", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>APPOINTMENT DATE</p>
                                        <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>
                                            📅 {new Date(apt.appointmentDate).toDateString()}
                                        </p>
                                    </div>
                                    <div style={{ padding: "12px", background: "#F9FAFB", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "4px" }}>TIME SLOT</p>
                                        <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>
                                            🕐 {apt.slotId?.startTime || "N/A"} - {apt.slotId?.endTime || ""}
                                        </p>
                                    </div>
                                </div>

                                {apt.symptoms && (
                                    <div style={{ padding: "12px 16px", background: "#FFFBEB", borderRadius: "8px", borderLeft: "4px solid #F59E0B", marginBottom: "16px" }}>
                                        <p style={{ fontSize: "11px", color: "#D97706", fontWeight: "600", marginBottom: "4px" }}>SYMPTOMS</p>
                                        <p style={{ color: "#374151", fontSize: "14px" }}>{apt.symptoms}</p>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "12px" }}>
                                    {apt.status === "pending" && (
                                        <button onClick={() => handleCancel(apt._id)}
                                            style={{ padding: "10px 20px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                                            ❌ Cancel Appointment
                                        </button>
                                    )}
                                    {apt.status === "completed" && (
                                        <button onClick={() => navigate("/my-prescriptions")}
                                            style={{ padding: "10px 20px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                                            💊 View Prescription
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyAppointments