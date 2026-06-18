
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import api from "../services/api"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ─── Payment Modal Form ───────────────────────────────────────────────────────
const PaymentForm = ({ clientSecret, doctor, selectedSlot, symptoms, onSuccess, onClose }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [paying, setPaying] = useState(false)
    const [error, setError] = useState("")

    const handlePay = async () => {
        if (!stripe || !elements) return
        setPaying(true)
        setError("")

        try {
            // Step 1 — confirm card payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) }
            })

            if (result.error) {
                setError(result.error.message)
                setPaying(false)
                return
            }

            // Step 2 — create appointment
            const appointmentRes = await api.post("/appointments", {
                doctorId: doctor._id,
                slotId: selectedSlot._id,
                symptoms,
                appointmentDate: selectedSlot.date
            })

            const appointmentId = appointmentRes.data.appointment._id
            const paymentIntentId = result.paymentIntent.id

            // Step 3 — confirm payment in backend
            await api.post("/payment/confirm", {
                appointmentId,
                paymentIntentId
            })

            onSuccess()
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed")
        } finally {
            setPaying(false)
        }
    }

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div style={{
                background: "white", borderRadius: "20px", padding: "32px",
                width: "100%", maxWidth: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>Complete Payment</h2>
                        <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>Secure payment powered by Stripe</p>
                    </div>
                    <button onClick={onClose}
                        style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px" }}>
                        ✕
                    </button>
                </div>

                {/* Booking Summary */}
                <div style={{ background: "#F0F9FF", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                    <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px", fontWeight: "600" }}>BOOKING SUMMARY</p>
                    <p style={{ fontWeight: "700", color: "#111827", fontSize: "15px", marginBottom: "4px" }}> {doctor.userId?.name}</p>
                    <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "4px" }}>{doctor.specialization}</p>
                    <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "12px" }}>
                        📅 {new Date(selectedSlot.date).toDateString()} · {selectedSlot.startTime} – {selectedSlot.endTime}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #BAE6FD", paddingTop: "12px" }}>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Consultation Fee</span>
                        <span style={{ fontWeight: "700", color: "#2563EB", fontSize: "18px" }}>₹{doctor.consultationFee}</span>
                    </div>
                </div>

                {/* Card Input */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>
                        Card Details
                    </label>
                    <div style={{ padding: "14px", border: "1px solid #E5E7EB", borderRadius: "10px", background: "#FAFAFA" }}>
                        <CardElement options={{
                            style: {
                                base: { fontSize: "15px", color: "#374151", "::placeholder": { color: "#9CA3AF" } },
                                invalid: { color: "#EF4444" }
                            }
                        }} />
                    </div>
                    <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
                        🔒 Use test card: 4242 4242 4242 4242 · Any future date · Any CVC
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: "#FEF2F2", color: "#EF4444", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Pay Button */}
                <button onClick={handlePay} disabled={paying || !stripe}
                    style={{
                        width: "100%", padding: "14px",
                        background: paying ? "#93C5FD" : "#2563EB",
                        color: "white", border: "none", borderRadius: "10px",
                        fontSize: "16px", fontWeight: "700",
                        cursor: paying ? "not-allowed" : "pointer"
                    }}>
                    {paying ? "Processing..." : `Pay ₹${doctor.consultationFee}`}
                </button>
            </div>
        </div>
    )
}

