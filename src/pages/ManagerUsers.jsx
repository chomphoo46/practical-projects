import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';

function ManagerUsers() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const [repairCode, setRepairCode] = useState('');
    const [repairData, setRepairData] = useState('');
    const [status, setStatus] = useState('');
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);


    const location = useLocation();
    const { userEmail, userRole} = location.state || {};

    console.log(userEmail)

    useEffect(() => {
        // ดึงอีเมลจาก localStorage
        // const email = localStorage.getItem('user_email');
        // console.log(userEmail, userRole)

        // console.log(email)

        // if (email) {
        //     setUserEmail(email); // ถ้ามีค่าใน localStorage จะตั้งค่าลง state
        // }
        if (userRole != "ADMIN"){
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            navigate('/');
        }
    }, []);
  

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);  // เก็บข้อมูลที่ดึงมาใน state
                } else {
                    setErrorMessage('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();  // เรียกใช้ฟังก์ชันเมื่อ component โหลดครั้งแรก
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_Token');
        localStorage.removeItem('user_email');
        Cookies.remove('access_token');  // ลบคุกกี้ access_token
        Cookies.remove('user_email');    // ลบคุกกี้ user_email หากมีการจัดเก็บไว้
        setUserEmail(''); // รีเซ็ตค่า userEmail เป็นค่าว่าง
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


    // ใช้ useEffect เพื่อจำลองการโหลดข้อมูล
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000); // โหลดข้อมูลเสร็จหลังจาก 1 วินาที
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // ฟังก์ชันนี้สามารถส่งค่ากรองไปยัง backend หรือประมวลผลภายในหน้าเว็บ
        // ตรวจสอบค่าว่าถูกอัพเดตหรือไม่
        if (!repairDate || !repairCode || !status) {
            console.error("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        console.log("Submitting form with values:", { repairDate, repairCode, status });
    };
    

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const Returntohomepage = () => {
        navigate('/');  // นี่คือเส้นทางที่คุณต้องการนำทางไป
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
    const handleStaticsRepair = () => {
        navigate('/statics-repair')
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="bg-[#ff7b00] p-4" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <div>
                        <img src="src/assets/sci_kmitl_logo_1.png" alt="Logo" className="h-10 md:h-12" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4 lg:space-x-6 text-white">
                        <button onClick={Returntohomepage} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3c0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8c24.9-25 24.9-65.5-.1-90.5"></path></svg>
                            <span>หน้าหลัก</span>
                        </button>
                        <button onClick={hadleRepairStatus} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113c-9.3-9.4-9.3-24.6 0-34s24.6-9.4 33.9 0L63 101.1l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L63 261.2l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m-64 160c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32M48 368a48 48 0 1 1 0 96a48 48 0 1 1 0-96"></path></svg>
                            <span>สถานะการแจ้งซ่อม</span>
                        </button>
                        <button onClick={handleRequestRepair} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M78.6 5c-9.5-7.4-23-6.5-31.6 2L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4H158l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3L192 158v-54.1c0-7.5-3.5-14.5-9.4-19zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9l117.8-117.8c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16v-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0c-79.5 0-144 64.5-144 144v.8l85.3 85.3c36-9.1 75.8.5 104 28.7l15.7 15.7c49-23 83-72.8 83-130.5M56 432a24 24 0 1 1 48 0a24 24 0 1 1-48 0"></path></svg>
                            <span>แจ้งปัญหา/แจ้งซ่อม</span>
                        </button>
                        <button onClick={handleStaticsRepair} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M496 496H16V16h32v448h448z"></path><path fill="currentColor" d="M192 432H80V208h112Zm144 0H224V160h112Zm143.64 0h-112V96h112Z"></path></svg>
                            <span>สถิติการแจ้งซ่อม</span>
                        </button>
                        <button onClick={toggleDropdown} className="border-b-2 mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M352 96h64c17.7 0 32 14.3 32 32v256c0 17.7-14.3 32-32 32h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c53 0 96-43 96-96V128c0-53-43-96-96-96h-64c-17.7 0-32 14.3-32 32s14.3 32 32 32m-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"></path></svg>
                            <span>{userEmail ? userEmail : 'เข้าสู่ระบบ'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-32 mt-10 z-10 w-40 bg-white rounded-md shadow-lg">
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Hamburger Icon for Mobile */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-2 space-y-2">
                        <a href="#" className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            หน้าหลัก
                        </a>
                        <a href="#" className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถานะการแจ้งซ่อม
                        </a>
                        <button onClick={handleRequestRepair} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            แจ้งปัญหา/แจ้งซ่อม
                        </button>
                        <a href="#" className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถิติการแจ้งซ่อม
                        </a>
                        <a href="#" className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                )}
            </nav>
            <div className='flex flex-col lg:flex-row justify-between mt-10 mx-4 lg:mx-12'>
                <div className="mx-1.3 sm:mx-7 flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113c-9.3-9.4-9.3-24.6 0-34s24.6-9.4 33.9 0L63 101.1l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L63 261.2l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m-64 160c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32M48 368a48 48 0 1 1 0 96a48 48 0 1 1 0-96"></path></svg>
                    <span style={{ fontFamily: 'MyCustomFont', fontSize: 32 }}>จัดการผู้ใช้</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row mx-4 lg:mx-20 mt-8 space-y-4 md:space-x-4 md:space-y-0">
                <div className="flex space-x-10">
                    {/* รหัสแจ้งซ่อม */}
                    <div className="relative input-with-placeholder w-[210px] max-w-md mx-4 sm:mx-auto md:max-w-lg">
                        <input
                            type="text"
                            className="peer block w-full px-3 py-2 bg-[#F5F5F5] border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-[#ff5f00] placeholder-transparent"
                            value={repairCode}
                            onChange={(e) => setRepairCode(e.target.value)}
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18, color: 'black' }}
                            placeholder=""
                            required
                        />
                        <label
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            htmlFor="repairCode"
                            class="absolute left-3 top-2 transition-all duration-300 text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:px-1 peer-focus:bg-[#F5F5F5] peer-focus:text-gray-500 peer-valid:-translate-y-4 peer-valid:scale-90 peer-valid:px-1 peer-valid:bg-[#F5F5F5] peer-valid:text-gray-500">
                            Email/ชื่อ/นามสกุล
                        </label>
                    </div>


                </div>
                <button
                    type="submit"
                    className="bg-[#ff7b00] text-white mb-4 py-3 px-4 rounded-2xl hover:bg-orange-600 w-[100px] max-w-md mx-4 sm:mx-auto md:max-w-lg"
                >
                    ค้นหา
                </button>

            </form>

            <div className='container mx-20 mt-4' >
                {loading ? (
                    <p>กำลังโหลด...</p>
                ) : (
                    <table className='table-auto w-[1350px] border-collapse overflow-hidden rounded-xl'>
                        <thead>
                            <tr className='bg-[#ff7b00] text-white' style={{ fontFamily: 'MyCustomFont', fontSize: 24 }}>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">ตำแหน่ง</th>
                                <th className="px-4 py-2">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>ไม่มีข้อมูลผู้ใช้</td>
                                </tr>
                            ) : (
                                userData.map((user, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{user.email}</td>
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{user.role}</td>
                                        <td className="py-2 px-4">
                                            <button className="bg-[#FFD200] text-white px-4 mx-2 py-1 rounded-full">
                                                แก้ไข
                                            </button>
                                            <button className="bg-red-500 text-white px-4 py-1 rounded-full">
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
export default ManagerUsers