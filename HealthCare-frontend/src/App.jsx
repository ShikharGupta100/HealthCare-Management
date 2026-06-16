import { BrowserRouter, Route ,Routes} from "react-router-dom"
import Login from "./pages/LoginPage"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorProfile from "./pages/DoctorProfile"
import DoctorDashboard from "./pages/DoctorDashboard"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Home</div>}/>
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
    </Routes>
    </BrowserRouter>
  )
}
export default App