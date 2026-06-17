import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        const fetchPrescriptions = async() => {
            setLoading(true)
            const res = await api.get("/prescriptions/my")
            setPrescriptions(res.data.prescription)
            setLoading(false)
        }
        fetchPrescriptions()
    }, [])

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const handleDownloadPDF = async(prescriptionId) => {
        try {
            const res = await api.get(`/prescriptions/${prescriptionId}/pdf`, {
                responseType: "blob"
            })
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `prescription-${prescriptionId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch(err) {
            alert("Failed to download PDF")
        }
    }

    const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/patient/dashboard")}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <span style={{ fontWeight: "700", color: "#374151" }}>My Prescriptions</span>
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
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>My Prescriptions</h1>
                    <p style={{ color: "#6B7280" }}>View and download your prescriptions</p>
                </div>

                {loading && <p style={{ color: "#6B7280", textAlign: "center" }}>Loading...</p>}

                {prescriptions.length === 0 && !loading ? (
                    <div style={{ textAlign: "center", padding: "64px", background: "white", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <p style={{ fontSize: "48px", marginBottom: "16px" }}>💊</p>
                        <p style={{ color: "#6B7280", fontSize: "16px" }}>No prescriptions yet</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {prescriptions.map((prescription) => (
                            <div key={prescription._id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #F3F4F6" }}>
                                    <div>
                                        <p style={{ fontWeight: "700", color: "#111827", fontSize: "16px", marginBottom: "4px" }}>
                                            Dr. {prescription.doctorId?.userId?.name || "Doctor"}
                                        </p>
                                        <p style={{ color: "#6B7280", fontSize: "13px" }}>
                                            {prescription.doctorId?.specialization}
                                        </p>
                                        <p style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "4px" }}>
                                            📅 {new Date(prescription.issuedAt).toDateString()}
                                        </p>
                                    </div>
                                    <button onClick={() => handleDownloadPDF(prescription._id)}
                                        style={{ padding: "10px 20px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        📄 Download PDF
                                    </button>
                                </div>

                                {/* Medicines */}
                                <div style={{ marginBottom: "16px" }}>
                                    <p style={{ fontWeight: "700", color: "#374151", fontSize: "14px", marginBottom: "12px" }}>💊 Medicines</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {prescription.medicines.map((med, i) => (
                                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", padding: "12px 16px", background: "#F9FAFB", borderRadius: "8px" }}>
                                                <div>
                                                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "2px" }}>MEDICINE</p>
                                                    <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{med.name}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "2px" }}>DOSAGE</p>
                                                    <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{med.dosage}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "2px" }}>DURATION</p>
                                                    <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{med.duration}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                {prescription.notes && (
                                    <div style={{ padding: "12px 16px", background: "#FFFBEB", borderRadius: "8px", borderLeft: "4px solid #F59E0B" }}>
                                        <p style={{ fontSize: "12px", color: "#D97706", fontWeight: "600", marginBottom: "4px" }}>DOCTOR'S NOTES</p>
                                        <p style={{ color: "#374151", fontSize: "14px" }}>{prescription.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyPrescriptions