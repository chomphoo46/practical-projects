import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function RepairRequest() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // ตัวแปรสถานะสำหรับเปิดหรือปิด Dropdown
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [formData, setFormData] = useState({
        building: '',
        room: '',
        floor: '',
        reportDate: '',
        description: '',
        equipment: '',
        image: null,
    });  // ตัวแปรสถานะสำหรับเก็บข้อมูลของแบบฟอร์ม
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // ตัวแปรสถานะสำหรับเปิดหรือปิดเมนู
    const navigate = useNavigate();  // ฟังก์ชันสำหรับเปลี่ยนเส้นทางของการนำทาง

    async function fetchProfile() {
        try {
            const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
                method: 'GET',
                credentials: 'include',
            });

            if (profileResponse.status === 200) {
                const profileData = await profileResponse.json();
                //console.log(profileData)

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

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_email');
        Cookies.remove('access_token');  // ลบคุกกี้ access_token
        Cookies.remove('user_email');    // ลบคุกกี้ user_email หากมีการจัดเก็บไว้
        setUserEmail('');
        setIsDropdownOpen(false);
        // รีเซ็ตค่า userEmail เป็นค่าว่าง
    };

    const toggleDropdown = () => {
        if (!userEmail) {
            navigate('/Administrator');  // ถ้ายังไม่ได้ login ให้ไปที่หน้า login
        } else {
            setIsDropdownOpen(!isDropdownOpen);  // ถ้า login แล้วให้แสดง dropdown
        }
    };

    useEffect(() => {
        const today = new Date();  // ดึงวันที่ปัจจุบัน
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;  // ตั้งรูปแบบวันที่
        setFormData((prevData) => ({
            ...prevData,
            reportDate: formattedDate,  // ตั้งค่า reportDate เป็นวันที่ปัจจุบัน
        }));
    }, []);  // ใช้ useEffect ตั้งวันที่ปัจจุบันในช่อง "วันที่แจ้งซ่อม"

    const [selectedImage, setSelectedImage] = useState(null);  // ตัวแปรสำหรับเก็บรูปที่อัพโหลด
    const [errorMessage, setErrorMessage] = useState('');  // ตัวแปรสำหรับเก็บข้อความข้อผิดพลาด

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });  // เก็บไฟล์ลงใน state
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        // ตรวจสอบว่ามี access_token หรือไม่
        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            setErrorMessage('กรุณาเข้าสู่ระบบก่อนทำรายการ');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('building', formData.building);        // ฟิลด์ building
            formDataToSend.append('room', formData.room);                // ฟิลด์ room
            formDataToSend.append('floor', formData.floor);              // ฟิลด์ floor
            formDataToSend.append('description', formData.description);  // ฟิลด์ description
            formDataToSend.append('equipment', formData.equipment);      // ฟิลด์ equipment

            if (formData.image) {
                formDataToSend.append('image', formData.image);  // ต้องใช้ชื่อ 'image' ตามที่ backend ร้องขอ
            }

            const response = await fetch('http://localhost:3000/api/maintenances', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formDataToSend,  // ส่งข้อมูลในรูปแบบ multipart/form-data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error occurred while submitting the repair request');
            }

            const responseData = await response.json();
            console.log("Repair request submitted successfully:", responseData);
            navigate('/repair-status');  // ส่งผลลัพธ์ไปยังหน้าสถานะการแจ้งซ่อม
        } catch (error) {
            console.error("Error during submission:", error);
            setErrorMessage(error.message);
        }
    };



    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);  // สลับการแสดงเมนู
    };

    const handleRequestRepair = () => {
        navigate('/repair-request');  // นำทางไปยังหน้าแจ้งซ่อม
    };

    const Returntohomepage = () => {
        navigate('/');  // นำทางกลับไปที่หน้าหลัก
    };

    const hadleRepairStatus = () => {
        navigate('/repair-status');  // นำทางไปที่หน้าสถานะการแจ้งซ่อม
    };

    const Administrator = () => {
        navigate('/Administrator');  // นำทางไปที่หน้าแอดมิน
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
        navigate('/statics-repair');  // นำทางไปที่หน้าสถิติการแจ้งซ่อม
    };
    
    const handleCreateTechician = () => {
        navigate('/create-techinician');
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
                        <button onClick={hadleRepairStatus} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113c-9.3-9.4-9.3-24.6 0-34s24.6-9.4 33.9 0L63 101.1l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L63 261.2l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m-64 160c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32M48 368a48 48 0 1 1 0 96a48 48 0 1 1 0-96"></path></svg>
                            <span>สถานะการแจ้งซ่อม</span>
                        </button>
                        <button onClick={handleRequestRepair} className="border-b-2 mx-1.3 sm:mx-7 flex items-center space-x-1">
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
                                    {userRole === 'ADMIN' && (
                                        <button
                                            onClick={handleCreateTechician}
                                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                           เพิ่มช่าง
                                        </button>
                                        
                                    )}
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
                        <button onClick={Returntohomepage} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            หน้าหลัก
                        </button>
                        <button onClick={hadleRepairStatus} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถานะการแจ้งซ่อม
                        </button>
                        <button onClick={handleRequestRepair} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            แจ้งปัญหา/แจ้งซ่อม
                        </button>
                        <button  onClick={handleStaticsRepair} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถิติการแจ้งซ่อม
                        </button>
                        <button onClick={toggleDropdown} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            <span>{userEmail ? userEmail : 'เข้าสู่ระบบ'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-32 mt-10 z-10 w-40 bg-white rounded-md shadow-lg">
                                <div className="py-1">
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
                                    {userRole === 'ADMIN' && (
                                        <button
                                            onClick={handleCreateTechician}
                                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            เพิ่มช่าง
                                        </button>
                                        
                                    )}
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
                )}
            </nav>

            <div className="bg-gray-100 p-10 " style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                <h2 className="text-4xl mb-4 text-center">แจ้งปัญหา/แจ้งซ่อม</h2>
                <div className="max-w-md mx-auto bg-white shadow-md rounded-3xl p-6">
                    <form onSubmit={handleSubmit}>
                        {/* อาคาร */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">อาคาร <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="building"
                                value={formData.building}
                                onChange={handleChange}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกชื่ออาคาร"
                            />
                        </div>
                        {/* ห้อง */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">ห้อง <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกหมายเลขห้อง"
                            />
                        </div>
                        {/* ชั้น */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">ชั้น <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกหมายเลขชั้น"
                            />
                        </div>
                        {/* วันที่แจ้งซ่อม */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">วันที่แจ้งซ่อม <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="reportDate"
                                value={formData.reportDate}
                                readOnly
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md bg-gray-200"
                            />
                        </div>
                        {/* รายละเอียดการแจ้งซ่อม */}
                        <div className="mb-2">
                            <label className="block text-back text-xl font-bold mb-2">รายละเอียด <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกรายละเอียดการแจ้งซ่อม"
                            ></textarea>
                        </div>
                        {/* อุปกรณ์ที่ต้องซ่อม */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">อุปกรณ์ <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="equipment"
                                value={formData.equipment}
                                onChange={handleChange}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกชื่ออุปกรณ์"
                            />
                        </div>
                        {/* อัพโหลดรูปภาพ */}
                        <div className="mb-4">
                            <label className="block text-back" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>อัพโหลดรูปภาพ
                                <span className='text-red-500'> *</span></label>
                        </div>
                        <div class="flex items-center justify-center w-full mb-4">
                            <input
                                id="dropzone-file"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18, display: 'none' }}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                            >

                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {/* ตรวจสอบว่ามีรูปที่ถูกเลือกหรือไม่ */}
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt="Uploaded"
                                            style={{ width: '100%', height: '225px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 20 20">
                                                <path
                                                    fill="#6e6868"
                                                    d="M10 5.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V5H3.5a.5.5 0 0 0 0 1H5v1.5a.5.5 0 0 0 1 0V6h1.5a.5.5 0 0 0 0-1H6zm8 .5h-3.207a5.5 5.5 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6q.476.244 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A2 2 0 0 0 16 14V6a2 2 0 0 0-2-2m0 3.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0m-8.012 8.226A2 2 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0z"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span style={{ fontFamily: 'MyCustomFont2', fontSize: 14 }}>Click to upload</span>
                                            </p>
                                            <p className="text-gray-500" style={{ fontFamily: 'MyCustomFont2', fontSize: 14 }}>
                                                PNG, JPG (MAX. 10MB)
                                            </p>
                                        </>
                                    )}
                                </div>

                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#ff7b00] text-white text-2xl font-bold py-2 px-4 rounded-3xl hover:bg-orange-600"
                        >
                            แจ้งซ่อม
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RepairRequest;