// ─── Main DoctorProfile Page ──────────────────────────────────────────────────
const DoctorProfile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const [doctor, setDoctor] = useState(null)
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [symptoms, setSymptoms] = useState("")
    const [booking, setBooking] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [showPayment, setShowPayment] = useState(false)
    const [clientSecret, setClientSecret] = useState("")

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true)
            const res = await api.get(`/doctors/${id}`)
            setDoctor(res.data.doctor)
            const slotRes = await api.get(`/doctors/${id}/slots`)
            setSlots(slotRes.data.slots)
            setLoading(false)
        }
        fetchDoctor()
    }, [id])

    const handleBooking = async () => {
        if (!selectedSlot) return
        try {
            setBooking(true)
            const res = await api.post("/payment/create-intent", { doctorId: doctor._id })
            setClientSecret(res.data.clientSecret)
            setShowPayment(true)
        } catch (err) {
            alert(err.response?.data?.message || "Could not initiate payment")
        } finally {
            setBooking(false)
        }
    }

    const handlePaymentSuccess = () => {
        setShowPayment(false)
        alert("Appointment booked & payment successful! 🎉")
        navigate("/my-appointments")
    }

    const handleRating = async () => {
        try {
            await api.post(`/doctors/${doctor._id}/rate`, { rating: userRating })
            alert("Rating submitted successfully!")
            const res = await api.get(`/doctors/${id}`)
            setDoctor(res.data.doctor)
            setUserRating(0)
        } catch (err) {
            alert(err.response?.data?.message || "Rating failed")
        }
    }

    const userInitials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"

    if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>
    if (!doctor) return <p style={{ textAlign: "center", marginTop: "40px" }}>Doctor not found</p>

    return (
        <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <button onClick={() => navigate("/patient/dashboard")}
                    style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                    ← Back to Doctors
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F3F4F6", padding: "8px 16px", borderRadius: "999px" }}>
                        <div style={{ width: "28px", height: "28px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
                            {userInitials}
                        </div>
                        <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>{user?.name}</span>
                    </div>
                    <button onClick={() => navigate("/login")}
                        style={{ color: "#6B7280", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Sub Navbar */}
            <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0 32px", display: "flex", gap: "32px" }}>
                {[
                    { label: "🏠 Home", path: "/" },
                    { label: "📅 Appointments", path: "/my-appointments" },
                    { label: "👨‍⚕️ Doctors", path: "/patient/dashboard" },
                    { label: "🤖 AI Symptom Checker", path: "/symptom-checker" },
                    { label: "💚 Health Plan", path: "/health-plan" }
                ].map((item, i) => (
                    <button key={i} onClick={() => navigate(item.path)}
                        style={{ padding: "16px 0", background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontWeight: "500", fontSize: "14px", borderBottom: "2px solid transparent" }}>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>

                {/* Left Side */}
                <div>
                    {/* Doctor Info */}
                    <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            {doctor.profilePhoto ? (
                                <img src={doctor.profilePhoto} alt="Doctor"
                                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                                    👤
                                </div>
                            )}
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>{doctor.userId?.name}</h1>
                                    <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" }}>
                                        {doctor.specialization}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: "20px", color: "#6B7280", fontSize: "14px" }}>
                                    <span>Experience: {doctor.experience} years</span>
                                    <span>💰 Consultation Fee: ₹{doctor.consultationFee}</span>
                                </div>

                                {/* Rating Display */}
                                <p style={{ color: "#F59E0B", marginTop: "4px" }}>
                                    {"⭐".repeat(Math.round(doctor.rating || 0))} {doctor.rating?.toFixed(1)} stars ({doctor.totalRatings} ratings)
                                </p>

                                {/* Rating Input */}
                                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ fontSize: "14px", color: "#6B7280" }}>Rate this doctor:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} onClick={() => setUserRating(star)}
                                            style={{ fontSize: "24px", cursor: "pointer", color: userRating >= star ? "#F59E0B" : "#D1D5DB" }}>
                                            ★
                                        </span>
                                    ))}
                                    <button onClick={handleRating} disabled={userRating === 0}
                                        style={{ marginLeft: "8px", padding: "6px 16px", background: userRating ? "#2563EB" : "#93C5FD", color: "white", border: "none", borderRadius: "8px", cursor: userRating ? "pointer" : "not-allowed", fontWeight: "600", fontSize: "13px" }}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slots */}
                    <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Available Time Slots</h2>
                            <span style={{ color: "#6B7280", fontSize: "14px" }}>Choose a convenient appointment time</span>
                        </div>
                        {slots.length === 0 ? (
                            <p style={{ color: "#6B7280" }}>No slots available</p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                                {slots.map((slot) => (
                                    <div key={slot._id} onClick={() => setSelectedSlot(slot)}
                                        style={{
                                            padding: "14px 16px",
                                            borderRadius: "10px",
                                            border: `2px solid ${selectedSlot?._id === slot._id ? "#2563EB" : "#E5E7EB"}`,
                                            background: selectedSlot?._id === slot._id ? "#2563EB" : "white",
                                            color: selectedSlot?._id === slot._id ? "white" : "#374151",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}>
                                        <p style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>
                                            {new Date(slot.date).toDateString()}
                                        </p>
                                        <p style={{ fontSize: "13px" }}>{slot.startTime} – {slot.endTime}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side — Booking Card */}
                <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", height: "fit-content" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>Book Appointment</h2>
                    <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>Review your selected slot and share symptoms before confirming.</p>

                    {/* Selected Slot */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Selected Slot</label>
                        <div style={{ padding: "12px 16px", background: "#F3F4F6", borderRadius: "8px", color: "#374151", fontSize: "14px" }}>
                            {selectedSlot
                                ? `${new Date(selectedSlot.date).toDateString()} · ${selectedSlot.startTime} – ${selectedSlot.endTime}`
                                : "No slot selected"}
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "14px" }}>Describe Your Symptoms</label>
                        <textarea
                            placeholder="e.g., headache, fever, fatigue..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            rows={4}
                            style={{ width: "100%", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* Fee Info */}
                    <div style={{ background: "#F0F9FF", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#374151", fontWeight: "600", fontSize: "14px" }}>Consultation Fee</span>
                        <span style={{ color: "#2563EB", fontWeight: "700", fontSize: "18px" }}>₹{doctor.consultationFee}</span>
                    </div>

                    <button onClick={handleBooking} disabled={!selectedSlot || booking}
                        style={{ width: "100%", padding: "14px", background: selectedSlot ? "#2563EB" : "#93C5FD", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: selectedSlot ? "pointer" : "not-allowed" }}>
                        {booking ? "Processing..." : "Proceed to Payment 💳"}
                    </button>

                    <p style={{ color: "#9CA3AF", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                        🔒 Secured by Stripe. You will receive a confirmation email after booking.
                    </p>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                        clientSecret={clientSecret}
                        doctor={doctor}
                        selectedSlot={selectedSlot}
                        symptoms={symptoms}
                        onSuccess={handlePaymentSuccess}
                        onClose={() => setShowPayment(false)}
                    />
                </Elements>
            )}
        </div>
    )
}

export default DoctorProfile