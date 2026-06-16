import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"

const DoctorProfile = () => {
    const { id } = useParams()
    const [doctor, setDoctor] = useState(null)
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [loading, setLoading] = useState(false)
    const [symptoms, setSymptoms] = useState("")
    const [booking, setBooking] = useState(false)

    const handleBooking = async() => {
    if(!selectedSlot) return
    try {
        setBooking(true)
        await api.post("/appointments", {
            doctorId: doctor._id,
            slotId: selectedSlot._id,
            symptoms,
            appointmentDate: selectedSlot.date
        })
        alert("Appointment booked successfully!")
    } catch(err) {
        alert(err.response?.data?.message || "Booking failed")
    } finally {
        setBooking(false)
    }
}

    useEffect(() => {
        const fetchDoctor = async() => {
            setLoading(true)
            const res = await api.get(`/doctors/${id}`)
            setDoctor(res.data.doctor)
            const slotRes = await api.get(`/doctors/${id}/slots`)
            setSlots(slotRes.data.slots)
            setLoading(false)
        }
        fetchDoctor()
    }, [id])

    if(loading) return <p className="text-center mt-10">Loading...</p>
    if(!doctor) return <p className="text-center mt-10">Doctor not found</p>

    return (
        <div className="min-h-screen bg-gray-100 p-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
                <img
                    src={doctor.profilePhoto || "https://placehold.co/80x80"}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{doctor.userId?.name}</h1>
                    <p className="text-blue-600">{doctor.specialization}</p>
                    <p className="text-gray-500">Experience: {doctor.experience} years</p>
                    <p className="text-gray-500">Fee: ₹{doctor.consultationFee}</p>
                    <p className="text-yellow-500">Rating: {doctor.rating} ⭐</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Slots</h2>
            {slots.length === 0 ? (
                <p className="text-gray-500">No slots available</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {slots.map((slot) => (
                        <div
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl border cursor-pointer text-center transition ${
                                selectedSlot?._id === slot._id
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                            }`}
                        >
                            <p className="font-medium">{slot.startTime}</p>
                            <p className="text-sm">{slot.endTime}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedSlot && (
    <div className="mt-6">
        <input
            placeholder="Describe your symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
            onClick={handleBooking}
            disabled={booking}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium">
            {booking ? "Booking..." : "Confirm Booking"}
        </button>
    </div>
)}
        </div>
    )
}

export default DoctorProfile