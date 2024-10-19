import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import RepairRequest from './pages/RepairRequest';
import Login from './pages/Login';
import RepairStatus from './pages/RepairStatus';
import ProfileAdmin from './Admin/ProfileAdmin';
import ManagerUsers from './pages/ManagerUsers';
import Home from './pages/Home';
import StaticsRepair from './pages/StaticsRepair';

function App() {
  const token = localStorage.getItem('access_Token');

  return (
    <Router>
      <Routes>
        {/* เส้นทางของแต่ละหน้า */}
        <Route path="/" element={<Home />} /> {/* หน้าแรก */}
        <Route path="/repair-request" element={<RepairRequest />} /> {/* หน้าสำหรับแจ้งซ่อม */}
        <Route path="/repair-status" element={<RepairStatus />} /> {/* หน้าแสดงสถานะการซ่อม */}
        <Route path="/manager-users" element={<ManagerUsers />} /> {/* หน้าจัดการผู้ใช้ */}
        <Route path="/statics-repair" element={<StaticsRepair />} /> {/* หน้าสถิติการซ่อม */}

        {/* หากยังไม่ได้ login ให้ไปที่หน้า login เมื่อเข้าหน้า Admin */}
        <Route path="/Administrator" element={!token ? <Login /> : <Navigate to="/Home" />} />

        {/* หน้าสำหรับผู้ที่ login แล้วเท่านั้น */}
        <Route path="/Administrator/ProfileAdmin" element={token ? <ProfileAdmin /> : <Navigate to="/Administrator" />} />

        {/* กรณีไม่พบเส้นทาง ให้ไปที่หน้าแรก */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;