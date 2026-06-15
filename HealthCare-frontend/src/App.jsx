import { BrowserRouter, Route ,Routes} from "react-router-dom"
import Login from "./pages/LoginPage"
import Register from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Home</div>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/patient/dashboard" element={<div>Patient Dashboard</div>} />
      <Route path="/doctor/dashboard" element={<div>Doctor Dashboard</div>} />
      <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
    </Routes>
    </BrowserRouter>
  )
}
export default App