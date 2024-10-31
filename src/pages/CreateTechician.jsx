import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Select from 'react-select';


function CreateTechician() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // ตัวแปรสถานะสำหรับเปิดหรือปิด Dropdown
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // เพิ่มตัวแปรสำหรับข้อความสำเร็จ
    const [maintenanceOptions, setMaintenanceOptions] = useState([]); // สำหรับเก็บรายการแจ้งซ่อม
    const categoryOptions = [
        { value: 'email', label: 'Email' },
        { value: 'id', label: 'ID' },

    ];
    const [selectedCategory, setSelectedCategory] = useState({ value: 'email', label: 'Email' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        phoneNumber: '',
        userId: '',
    });  // ตัวแปรสถานะสำหรับเก็บข้อมูลของแบบฟอร์ม

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        // ตรวจสอบว่ามีค่าใน selectedCategory ก่อนใช้
        if (selectedCategory && selectedCategory.value) {
            const options = maintenanceOptions
                .filter(user => user[selectedCategory.value]?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(user => ({
                    value: user.id,
                    label: `${user[selectedCategory.value]} - ${user.role}`,
                }));

            setFilteredOptions(options);
        }
    }, [searchQuery, selectedCategory, maintenanceOptions]);

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
    // ดึงข้อมูลแจ้งซ่อมที่มี `userId`
    useEffect(() => {
        const fetchUsers = async () => {
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
                    console.log("Users Data:", data); // ตรวจสอบข้อมูลที่ดึงมา
                    const userOptions = data.map(user => ({
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    })); // บันทึกข้อมูลผู้ใช้ใน state
                    setMaintenanceOptions(userOptions);
                } else {
                    console.error("Failed to fetch users data");
                }
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };

        fetchUsers();
    }, []);
    // Update filtered options based on search term
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

    const [errorMessage, setErrorMessage] = useState('');  // ตัวแปรสำหรับเก็บข้อความข้อผิดพลาด



    const handleChange = (selectedOption) => {
        setFormData({ ...formData, userId: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            setErrorMessage('กรุณาเข้าสู่ระบบก่อนทำรายการ');
            return;
        }

        try {
            // ใช้ userId ใน formData สำหรับสร้าง URL
            const response = await fetch(`http://localhost:3000/api/technicians/${formData.userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error occurred while submitting the technician data');
            }
            const responseData = await response.json();
            console.log("Technician added successfully:", responseData);
            console.log("formData:", formData);
            setSuccessMessage("เพิ่มช่างสำเร็จ"); // ตั้งข้อความสำเร็จ
            navigate('/manager-users');
            setErrorMessage(""); // เคลียร์ข้อความข้อผิดพลาด

        } catch (error) {
            console.error("Error during submission:", error);
            setErrorMessage(error.message);
            setSuccessMessage(""); // เคลียร์ข้อความสำเร็จเมื่อมีข้อผิดพลาด
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

            <div className="bg-gray-100 p-10 " style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                <h2 className="text-4xl mb-4 text-center">เพิ่มช่าง</h2>
                <div className="max-w-2xl mx-auto mx-auto bg-white shadow-md rounded-3xl p-6">
                    <form onSubmit={handleSubmit}>
                        {/* ชื่อ */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">ชื่อ <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกชื่อ"
                            />
                        </div>
                        {/* นามสกุล */}
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">นามสกุล <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกนามสกุล"
                            />
                        </div>
                        {/* เพศ */}
                        <div className="mb-4" >
                            <label className="block text-back text-xl font-bold mb-2">เพศ <span className="text-red-500">*</span></label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="">เลือกเพศ</option>
                                <option value="MALE">ชาย</option>
                                <option value="FEMALE">หญิง</option>
                            </select>
                        </div>

                        {/* เบอร์โทร*/}
                        <div className="mb-2">
                            <label className="block text-back text-xl font-bold mb-2">เบอร์โทร <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                                style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกเบอร์โทร"
                            ></input>
                        </div>
                        <div className="mb-4">
                            <label className="block text-back text-xl font-bold mb-2">Email or UserId</label>
                            <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm p-1 space-x-2">
                                <div className="w-40"  style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                                    <Select
                                        options={categoryOptions}
                                        onChange={handleCategoryChange}
                                        value={selectedCategory}
                                        placeholder="เลือกหมวดหมู่"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                boxShadow: 'none',
                                                border: 'none',
                                            }),
                                            dropdownIndicator: (provided) => ({
                                                ...provided,
                                                padding: '0',
                                            }),
                                            indicatorSeparator: () => ({ display: 'none' }),
                                        }}
                                    />
                                </div>

                                {/* Dropdown สำหรับค้นหาตามหมวดหมู่ */}
                                <div className="flex-1" style={{ fontFamily: 'MyCustomFont2', fontSize: 20 }}>
                                    <Select
                                        options={filteredOptions}
                                        onChange={(selectedOption) => setFormData({ ...formData, userId: selectedOption?.value || '' })}
                                        value={filteredOptions.find(option => option.value === formData.userId)}
                                        placeholder={`ค้นหาโดย ${selectedCategory.label}...`}
                                        isClearable
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                boxShadow: 'none',
                                                border: 'none',
                                            }),
                                            dropdownIndicator: (provided) => ({
                                                ...provided,
                                                padding: '0',
                                            }),
                                            indicatorSeparator: () => ({ display: 'none' }),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#ff7b00] text-white text-2xl font-bold py-2 px-4 rounded-3xl hover:bg-orange-600"
                        >
                            เพิ่มช่าง
                        </button>
                    </form>
                    {/* แสดงข้อความสำเร็จหรือข้อผิดพลาด */}
                    {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}
                    {errorMessage && <p className="mt-4 text-red-600 text-center">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default CreateTechician;
