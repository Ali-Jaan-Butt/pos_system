import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/logIn'
import Signup from './pages/signUp'
import Dashboard from './pages/dashboard'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
