import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import { id } from 'date-fns/locale';
import { PiPencil } from "react-icons/pi";

function ManagerUsers() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่เลือกแก้ไข

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

    useEffect(() => {
        // ตรวจสอบว่า role เป็น ADMIN หรือไม่หลังจาก fetchProfile() เสร็จแล้ว
        if (userRole && userRole !== "ADMIN") {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            navigate('/');
        }
    }, [userRole]);  // ทำงานทุกครั้งเมื่อ userRole เปลี่ยน

    // อัปเดต fetchUserData เพื่อดึงข้อมูล technician จาก API
    const fetchUserData = async () => {
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
                setUserData(data); // เก็บข้อมูลที่ดึงมาใน state
            } else {
                console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    // เรียก fetchUserData เมื่อ component โหลดครั้งแรก
    useEffect(() => {
        fetchUserData();
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

    const [search, setSearch] = useState('')
    const handleSearch = async (e) => {
        e.preventDefault();

        const queryParams = new URLSearchParams();

        if (email) queryParams.append("email", email);
        if (id) queryParams.append("id", id);
        if (search) queryParams.append("search", search);

        const apiUrl = `http://localhost:3000/api/users?${queryParams.toString()}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`
                },

            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to fetch filtered data:", errorData);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Filtered results:", data);

        } catch (error) {
            console.error("Error occurred:", error);
        }
    };
    //ลบผู้ใช้
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });

            if (response.ok) {
                alert("ลบผู้ใช้เรียบร้อยแล้ว");
                setUserData(userData.filter(user => user.id !== userId)); // อัปเดตสถานะผู้ใช้โดยไม่ต้องรีเฟรชข้อมูล
            } else {
                alert("ไม่สามารถลบผู้ใช้ได้");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    // เพิ่ม state ใหม่สำหรับจัดเก็บข้อมูลเพิ่มเติมของ TECHNICIAN
    const [technicianDetails, setTechnicianDetails] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        phoneNumber: ''
    });
    // State สำหรับจัดเก็บข้อมูลที่สามารถแก้ไขได้
    const [isEditingTechnician, setIsEditingTechnician] = useState({
        firstName: false,
        lastName: false,
        sex: false,
        phoneNumber: false
    });
    const handleEditField = (field) => {
        setIsEditingTechnician({ ...isEditingTechnician, [field]: true });
    };

    const handleFieldChange = (field, value) => {
        setTechnicianDetails({ ...technicianDetails, [field]: value });
    };

    const handleFieldBlur = (field) => {
        setIsEditingTechnician({ ...isEditingTechnician, [field]: false });
    };
    // อัปเดต openEditModal เพื่อตั้งค่า technicianDetails หากผู้ใช้มีข้อมูล technician
    const openEditModal = (user) => {
        setSelectedUser(user); // ตั้งค่า selectedUser เป็นผู้ใช้ที่ต้องการแก้ไข

        if (user.role === 'TECHNICIAN' && user.technician) {
            setTechnicianDetails({
                firstName: user.technician.firstName,
                lastName: user.technician.lastName,
                phoneNumber: user.technician.phoneNumber,
                sex: user.technician.sex,
            });
        } else {
            setTechnicianDetails({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                sex: '',
            });
        }

        setIsEditModalOpen(true); // เปิด Modal
    };

    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false); // ปิด Modal
    };

    const handleEditClick = () => {
        setIsEditingRole(true); // เปิดการแก้ไขเมื่อคลิกดินสอ
    };

    const handleRoleChange = (e) => {
        setSelectedUser({ ...selectedUser, role: e.target.value });
    };

    const handleBlur = () => {
        setIsEditingRole(false); // ปิดการแก้ไขเมื่อคลิกออกนอก
    };
    //อัปเดตผู้ใช้
    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            // การอัปเดต Role ของผู้ใช้
            const roleUpdateResponse = await fetch(`http://localhost:3000/api/users/${selectedUser.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
                body: JSON.stringify({
                    role: selectedUser.role
                }),
            });

            if (!roleUpdateResponse.ok) {
                throw new Error('Failed to update user role');
            }
            console.log("อัปเดต Role สำเร็จ:", selectedUser);

            // เฉพาะเมื่อมีข้อมูล technician และ modal ของ technician เปิดอยู่
            if (selectedUser.role === "TECHNICIAN" && selectedUser.technician) {
                const technicianDataUpdate = await fetch(`http://localhost:3000/api/technicians/${selectedUser.id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    },
                    body: JSON.stringify(technicianDetails),
                });

                if (!technicianDataUpdate.ok) {
                    throw new Error('Failed to update maintenance technician data');
                }
                console.log("อัปเดตข้อมูล Maintenance Technician สำเร็จ");
            }

            alert("แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว");
            await fetchUserData(); // รีเฟรชข้อมูลผู้ใช้
            closeEditModal(); // ปิด Modal

        } catch (error) {
            if (error.message.includes('user role')) {
                alert("เกิดข้อผิดพลาดในการอัปเดต Role ของผู้ใช้");
            } else if (error.message.includes('maintenance technician')) {
                alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล Maintenance Technician");
            } else {
                alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
            }
            console.error("Error occurred:", error);
        }
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
    const handleCreateTechician = () => {
        navigate('/create-techinician')
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
                        <button onClick={handleStaticsRepair} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถิติการแจ้งซ่อม
                        </button>
                        <button onClick={toggleDropdown} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            <span>{userEmail ? userEmail : 'เข้าสู่ระบบ'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-32 mt-10 z-10 w-40 bg-white rounded-md shadow-lg">
                                <div className="py-1">
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
            <div className='flex flex-col lg:flex-row justify-between mt-10 mx-4 lg:mx-12'>
                <div className="mx-1.3 sm:mx-7 flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113c-9.3-9.4-9.3-24.6 0-34s24.6-9.4 33.9 0L63 101.1l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L63 261.2l55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m0 160c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32m-64 160c0-17.7 14.3-32 32-32h288c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32M48 368a48 48 0 1 1 0 96a48 48 0 1 1 0-96"></path></svg>
                    <span style={{ fontFamily: 'MyCustomFont', fontSize: 32 }}>จัดการผู้ใช้</span>
                </div>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row mx-4 lg:mx-20 mt-8 space-y-4 md:space-x-4 md:space-y-0">
                <div className="flex space-x-10">
                    {/* รหัสแจ้งซ่อม */}
                    <div className="relative input-with-placeholder w-[210px] max-w-md mx-4 sm:mx-auto md:max-w-lg">
                        <input
                            type="text"
                            className="peer block w-full px-3 py-2 bg-[#F5F5F5] border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-[#ff5f00] placeholder-transparent"
                            //value={email}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18, color: 'black' }}
                            required
                            placeholder="Search contacts"

                        />
                        <label
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            htmlFor="repairCode"
                            class="absolute left-3 top-2 transition-all duration-300 text-gray-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:px-1 peer-focus:bg-[#F5F5F5] peer-focus:text-gray-500 peer-valid:-translate-y-4 peer-valid:scale-90 peer-valid:px-1 peer-valid:bg-[#F5F5F5] peer-valid:text-gray-500">
                            Email/id
                        </label>
                    </div>


                </div>
                {/* Search Field */}
                {/* <button
                    type="submit"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหา..."
                    className="bg-[#ff7b00] text-white mb-4 py-3 px-4 rounded-2xl hover:bg-orange-600 w-[100px] max-w-md mx-4 sm:mx-auto md:max-w-lg"
                >
                    ค้นหา
                </button> */}

            </form>

            <div className="container mx-auto px-4 mt-4">
                {loading ? (
                    <p>กำลังโหลด...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse overflow-hidden rounded-xl">
                            <thead>
                                <tr className="bg-[#ff7b00] text-white text-xs sm:text-sm md:text-base lg:text-lg" style={{ fontFamily: 'MyCustomFont' }}>
                                    <th className="px-2 py-1 sm:px-4 sm:py-2">ID</th>
                                    <th className="px-2 py-1 sm:px-4 sm:py-2">Email</th>
                                    <th className="px-2 py-1 sm:px-4 sm:py-2">ตำแหน่ง</th>
                                    <th className="px-2 py-1 sm:px-4 sm:py-2">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-xs sm:text-base" style={{ fontFamily: 'MyCustomFont2' }}>ไม่มีข้อมูลผู้ใช้</td>
                                    </tr>
                                ) : (
                                    userData.filter((user) => {
                                        return (
                                            search.toLowerCase() === '' ||
                                            user.email.toLowerCase().includes(search.toLowerCase()) || // Filter by email
                                            user.id.toString().includes(search) // Filter by ID
                                        );
                                    }).map((user) => (
                                        <tr key={user.id} className="text-center border-b">
                                            <td className="py-2 px-2 sm:px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20, sm: { fontSize: 16 } }}>{user.id}</td>
                                            <td className="py-2 px-2 sm:px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20, sm: { fontSize: 16 } }}>{user.email}</td>
                                            <td className="py-2 px-2 sm:px-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 20, sm: { fontSize: 16 } }}>{user.role}</td>
                                            <td className="py-2 px-2 sm:px-4">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 20, sm: { fontSize: 16 } }}
                                                    className="bg-[#FFD200] text-white px-3 py-1 rounded-full  mx-1">
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    style={{ fontFamily: 'MyCustomFont2', fontSize: 20, sm: { fontSize: 16 } }}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-full mx-1">
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal สำหรับแก้ไขข้อมูลผู้ใช้ */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="relative p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded">
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
                                รายละเอียดผู้ใช้
                            </div>
                            <button
                                type="button"
                                onClick={closeEditModal}
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
                        <div
                            className="flex p-1 mx-2 mt-4 bg-[#FFD200] text-white"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 24 }}>
                            ข้อมูลผู้ใช้
                        </div>
                        {/* Modal content */}
                        <div className="p-4">
                            <table className="w-full text-left border border-gray-300 rounded" style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}>
                                <tbody>
                                    <tr>
                                        <td className="p-2 border border-gray-300 font-medium">Id:</td>
                                        <td className="p-2 border border-gray-300">{selectedUser.id}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 border border-gray-300 font-medium">Email:</td>
                                        <td className="p-2 border border-gray-300">{selectedUser.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 border border-gray-300 font-medium">ตำแหน่ง:</td>
                                        <td className="p-2 border border-gray-300">
                                            {isEditingRole ? (
                                                <select
                                                    value={selectedUser.role}
                                                    onChange={handleRoleChange}
                                                    onBlur={handleBlur}
                                                    autoFocus
                                                    className="w-32 px-3 py-2 border rounded-md"
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="TECHNICIAN">TECHNICIAN</option>
                                                </select>
                                            ) : (
                                                <div className="flex justify-between w-full items-center">
                                                    <span>{selectedUser.role}</span>
                                                    <button
                                                        onClick={handleEditClick}
                                                        className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
                                                    >
                                                        <PiPencil size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    {/* แสดงข้อมูล technician เมื่อ role เป็น TECHNICIAN */}
                                    {selectedUser.technician && (
                                        <>
                                            <tr>
                                                <td className="p-2 border border-gray-300 font-medium">ชื่อ:</td>
                                                <td className="p-2 border border-gray-300">
                                                    {isEditingTechnician.firstName ? (
                                                        <input
                                                            type="text"
                                                            value={technicianDetails.firstName}
                                                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                                            onBlur={() => handleFieldBlur('firstName')}
                                                            autoFocus
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="flex justify-between w-full items-center">
                                                            <span>{technicianDetails.firstName || "ไม่มีข้อมูล"}</span>
                                                            <button
                                                                onClick={() => handleEditField('firstName')}
                                                                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
                                                            >
                                                                <PiPencil size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border border-gray-300 font-medium">นามสกุล:</td>
                                                <td className="p-2 border border-gray-300">
                                                    {isEditingTechnician.lastName ? (
                                                        <input
                                                            type="text"
                                                            value={technicianDetails.lastName}
                                                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                                            onBlur={() => handleFieldBlur('lastName')}
                                                            autoFocus
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="flex justify-between w-full items-center">
                                                            <span>{technicianDetails.lastName || "ไม่มีข้อมูล"}</span>
                                                            <button
                                                                onClick={() => handleEditField('lastName')}
                                                                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
                                                            >
                                                                <PiPencil size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border border-gray-300 font-medium">เพศ:</td>
                                                <td className="p-2 border border-gray-300">
                                                    {isEditingTechnician.sex ? (
                                                        <select
                                                            value={technicianDetails.sex}
                                                            onChange={(e) => handleFieldChange('sex', e.target.value)}
                                                            onBlur={() => handleFieldBlur('sex')}
                                                            autoFocus
                                                            className="w-full px-2 py-1 border rounded"
                                                        >
                                                            <option value="MALE">MALE</option>
                                                            <option value="FEMALE">FEMALE</option>
                                                        </select>
                                                    ) : (
                                                        <div className="flex justify-between w-full items-center">
                                                            <span>{technicianDetails.sex || "ไม่มีข้อมูล"}</span>
                                                            <button
                                                                onClick={() => handleEditField('sex')}
                                                                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
                                                            >
                                                                <PiPencil size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border border-gray-300 font-medium">เบอร์โทร:</td>
                                                <td className="p-2 border border-gray-300">
                                                    {isEditingTechnician.phoneNumber ? (
                                                        <input
                                                            type="text"
                                                            value={technicianDetails.phoneNumber}
                                                            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                                            onBlur={() => handleFieldBlur('phoneNumber')}
                                                            autoFocus
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="flex justify-between w-full items-center">
                                                            <span>{technicianDetails.phoneNumber || "ไม่มีข้อมูล"}</span>
                                                            <button
                                                                onClick={() => handleEditField('phoneNumber')}
                                                                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 cursor-pointer shadow-lg"
                                                            >
                                                                <PiPencil size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </>
                                    )}


                                </tbody>
                            </table>
                        </div>
                        {/* Modal footer */}

                        <div className="flex p-1 mx-2 mt-4  text-white">
                            <button
                                onClick={handleSaveEdit}
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                บันทึก
                            </button>
                        </div>
                        <div className="flex items-end justify-end p-4 rounded-b">
                            <button
                                onClick={closeEditModal}
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="text-black bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5"
                            >
                                ปิด
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
export default ManagerUsers