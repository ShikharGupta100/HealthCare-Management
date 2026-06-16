import { useState, useEffect } from "react"
import api from "../services/api"

const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)

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

    const handleApprove = async(doctorId) => {
        try {
            await api.put(`/admin/doctors/${doctorId}/approve`)
            alert("Doctor approved!")
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        }
    }

    const handleDeactivate = async(userId) => {
        try {
            await api.delete(`/admin/users/${userId}`)
            alert("User deactivated!")
        } catch(err) {
            alert(err.response?.data?.message || "Failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
                        <p className="text-gray-500 mt-2">Total Users</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-green-600">{stats.totalDoctors}</p>
                        <p className="text-gray-500 mt-2">Total Doctors</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-purple-600">{stats.totalAppointments}</p>
                        <p className="text-gray-500 mt-2">Total Appointments</p>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
            {loading && <p className="text-gray-500">Loading...</p>}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-gray-600 font-medium">Name</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Email</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Role</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Status</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        user.role === "doctor" ? "bg-blue-100 text-blue-600" :
                                        user.role === "admin" ? "bg-purple-100 text-purple-600" :
                                        "bg-green-100 text-green-600"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    {user.role === "doctor" && (
                                        <button
                                            onClick={() => handleApprove(user._id)}
                                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeactivate(user._id)}
                                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboard