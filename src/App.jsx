import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Nav from './components/navbar'
import repairform from './components/repairform';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Nav />} />
        <Route path="/repair-form" element={<repairform/>} />
      </Routes>
    </Router>
  );

}

export default App
