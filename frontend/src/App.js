import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/logIn'
import Signup from './pages/signUp'
import Dashboard from './pages/dashboard'
import DashHome from './pages/dashHome'
import ProductsPage from './pages/Products'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} >
          <Route index element={<DashHome />} />
          <Route path='products' element={<ProductsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
