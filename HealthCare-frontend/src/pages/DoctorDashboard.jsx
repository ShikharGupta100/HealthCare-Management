import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [selectedApt, setSelectedApt] = useState(null)
    const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }])
    const [notes, setNotes] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const fetchAppointments = async() => {
        setLoading(true)
        const res = await api.get("/appointments/doctor")
        setAppointments(res.data.appointments)
        setLoading(false)
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(":")
        const h = parseInt(hours)
        const ampm = h >= 12 ? "PM" : "AM"
        const hour12 = h % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
    }

    const handleComplete = async(appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/complete`)
            alert("Appointment marked as completed!")
            fetchAppointments()
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        }
    }

    const handleCreateSlot = async() => {
        try {
            await api.post("/doctors/slots", {
                date,
                startTime: convertTo12Hour(startTime),
                endTime: convertTo12Hour(endTime)
            })
            alert("Slot created successfully!")
            setDate("")
            setStartTime("")
            setEndTime("")
        } catch(err) {
            alert(err.response?.data?.message || "Failed to create slot")
        }
    }

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", duration: "" }])
    }

    const handleMedicineChange = (index, field, value) => {
        const updated = [...medicines]
        updated[index][field] = value
        setMedicines(updated)
    }

    const handleRemoveMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index))
    }

    const handlePrescription = async() => {
        try {
            await api.post("/prescriptions", {
                appointmentId: selectedApt._id,
                patientId: selectedApt.patientId._id,
                medicines,
                notes
            })
            alert("Prescription created!")
            setSelectedApt(null)
            setMedicines([{ name: "", dosage: "", duration: "" }])
            setNotes("")
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"
    const userInitials = getInitials(user?.name)

    const inputStyle = {
        width: "100%", padding: "12px", border: "1px solid #E5E7EB",
        borderRadius: "8px", fontSize: "14px", outline: "none",
        background: "#F9FAFB", boxSizing: "border-box"
    }

    const statusStyle = (status) => ({
        padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700",
        background: status === "completed" ? "#F0FDF4" : status === "cancelled" ? "#FEF2F2" : "#FEF3C7",
        color: status === "completed" ? "#16A34A" : status === "cancelled" ? "#DC2626" : "#D97706"
    })

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: "700", color: "#111827", fontSize: "14px", margin: 0 }}>{user?.name}</p>
                        <p style={{ color: "#6B7280", fontSize: "12px", margin: 0 }}>Doctor</p>
                    </div>
                    <div style={{ width: "40px", height: "40px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
                        {userInitials}
                    </div>
                    <button onClick={handleLogout}
                        style={{ padding: "8px 16px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
                        ↪ Logout
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

                {/* Welcome */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
                        Welcome back, {user?.name} 👋
                    </h1>
                    <p style={{ color: "#6B7280" }}>You have {appointments.filter(a => a.status === "pending").length} pending appointments today.</p>
                </div>

                {/* My Appointments */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>My Appointments</h2>
                    {loading && <p style={{ color: "#6B7280" }}>Loading...</p>}
                    {appointments.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px", background: "white", borderRadius: "16px" }}>
                            <p style={{ fontSize: "40px", marginBottom: "12px" }}>📅</p>
                            <p style={{ color: "#6B7280" }}>No appointments yet</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "16px" }}>
                            {appointments.map((apt) => (
                                <div key={apt._id} style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "44px", height: "44px", background: "#EFF6FF", color: "#2563EB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
                                                {getInitials(apt.patientId?.name)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: "700", color: "#111827", fontSize: "15px", margin: 0 }}>{apt.patientId?.name}</p>
                                                <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>{apt.symptoms}</p>
                                            </div>
                                        </div>
                                        <span style={statusStyle(apt.status)}>{apt.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6B7280", fontSize: "13px", marginBottom: "12px" }}>
                                        <span>📅</span>
                                        <span>{new Date(apt.appointmentDate).toDateString()}</span>
                                        {apt.slotId && <span>• {apt.slotId.startTime}</span>}
                                    </div>
                                    {apt.status === "pending" && (
                                        <button onClick={() => handleComplete(apt._id)}
                                            style={{ padding: "8px 16px", background: "#16A34A", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                                            ✅ Mark Complete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Slot */}
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>Create Time Slot</h2>
                    <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", maxWidth: "480px" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Date</label>
                            <input type="date" value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={inputStyle} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Start Time</label>
                                <input type="time" value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>End Time</label>
                                <input type="time" value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    style={inputStyle} />
                            </div>
                        </div>
                        <button onClick={handleCreateSlot}
                            style={{ width: "100%", padding: "14px", background: "#2563EB", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" }}>
                            CREATE SLOT
                        </button>
                    </div>
                </div>

                {/* Write Prescription */}
                <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>Write Prescription</h2>
                    <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", maxWidth: "600px" }}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Appointment</label>
                            <select onChange={(e) => setSelectedApt(appointments.find(a => a._id === e.target.value))}
                                style={inputStyle}>
                                <option value="">Choose completed visit...</option>
                                {appointments.filter(a => a.status === "completed").map(apt => (
                                    <option key={apt._id} value={apt._id}>
                                        {apt.patientId?.name} - {new Date(apt.appointmentDate).toDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedApt && (
                            <>
                                {medicines.map((med, index) => (
                                    <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                                        <input placeholder="Medicine name" value={med.name}
                                            onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                                            style={{ ...inputStyle, padding: "10px" }} />
                                        <input placeholder="Dosage" value={med.dosage}
                                            onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                            style={{ ...inputStyle, padding: "10px" }} />
                                        <input placeholder="Duration" value={med.duration}
                                            onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                                            style={{ ...inputStyle, padding: "10px" }} />
                                        <button onClick={() => handleRemoveMedicine(index)}
                                            style={{ padding: "10px 12px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button onClick={handleAddMedicine}
                                    style={{ padding: "10px 20px", background: "white", color: "#2563EB", border: "1px solid #2563EB", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginBottom: "16px" }}>
                                    + Add Medicine
                                </button>
                                <textarea placeholder="Additional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    style={{ ...inputStyle, resize: "vertical", marginBottom: "16px" }} />
                                <button onClick={handlePrescription}
                                    style={{ width: "100%", padding: "14px", background: "#2563EB", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                                    Submit Prescription
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard