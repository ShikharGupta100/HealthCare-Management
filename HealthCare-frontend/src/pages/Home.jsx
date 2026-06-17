import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    return (
        <div style={{ fontFamily: "Inter, sans-serif" }}>

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "#2563EB" }}>HealthCare+</span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => navigate("/login")}
                        style={{ padding: "8px 16px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                        Login
                    </button>
                    <button onClick={() => navigate("/register")}
                        style={{ padding: "8px 20px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED, #DB2777)", color: "white", padding: "80px 32px", textAlign: "center" }}>
                <p style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "6px 16px", borderRadius: "999px", fontSize: "14px", marginBottom: "20px" }}>
                    ✨ Smart Healthcare Appointment System
                </p>
                <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: "800", margin: "0 0 16px" }}>
                    Your Health, Our Priority
                </h1>
                <p style={{ fontSize: "18px", opacity: "0.85", maxWidth: "500px", margin: "0 auto 32px" }}>
                    Book appointments instantly, check symptoms with AI, and manage your health — all in one place.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/register")}
                        style={{ padding: "12px 28px", background: "white", color: "#2563EB", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "16px" }}>
                        Get Started
                    </button>
                    <button onClick={() => navigate("/login")}
                        style={{ padding: "12px 28px", background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "16px" }}>
                        Login
                    </button>
                </div>
            </div>

            {/* Features */}
            <div style={{ padding: "80px 32px", background: "white", textAlign: "center" }}>
                <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#1F2937", marginBottom: "12px" }}>Why Choose Us?</h2>
                <p style={{ color: "#6B7280", marginBottom: "48px" }}>Everything you need to manage care, appointments, and insights in one place.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
                    {[
                        { icon: "📅", title: "Book Appointments", desc: "Find and book doctors instantly by specialization and city." },
                        { icon: "🤖", title: "AI Symptom Checker", desc: "Describe your symptoms and get AI-powered health insights." },
                        { icon: "📋", title: "Digital Prescriptions", desc: "Access and manage your prescriptions anytime, anywhere." }
                    ].map((feature, i) => (
                        <div key={i} style={{ padding: "32px 24px", border: "1px solid #E5E7EB", borderRadius: "16px", transition: "box-shadow 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{feature.icon}</div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937", marginBottom: "8px" }}>{feature.title}</h3>
                            <p style={{ color: "#6B7280", lineHeight: "1.6" }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div style={{ padding: "80px 32px", background: "#F9FAFB", textAlign: "center" }}>
                <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#1F2937", marginBottom: "12px" }}>How It Works</h2>
                <p style={{ color: "#6B7280", marginBottom: "48px" }}>A simple flow to get you from signup to consultation quickly.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", maxWidth: "800px", margin: "0 auto" }}>
                    {[
                        { step: "1", title: "Create Account", desc: "Sign up in seconds and set up your health profile." },
                        { step: "2", title: "Find a Doctor", desc: "Browse specialists by city, availability, and ratings." },
                        { step: "3", title: "Book & Consult", desc: "Schedule your visit and connect with your doctor easily." }
                    ].map((item, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                            <div style={{ width: "56px", height: "56px", background: "#2563EB", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", margin: "0 auto 16px" }}>
                                {item.step}
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937", marginBottom: "8px" }}>{item.title}</h3>
                            <p style={{ color: "#6B7280", lineHeight: "1.6" }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={{ padding: "64px 32px", background: "#2563EB", textAlign: "center" }}>
                <h2 style={{ fontSize: "32px", fontWeight: "700", color: "white", marginBottom: "24px" }}>
                    Ready to take control of your health?
                </h2>
                <button onClick={() => navigate("/register")}
                    style={{ padding: "14px 32px", background: "white", color: "#2563EB", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "16px" }}>
                    Get Started Free
                </button>
            </div>

            {/* Footer */}
            <footer style={{ padding: "24px", textAlign: "center", color: "#6B7280", background: "white", borderTop: "1px solid #E5E7EB" }}>
                <p>© 2026 HealthCare+. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home