import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLock } from "react-icons/md";
import { RxPerson } from "react-icons/rx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!email || !password) {
            setError("กรุณากรอกอีเมลและรหัสผ่าน");
        } else {
            // หากข้อมูลครบถ้วน เปลี่ยนหน้าไปยัง Dashboard (หรือหน้าที่ต้องการ)
            setError("");
            history.push("/dashboard"); // เปลี่ยนหน้าไปที่ '/dashboard'
        }
    };
    

    return (
        <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: `url('/src/assets/sci.png')` }}>
            <div className="bg-white p-10 rounded-2xl shadow-lg max-w-sm w-full">
                <div className="text-center">
                    <img src="/src/assets/logo.png" alt="School Logo" className="mx-auto mb-5" />
                    <h1 className="text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 48 }}>ยินดีต้อนรับ</h1>
                    <p className="text-black" style={{ fontFamily: 'MycustomFont2', fontSize: 20 }}>สู่ Fix-Sci พวกเราพร้อมให้บริการคุณแล้ว!</p>
                </div>

                <form className="mt-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password"
                        style={{ fontFamily: 'MycustomFont2', fontSize: 16 }}>อีเมล</label>
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <RxPerson />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="email@kmitl.ac.th"
                            className="shadow appearance-none border rounded-xl w-full pl-10 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            style={{ fontFamily: 'MycustomFont2', fontSize: 16 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // บันทึกอีเมลใน state
                        />
                    </div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password"
                        style={{ fontFamily: 'MycustomFont2', fontSize: 16 }}>
                        รหัสผ่าน
                    </label>

                    <div className="relative mb-6" onSubmit={handleLogin}>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <MdOutlineLock />
                        </span>
                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                            className="shadow appearance-none border rounded-xl w-full pl-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            style={{ fontFamily: 'MycustomFont2', fontSize: 16 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // บันทึกรหัสผ่านใน state
                        />
                    </div>
                    {/* แสดงข้อความ error หากกรอกข้อมูลไม่ครบ */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"

                            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full"
                            style={{ fontFamily: 'MyCustomFont', fontSize: 24 }}>
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-500" style={{ fontFamily: 'MyCustomFont2' }}>หรือ</p>
                    <button className="mt-2 flex justify-center items-center border border-gray-300 rounded-xl w-full py-2"
                        style={{ fontFamily: 'MycustomFont2', fontSize: 16 }}>
                        <img src="src\assets\google 1.png" alt="Google Icon" className="w-5 h-5 mr-2" />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login