import { useState, useEffect } from "react"
import api from "../services/api"
import DoctorCard from "../components/DoctorCard"

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDoctors = async() => {
            setLoading(true)
            const res = await api.get("/doctors")
            setDoctors(res.data.doctors)
            setLoading(false)
        }
        fetchDoctors()
    }, [])
    
    return (
    <div className="min-h-screen w-full bg-gray-100 px-6 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Find a Doctor</h1>
        <div className="flex justify-center mb-8">
            <input
                placeholder="Search by specialization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xl px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors
                .filter(doctor => doctor && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                ))
            }
        </div>
    </div>
)
}

export default PatientDashboard