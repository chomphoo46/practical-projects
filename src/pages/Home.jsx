import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';


function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // ดึงอีเมลจาก localStorage
        const email = localStorage.getItem('user_email');
        if (email) {
            setUserEmail(email); // ถ้ามีค่าใน localStorage จะตั้งค่าลง state
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_Token');
        localStorage.removeItem('user_email');
        setUserEmail('');
        setIsDropdownOpen(false);
        // รีเซ็ตค่า userEmail เป็นค่าว่าง
    };
    const toggleDropdown = () => {
        // ถ้ายังไม่ได้ login (userEmail ไม่มีค่า)
        if (!userEmail) {
            // นำผู้ใช้ไปที่หน้า login
            navigate('/Administrator');
        } else {
            // ถ้า login แล้วให้แสดง dropdown
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleRequestRepair = () => {
        navigate('/repair-request');  // นี่คือเส้นทางที่คุณต้องการนำทางไป
    };
    const Administrator = () => {
        navigate('/Administrator');
    };
    const hadleRepairStatus = () => {
        navigate('/repair-status')
    }
    const hadleManageUser = () => {
        navigate('/manager-users')
    }


    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div className="relative w-full h-48 md:h-64 lg:h-72 bg-cover bg-center" style={{ backgroundImage: `url('src/assets/sci 1.png')` }}>
                <div className="absolute inset-0 flex justify-center items-center">
                    <h1 className="text-white text-center" style={{ fontFamily: 'MyCustomFont', fontSize: 48 }}>
                        ระบบแจ้งซ่อมภายในคณะวิทยาศาสตร์
                    </h1>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="container mx-auto py-8 md:py-10 lg:py-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-[1100px] min-h-[450px]">
                {/* แจ้งซ่อม */}
                <div className="flex justify-center">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md shadow-[#FFD200] text-center w-full max-w-* flex flex-col items-center justify-center transition-all duration-300 ease-in-out">
                        <svg svg xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 md:h-14 md:w-14 mx-auto transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-11"
                            viewBox="0 0 512 512">
                            <path
                                fill="currentColor"
                                d="M78.6 5c-9.5-7.4-23-6.5-31.6 2L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4H158l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3L192 158v-54.1c0-7.5-3.5-14.5-9.4-19zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9l117.8-117.8c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16v-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0c-79.5 0-144 64.5-144 144v.8l85.3 85.3c36-9.1 75.8.5 104 28.7l15.7 15.7c49-23 83-72.8 83-130.5M56 432a24 24 0 1 1 48 0a24 24 0 1 1-48 0"></path></svg>
                        <h2 className="text-lg md:text-xl mt-4"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 32 }}>ส่งคำขอแจ้งซ่อม</h2>
                        <button
                            onClick={handleRequestRepair}
                            className="mt-6 inline-block p-1 md:p-1 bg-[#ff7b00] text-white rounded-xl w-[145px] hover:bg-[#ff5f00] transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 28 }}>
                            แจ้งซ่อม
                        </button>
                    </div>
                </div>

                {/* ตรวจสอบสถานะการซ่อม */}
                <div className="flex justify-center">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md shadow-[#FFD200] text-center w-full max-w-* flex flex-col items-center justify-center transition-all duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 md:h-16 md:w-16 mx-auto transition-all duration-300 ease-in-out"
                            viewBox="0 0 512 512">
                            <path
                                fill="currentColor"
                                d="M456.69 421.39L362.6 327.3a173.8 173.8 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.8 173.8 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3M97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8"></path></svg>
                        <h2 className="text-lg md:text-xl mt-4"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 32 }}>ตรวจสอบสถานะการซ่อม</h2>
                        <button
                            onClick={hadleRepairStatus}
                            className="mt-6 inline-block p-1 md:p-1 bg-[#ff7b00] text-white rounded-xl w-[145px] hover:bg-[#ff5f00] transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 28 }}>
                            ตรวจสอบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
