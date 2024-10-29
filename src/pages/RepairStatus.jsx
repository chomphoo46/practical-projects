import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaEdit, FaSave } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import { id } from 'date-fns/locale';


function RepairStatus() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const [repairDate, setRepairDate] = useState('');
    const [repairCode, setRepairCode] = useState('');
    const [repairData, setRepairData] = useState([]);
    const [repairDetails, setRepairDetails] = useState({});

    async function fetchProfile() {
        try {
            const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
                method: 'GET',
                credentials: 'include',
            });

            if (profileResponse.status === 200) {
                const profileData = await profileResponse.json();
                console.log(profileData)

                setUserEmail(profileData.email);
                setUserRole(profileData.role); // ตั้งค่า role ที่นี่
                console.log("User Role:", profileData.role);
            } else {
                setUserEmail('');
                setUserRole(''); // เคลียร์ role ถ้าไม่พบ
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setUserEmail('');
            setUserRole(''); // เคลียร์ role ถ้าเกิดข้อผิดพลาด
        }
    }
    useEffect(() => {

        const accessToken = Cookies.get('access_token');
        if (accessToken) {
            fetchProfile();
        }
    }, []);
    // ฟังก์ชันเปิด modal และดึงข้อมูลจาก backend
    const openModal = async (repairid) => {
        setIsModalOpen(true);

        try {
            console.log(`Fetching details for repair ID: ${repairid}`);
            const response = await fetch(`http://localhost:3000/api/maintenances/${repairid}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });
            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setRepairDetails(data);  // เก็บข้อมูลที่ดึงมาจาก backend
            } else {
                console.error('Failed to fetch repair details');
            }
        } catch (error) {
            console.error('Error fetching repair details:', error);
        }
    };

    /**
     * ปิด modal และ reset ค่า repairDetails
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setRepairDetails(null);

    };

    const handleLogout = () => {
        localStorage.removeItem('access_Token');
        localStorage.removeItem('user_email');
        Cookies.remove('access_token');  // ลบคุกกี้ access_token
        Cookies.remove('user_email');    // ลบคุกกี้ user_email หากมีการจัดเก็บไว้
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


    // ใช้ useEffect เพื่อจำลองการโหลดข้อมูล
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000); // โหลดข้อมูลเสร็จหลังจาก 1 วินาที
    }, []);
    const [status, setStatus] = useState('');
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(true);


    const [statuses, setStatuses] = useState({
        waiting: 0,
        repairing: 0,
        waitingParts: 0,
        cannotRepair: 0,
        finished: 0,
    });
    // จำลองการดึงข้อมูลจาก backend
    useEffect(() => {
        async function fetchRepairData() {
            try {
                const response = await fetch('http://localhost:3000/api/maintenances', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRepairData(data);  // เก็บข้อมูลที่ดึงมาใน state
                } else {
                    setErrorMessage('ไม่สามารถดึงข้อมูลการแจ้งซ่อมได้');
                }
            } catch (error) {
                console.error("Error fetching repair data:", error);
                setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
            } finally {
                setLoading(false);
            }
        }

        fetchRepairData();  // เรียกใช้ฟังก์ชันเมื่อ component โหลดครั้งแรก
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

    //แปลงเป็นภาษาไทย
    const statusMapping = {
        'PENDING': 'รอดำเนินการ',
        'IN_PROGRESS': 'กำลังซ่อม',
        'WAITING_FOR_PART': 'รออะไหล่',
        'NOT_REPAIRABLE': 'ซ่อมไม่ได้',
        'COMPLETED': 'เสร็จเรียบร้อย'
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
    const handleManageUser = () => {
        if (userRole === 'ADMIN') {
            // navigate('/manager-users', { state: { userEmail} });
            navigate('/manager-users', { state: { userEmail, userRole } });
        } else {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        }
    };
    const handleStaticsRepair = () => {
        navigate('/statics-repair')
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editableValue, setEditableValue] = useState('นายธนทร เกิดเปี่ยม');
    const [editableReason, setEditableReason] = useState('');
    const [editableStatus, setEditableStatus] = useState('เสร็จเรียบร้อย');

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (value) => {
        setEditableValue(value); // อัปเดตข้อมูลฟิลด์ "ผู้ดำเนินการ" ขณะกำลังแก้ไข
    };
    const handleReasonChange = (newReason) => {
        setEditableReason(newReason); // อัปเดตข้อมูลฟิลด์ "สาเหตุ/วิธีแก้ไข" ขณะกำลังแก้ไข
    };
    const handleStatusChange = (newStatus) => {
        setEditableStatus(newStatus); // อัปเดตสถานะขณะแก้ไข
    };



    const handleSave = () => {
        const updatedReports = reports.map((report) => {
            if (report.label === 'ผู้ดำเนินการ') {
                return { ...report, value: editableValue };
            } else if (report.label === 'สาเหตุ/วิธีแก้ไข') {
                return { ...report, value: editableReason };
            } else if (report.label === 'สถานะการดำเนินการ') {
                return { ...report, value: editableStatus }; // อัปเดตสถานะการดำเนินการ
            }
            return report;
        });

        setReports(updatedReports);
        setIsEditing(false); // ออกจากโหมดแก้ไขหลังจากบันทึกข้อมูล
    };

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
                        <a href="#" className="border-b-2 mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113c-9.3-9.4-9.3-24.6 0-34s24.6-9.4 33.9 0L63 101.1l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L63 261.2l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m-64 160c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32M48 368a48 48 0 1 1 0 96a48 48 0 1 1 0-96"></path></svg>
                            <span>สถานะการแจ้งซ่อม</span>
                        </a>
                        <button onClick={handleRequestRepair} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M78.6 5c-9.5-7.4-23-6.5-31.6 2L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4H158l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3L192 158v-54.1c0-7.5-3.5-14.5-9.4-19zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9l117.8-117.8c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16v-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0c-79.5 0-144 64.5-144 144v.8l85.3 85.3c36-9.1 75.8.5 104 28.7l15.7 15.7c49-23 83-72.8 83-130.5M56 432a24 24 0 1 1 48 0a24 24 0 1 1-48 0"></path></svg>
                            <span>แจ้งปัญหา/แจ้งซ่อม</span>
                        </button>
                        <button onClick={handleStaticsRepair} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M496 496H16V16h32v448h448z"></path><path fill="currentColor" d="M192 432H80V208h112Zm144 0H224V160h112Zm143.64 0h-112V96h112Z"></path></svg>
                            <span>สถิติการแจ้งซ่อม</span>
                        </button>
                        <button onClick={toggleDropdown} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
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
                                    {/* ตรวจสอบ Role ก่อนแสดงปุ่มจัดการผู้ใช้ */}
                                    {userRole === 'ADMIN' && (
                                        <button
                                            onClick={handleManageUser}
                                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            จัดการผู้ใช้
                                        </button>
                                    )}
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
                    <span style={{ fontFamily: 'MyCustomFont', fontSize: 32 }}>สถานะการแจ้งซ่อม</span>
                </div>
                <div className="justify-center mr-14 mt-4 text-base lg:text-lg" style={{ fontFamily: 'MyCustomFont2', fontSize: 24 }}>
                    <span>สถานะที่ค้างอยู่: </span>
                    <span className="text-[#FF9900]">รอดำเนินการ ({statuses.waiting}) </span>
                    <span className="text-[#2CD9FF]">กำลังซ่อม ({statuses.repairing}) </span>
                    <span className="text-[#007CEE]">รออะไหล่ ({statuses.waitingParts}) </span>
                    <span className="text-red-500">ซ่อมไม่ได้ ({statuses.cannotRepair}) </span>
                    <span className="text-green-500">เสร็จเรียบร้อย ({statuses.finished}) </span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row mx-4 lg:mx-20 mt-8 space-y-4 md:space-x-4 md:space-y-0">
                <div className="flex space-x-10">
                    {/* วันที่แจ้งซ่อม */}
                    <div className="relative input-with-placeholder max-w-md mx-4 sm:mx-auto md:max-w-lg" style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}>
                        <DatePicker
                            selected={repairDate}
                            onChange={(date) => {
                                console.log('Date selected:', date);  // ตรวจสอบค่า
                                setRepairDate(date);
                            }}
                            dateFormat="dd/MM/yyyy"
                            className="peer block w-full px-3 py-2 pr-10 bg-[#F5F5F5] border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-[#ff5f00] placeholder-transparent"
                            placeholderText="เลือกวันที่"
                        //popperPlacement="bottom"
                        />
                        <label
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            className={`absolute left-3 top-2 transition-all duration-300 text-gray-500 bg-[#F5F5F5]
          ${repairDate ? '-translate-y-5 scale-90' : 'translate-y-[0] scale-100'} 
          peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:left-3 peer-focus:bg-[#F5F5F5] peer-focus:text-black`}
                        >
                            วันที่แจ้งซ่อม
                        </label>

                        {/* ไอคอนปฏิทิน */}
                        {/* <span className="absolute right-3 top-2 my-1 text-gray-500">
                            <MdOutlineCalendarMonth />
                        </span> */}
                    </div>
                </div>

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
                        class="absolute left-3 top-2 transition-all duration-300 text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-1 peer-focus:bg-[#F5F5F5] peer-focus:text-gray-500 peer-valid:-translate-y-4 peer-valid:scale-90 peer-valid:px-1 peer-valid:bg-[#F5F5F5] peer-valid:text-gray-500">
                        รหัสแจ้งซ่อม
                    </label>
                </div>

                {/* สถานะ */}
                <div className="relative input-with-placeholder max-w-md mx-4 sm:mx-auto md:max-w-lg">
                    <select
                        className={`w-[210px] peer block  rounded-2xl border-2 border-gray-400 bg-[#F5F5F5] px-3 py-[0.8rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-orange-500 ${status === "" ? "bg-[#F5F5F5]" : ""}`}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        onBlur={() => setFocused(false)}
                        onFocus={() => setFocused(true)}
                        style={{ fontFamily: 'MyCustomFont2', fontSize: 18, color: 'black' }}
                    >
                        <option hidden value=""></option>
                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                        <option value="กำลังซ่อม">กำลังซ่อม</option>
                        <option value="รออะไหล่">รออะไหล่</option>
                        <option value="ซ่อมไม่ได้">ซ่อมไม่ได้</option>
                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>

                    </select>
                    <label
                        className={`absolute left-3 top-2 text-gray-500 transition-all duration-300
                    ${focused || status !== "" ? "-translate-y-4 scale-90 bg-[#F5F5F5] px-1 text-black" : "translate-y-0 scale-100"}`}
                        style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                    >
                        สถานะ
                    </label>
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
                                <th className="px-4 py-2">รหัสแจ้งซ่อม</th>
                                <th className="px-4 py-2">วันที่แจ้งซ่อม</th>
                                <th className="px-4 py-2">อีเมลผู้แจ้ง</th>
                                <th className="px-4 py-2">ปัญหาที่พบ</th>
                                <th className="px-4 py-2">สถานะ</th>
                                <th className="px-4 py-2">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>ไม่มีข้อมูลการแจ้งซ่อม</td>
                                </tr>
                            ) : (
                                repairData.map((repair, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{repair.id}</td>
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{new Date(repair.requestDate).toLocaleString()}</td>
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{repair.user?.email || 'No User'}</td>
                                        <td className="py-2 px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>{repair.equipment}</td>
                                        <td className={`py-2 px-4 ${statusMapping[repair.status] === 'รอดำเนินการ' ? 'text-[#FF9900]' :
                                                statusMapping[repair.status] === 'กำลังซ่อม' ? 'text-[#2CD9FF]' :
                                                    statusMapping[repair.status] === 'รออะไหล่' ? 'text-[#007CEE]' :
                                                        statusMapping[repair.status] === 'ซ่อมไม่ได้' ? 'text-red-400' :
                                                            statusMapping[repair.status] === 'เสร็จเรียบร้อย' ? 'text-green-500' : ''
                                            }`}
                                            style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}
                                        >
                                            {statusMapping[repair.status] || repair.status}
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => openModal(repair.id)}
                                                style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}
                                                className="bg-[#FFD200] text-black px-4 py-1 rounded-full"
                                            >
                                                รายละเอียด
                                            </button>

                                            {/* Modal */}
                                            {isModalOpen && repairDetails && (
                                                <div
                                                    id="default-modal"
                                                    tabIndex="-1"
                                                    aria-hidden="true"
                                                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
                                                >
                                                    <div className="relative p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                                        <div className="relative bg-white shadow h-full">
                                                            {/* Modal header */}
                                                            <div className="flex items-center p-2 border-b rounded-t">
                                                                <div>
                                                                    {/* Icon */}
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                                                                        <path fill="currentColor" d="M78.6 5c-9.5-7.4-23-6.5-31.6 2L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4H158l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3L192 158v-54.1c0-7.5-3.5-14.5-9.4-19zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9l117.8-117.8c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16v-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0c-79.5 0-144 64.5-144 144v.8l85.3 85.3c36-9.1 75.8.5 104 28.7l15.7 15.7c49-23 83-72.8 83-130.5M56 432a24 24 0 1 1 48 0a24 24 0 1 1-48 0"></path>
                                                                    </svg>
                                                                </div>
                                                                <div
                                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 32 }}
                                                                    className="text-black ml-2">
                                                                    รายละเอียดรายการแจ้งซ่อม
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={closeModal}
                                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center ml-auto"
                                                                >
                                                                    {/* Close button icon */}
                                                                    <svg
                                                                        className="w-3 h-3"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 14 14"
                                                                    >
                                                                        <path
                                                                            stroke="currentColor"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                                        />
                                                                    </svg>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                            </div>
                                                            {/* ข้อมูลการแจ้งปัญหา */}
                                                            <div
                                                                className="flex p-1 mx-2 mt-4 bg-[#ff7b00] text-white"
                                                                style={{ fontFamily: 'MyCustomFont2', fontSize: 24 }}>
                                                                ข้อมูลการแจ้งปัญหา
                                                            </div>
                                                            <div className="container">
                                                                <table
                                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                                                    className="table-auto w-[98%] m-auto mt-4 text-left border border-gray-300">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">ปัญหาที่พบ</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.equipment}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">รหัสแจ้งซ่อม</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.id}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">วันที่แจ้งซ่อม</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{new Date(repairDetails.requestDate).toLocaleString()}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">อีเมลผู้แจ้ง</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repair?.user?.email || 'No User'}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">สถานที่</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.building}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">รูปภาพ</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.imageFileName ? (
                                                                                <img
                                                                                    src={`http://localhost:3000/api/pictures/${repairDetails.imageFileName}`} // เปลี่ยนเส้นทางให้ตรงกับที่เก็บภาพของคุณ
                                                                                    alt="Repair Image"
                                                                                    className="w-96 h-auto" // ปรับขนาดตามที่คุณต้องการ
                                                                                />
                                                                            ) : (
                                                                                "ไม่มีรูปภาพ"
                                                                            )}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* ข้อมูลการดำเนินการ */}
                                                            <div
                                                                className="flex p-1 mx-2 mt-4 bg-[#FFD200] text-white"
                                                                style={{ fontFamily: 'MyCustomFont2', fontSize: 24 }}>
                                                                ข้อมูลการดำเนินการ
                                                            </div>
                                                            <div className="container">
                                                                <table
                                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                                                    className="table-auto w-[98%] m-auto mt-4 text-left border border-gray-300">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">วันที่ดำเนินการ</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left pr-96"> {repairDetails.records?.recordDate
                                                                                ? new Date(repairDetails.records.recordDate).toLocaleString()
                                                                                : 'ไม่มีข้อมูล'}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">ผู้ดำเนินการ</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left"> {repairDetails.records?.technician
                                                                                ? `${repairDetails.records.technician.firstName} ${repairDetails.records.technician.lastName}`
                                                                                : 'ไม่มีข้อมูล'}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">สาเหตุ/วิธีแก้ไข</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.records?.details || 'ไม่มีข้อมูล'}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">สถานะการดำเนินการ</td>
                                                                            <td
                                                                                className={`p-2 border border-r border-gray-300 text-left ${statusMapping[repairDetails.status] === 'รอดำเนินการ' ? 'text-[#FF9900]' :
                                                                                        statusMapping[repairDetails.status] === 'กำลังซ่อม' ? 'text-[#2CD9FF]' :
                                                                                            statusMapping[repairDetails.status] === 'รออะไหล่' ? 'text-[#007CEE]' :
                                                                                                statusMapping[repairDetails.status] === 'ซ่อมไม่ได้' ? 'text-red-400' :
                                                                                                    statusMapping[repairDetails.status] === 'เสร็จเรียบร้อย' ? 'text-green-500' : ''
                                                                                    }`}
                                                                                style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}
                                                                            >
                                                                                {statusMapping[repairDetails.status] || repairDetails.status}
                                                                            </td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">รูปภาพ</td>
                                                                            <td className="p-2 border border-r border-gray-300 text-left">{repairDetails.records?.imageFileName ? (
                                                                                <img
                                                                                    src={`http://localhost:3000/api/pictures/${repairDetails.records.imageFileName}`} // เปลี่ยนเส้นทางให้ตรงกับที่เก็บภาพของคุณ
                                                                                    alt="Repair Image"
                                                                                    className="w-96 h-auto" // ปรับขนาดตามที่คุณต้องการ
                                                                                />
                                                                            ) : (
                                                                                "ไม่มีรูปภาพ"
                                                                            )}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                {/* <div className="flex justify-end mt-4">
                                                                    {isEditing ? (
                                                                        <button
                                                                            onClick={handleSave}
                                                                            className="bg-blue-500 text-white px-4 py-2 rounded">
                                                                            บันทึก
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setIsEditing(true)}
                                                                            className="bg-yellow-500 text-white px-4 py-2 rounded">
                                                                            แก้ไข
                                                                        </button>
                                                                    )}
                                                                </div> */}
                                                            </div>
                                                            <div className="flex items-end justify-end p-4 rounded-b">
                                                                <button
                                                                    onClick={closeModal}
                                                                    type="button"
                                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                                                    className="text-black bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5"
                                                                >
                                                                    ปิด
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )

}

export default RepairStatus