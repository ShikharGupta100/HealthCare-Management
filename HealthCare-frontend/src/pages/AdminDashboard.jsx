import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../redux/authSlice"
import api from "../services/api"

const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true)
            const statsRes = await api.get("/admin/stats")
            setStats(statsRes.data)
            const usersRes = await api.get("/admin/users")
            setUsers(usersRes.data.users)
            setLoading(false)
        }
        fetchData()
    }, [])

    // const handleApprove = async(doctorId) => {
    //     try {
    //         await api.put(`/admin/doctors/${doctorId}/approve`)
    //         alert("Doctor approved!")
    //         const usersRes = await api.get("/admin/users")
    //         setUsers(usersRes.data.users)
    //     } catch(err) {
    //         alert(err.response?.data?.message || "Failed")
    //     }
    // }

    // const handleDeactivate = async(userId) => {
    //     try {
    //         await api.delete(`/admin/users/${userId}`)
    //         alert("User deactivated!")
    //         const usersRes = await api.get("/admin/users")
    //         setUsers(usersRes.data.users)
    //     } catch(err) {
    //         alert(err.response?.data?.message || "Failed")
    //     }
    // }
    const handleApprove = async (doctorId) => {
    try {
        await api.put(`/admin/doctors/${doctorId}/approve`)
        alert("Doctor approved!")
        const usersRes = await api.get("/admin/users")
        setUsers(usersRes.data.users)
    } catch (err) {
        alert(err.response?.data?.message || "Failed")
    }
}

const handleDeactivate = async (userId) => {
    try {
        await api.patch(`/admin/users/${userId}/deactivate`)  // ← patch, new URL
        alert("User updated!")
        const usersRes = await api.get("/admin/users")
        setUsers(usersRes.data.users)
    } catch (err) {
        alert(err.response?.data?.message || "Failed")
    }
}

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    const avatarColors = ["#EFF6FF", "#F0FDF4", "#FEF3C7", "#FDF2F8", "#F3F4F6"]
    const textColors = ["#2563EB", "#16A34A", "#D97706", "#9333EA", "#6B7280"]

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <span style={{ fontWeight: "700", color: "#374151", fontSize: "16px" }}>Admin Panel</span>
                <button onClick={handleLogout}
                    style={{ padding: "8px 20px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                    Logout
                </button>
            </nav>

            <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>

                {/* Header */}
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Admin Dashboard</h1>
                <p style={{ color: "#6B7280", marginBottom: "32px" }}>Manage users, doctors, and platform activity</p>

                {/* Stats Cards */}
                {stats && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                        {[
                            { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#2563EB", growth: "12% this month" },
                            { label: "Total Doctors", value: stats.totalDoctors, icon: "🩺", color: "#16A34A", growth: "8% this month" },
                            { label: "Total Appointments", value: stats.totalAppointments, icon: "📅", color: "#7C3AED", growth: "18% this month" }
                        ].map((stat, i) => (
                            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "8px" }}>{stat.label}</p>
                                    <p style={{ fontSize: "36px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{stat.value}</p>
                                    <p style={{ color: "#16A34A", fontSize: "13px" }}>↗ {stat.growth}</p>
                                </div>
                                <div style={{ fontSize: "32px" }}>{stat.icon}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* User Management */}
                <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>User Management</h2>

                    {/* Search */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "8px 16px", width: "280px" }}>
                            <span style={{ color: "#9CA3AF" }}>🔍</span>
                            <input placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", width: "100%" }} />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? <p style={{ color: "#6B7280" }}>Loading...</p> : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                                        {["Name", "Email", "Role", "Status", "Actions"].map((h, i) => (
                                            <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user._id} style={{ borderBottom: "1px solid #F3F4F6" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                                            onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: avatarColors[index % 5], color: textColors[index % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: "14px" }}>{user.email}</td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span style={{
                                                    padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                                                    background: user.role === "doctor" ? "#EFF6FF" : user.role === "admin" ? "#F3F4F6" : "#F0FDF4",
                                                    color: user.role === "doctor" ? "#2563EB" : user.role === "admin" ? "#6B7280" : "#16A34A"
                                                }}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span style={{
                                                    padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                                                    background: user.isActive ? "#F0FDF4" : "#FEF2F2",
                                                    color: user.isActive ? "#16A34A" : "#DC2626"
                                                }}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    {user.role === "doctor" && (
                                                        <button onClick={() => handleApprove(user._id)}
                                                            style={{ padding: "6px 14px", background: "#16A34A", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeactivate(user._id)}
                                                        style={{ padding: "6px 14px", background: "white", color: "#EF4444", border: "1px solid #EF4444", borderRadius: "999px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                                                        Deactivate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard