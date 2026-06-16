import { useNavigate } from "react-router-dom"

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <img
                src={doctor.profilePhoto || "https://placehold.co/64x64"}
                alt="Doctor"
                className="w-16 h-16 rounded-full mb-3 object-cover"
            />
            <h2 className="text-lg font-bold text-gray-800">{doctor.userId?.name}</h2>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            <p className="text-gray-500 text-sm">Experience: {doctor.experience} years</p>
            <p className="text-gray-500 text-sm">Fee: ₹{doctor.consultationFee}</p>
            <p className="text-yellow-500 text-sm">Rating: {doctor.rating} ⭐</p>
            <button
                onClick={() => navigate(`/doctor/${doctor._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Book Appointment
            </button>
        </div>
    )
}

export default DoctorCard