import { BrowserRouter, Route ,Routes} from "react-router-dom"
import Login from "./pages/LoginPage"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorProfile from "./pages/DoctorProfile"
import DoctorDashboard from "./pages/DoctorDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import SymptomChecker from "./pages/SymptomChecker"
import HealthPlan from "./pages/HealthPlan"
import Home from "./pages/Home"
import MyPrescriptions from "./pages/MyPrescriptions"
import MyAppointments from "./pages/MyAppointments"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/patient/dashboard" element={<ProtectedRoute>
        <PatientDashboard/>
      </ProtectedRoute>} />
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute>
          <DoctorDashboard/>
        </ProtectedRoute>} />
          
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard/>
        </ProtectedRoute>
        } />
        <Route path="/doctor/:id" element={
          <ProtectedRoute>
            <DoctorProfile/>
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/symptom-checker" element={
          <ProtectedRoute>
            <SymptomChecker/>
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/health-plan" element={
          <ProtectedRoute>
            <HealthPlan/>
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/my-prescriptions" element={
          <ProtectedRoute>
            <MyPrescriptions/>
          </ProtectedRoute>
        }>
        </Route>
        <Route path="/my-appointments" element={<ProtectedRoute>
          <MyAppointments/>
        </ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}
export default App