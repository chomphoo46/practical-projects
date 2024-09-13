import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Nav from './components/navbar'
import RepairRequest from './components/RepairRequest';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* เส้นทางของแต่ละหน้า */}
        <Route path="/Home" element={<Nav />} /> {/* หน้าแรก */}
        <Route path="/repair-request" element={<RepairRequest />} /> {/* หน้าสำหรับแจ้งซ่อม */}
      </Routes>
    </Router>
  );

}

export default App
