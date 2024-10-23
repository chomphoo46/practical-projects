import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import RepairRequest from './pages/RepairRequest';
import Login from './pages/Login';
import RepairStatus from './pages/RepairStatus';
import ProfileAdmin from './Admin/ProfileAdmin';
import ManagerUsers from './pages/ManagerUsers';
import Home from './pages/Home';
import StaticsRepair from './pages/StaticsRepair';

function App() {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // Retrieve user role from local storage

  return (
    <Router>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/repair-request" element={<RepairRequest />} /> {/* Repair request page */}
        <Route path="/repair-status" element={<RepairStatus />} /> {/* Repair status page */}
        <Route path="/statics-repair" element={<StaticsRepair />} /> {/* Repair statistics page */}

        {/* Admin routes */}
        <Route 
          path="/Administrator" 
          element={!token ? <Login /> : <Navigate to="/Administrator/ProfileAdmin" />} 
        /> {/* Redirect to ProfileAdmin if logged in */}

        <Route 
          path="/Administrator/ProfileAdmin" 
          element={token && userRole === 'Admin' ? <ProfileAdmin /> : <Navigate to="/Administrator" />} 
        /> {/* Only allow Admin users */}

        <Route 
          path="/manager-users" 
          element={token && userRole === 'Admin' ? <ManagerUsers /> : <Navigate to="/Administrator" />} 
        /> {/* Manager users page only for Admins */}

        {/* Fallback for unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
