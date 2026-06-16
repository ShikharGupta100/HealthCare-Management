import { useState, useEffect } from "react"
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

const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }])
}

const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
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

    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(":")
        const h = parseInt(hours)
        const ampm = h >= 12 ? "PM" : "AM"
        const hour12 = h % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
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

    useEffect(() => {
        const fetchAppointments = async() => {
            setLoading(true)
            const res = await api.get("/appointments/doctor")
            setAppointments(res.data.appointments)
            setLoading(false)
        }
        fetchAppointments()
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Doctor Dashboard</h1>

            <h2 className="text-xl font-bold text-gray-800 mb-4">My Appointments</h2>
            {loading && <p className="text-gray-500">Loading...</p>}
            {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments yet</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white rounded-xl shadow p-4">
                            <p className="font-bold text-gray-800">{apt.patientId?.name}</p>
                            <p className="text-gray-500 text-sm">Symptoms: {apt.symptoms}</p>
                            <p className="text-gray-500 text-sm">Date: {new Date(apt.appointmentDate).toDateString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                apt.status === "completed" ? "bg-green-100 text-green-600" :
                                apt.status === "cancelled" ? "bg-red-100 text-red-600" :
                                "bg-yellow-100 text-yellow-600"
                            }`}>
                                {apt.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Create Slot</h2>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 max-w-md">
                <input type="date" value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="time" value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="time" value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <button onClick={handleCreateSlot}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Create Slot
                </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Write Prescription</h2>
<div className="bg-white rounded-xl shadow p-6 max-w-xl">
    <select onChange={(e) => setSelectedApt(appointments.find(a => a._id === e.target.value))}
        className="w-full px-4 py-2 border rounded-lg mb-4">
        <option value="">Select Appointment</option>
        {appointments.filter(a => a.status === "completed").map(apt => (
            <option key={apt._id} value={apt._id}>
                {apt.patientId?.name} - {new Date(apt.appointmentDate).toDateString()}
            </option>
        ))}
    </select>

    {selectedApt && (
        <>
            {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input placeholder="Medicine" value={med.name}
                        onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"/>
                    <input placeholder="Dosage" value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"/>
                    <input placeholder="Duration" value={med.duration}
                        onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"/>
                </div>
            ))}
            <button onClick={handleAddMedicine}
                className="text-blue-600 text-sm mb-4 hover:underline">
                + Add Medicine
            </button>
            <textarea placeholder="Notes" value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4"/>
            <button onClick={handlePrescription}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Submit Prescription
            </button>
        </>
    )}
</div>
        </div>
    )
}

export default DoctorDashboard