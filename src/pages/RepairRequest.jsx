import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

function RepairRequest() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [formData, setFormData] = useState({
        building: '',
        room: '',
        floor: '',
        reportDate: '',
        details: '',
        equipment: '',
        image: null,
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setUserEmail('')
        setIsDropdownOpen(false); // รีเซ็ตค่า userEmail เป็นค่าว่าง
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
    // useEffect สำหรับตั้งวันที่ปัจจุบันเป็นค่าเริ่มต้นของฟิลด์ "วันที่แจ้งซ่อม"
    useEffect(() => {
        const today = new Date(); // สร้างวันใหม่
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`; // รูปแบบ DD/MM/YYYY
        setFormData((prevData) => ({
            ...prevData,
            reportDate: formattedDate, // ตั้งค่า reportDate เป็นวันที่ที่ปรับรูปแบบแล้ว
        }));
    }, []);


    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // ฟังก์ชันจัดการการอัพโหลดรูป
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // ตรวจสอบขนาดไฟล์ (10MB = 10 * 1024 * 1024 bytes)
            if (file.size > 10 * 1024 * 1024) {
                setErrorMessage('ขนาดไฟล์เกิน 10MB กรุณาเลือกไฟล์ที่เล็กกว่า');
                setSelectedImage(null);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setErrorMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // ที่นี่สามารถทำการส่งข้อมูลไปยัง backend ได้
    };


    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleRequestRepair = () => {
        navigate('/repair-request');  // นี่คือเส้นทางที่คุณต้องการนำทางไป
    };
    const Returntohomepage = () => {
        navigate('/');  // นี่คือเส้นทางที่คุณต้องการนำทางไป
    };
    const hadleRepairStatus = () => {
        navigate('/repair-status')
    }
    const Administrator = () => {
        navigate('/Administrator');
    };
    const hadleManageUser = () => {
        navigate('/manager-users');
    };
    const handleStaticsRepair = () => {
        navigate('/statics-repair')
    }



    return (
        <div>
            <nav className='bg-[#ff7b00] p-4' style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
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
                        {userEmail && isDropdownOpen && (
                            <div className="absolute right-32 mt-10 z-10 w-40 bg-white rounded-md shadow-lg">
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={hadleManageUser}
                                        style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        จัดการผู้ใช้
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
                        <a href="#" className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            สถิติการแจ้งซ่อม
                        </a>
                        <button onClick={Administrator} className="block text-white px-4 py-2 hover:bg-[#ff5f00] transition">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                )}
            </nav>
            <h1 className="text-2xl font-bold mb-10 mt-10 text-center" style={{ fontFamily: 'MyCustomFont', fontSize: 32 }}>แจ้งปัญหา/แจ้งซ่อม</h1>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <form
                    className="bg-white p-6 rounded-3xl shadow-lg max-w-md w-full"
                    onSubmit={handleSubmit}
                >
                    {/* อาคาร */}
                    <div className="mb-4" >
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }} >อาคาร
                            <span className='text-red-500'> *</span>
                        </label>
                        <input
                            type="text"
                            name="building"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            value={formData.building}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        />
                    </div>

                    {/* ห้อง */}
                    <div className="mb-4">
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>ห้อง
                            <span className='text-red-500'> *</span>
                        </label>
                        <input
                            type="text"
                            name="room"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            value={formData.room}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        />
                    </div>

                    {/* ชั้น */}
                    <div className="mb-4">
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>ชั้น
                            <span className='text-red-500'> *</span>
                        </label>
                        <input
                            type="text"
                            name="floor"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            value={formData.floor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        />
                    </div>

                    {/* วันที่แจ้งซ่อม */}
                    <div className="mb-4" style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}>
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>วันที่แจ้งซ่อม
                            <span className='text-red-500'> *</span>
                        </label>
                        <DatePicker
                            type="date"
                            name="reportDate"
                            dateFormat="dd/MM/yyyy"
                            value={formData.reportDate}
                            onChange={handleChange}
                            className="w-[400px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        />
                    </div>

                    {/* รายละเอียด */}
                    <div className="mb-4">
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>รายละเอียด
                            <span className='text-red-500'> *</span>
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        ></textarea>
                    </div>

                    {/* อุปกรณ์ */}
                    <div className="mb-4">
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>อุปกรณ์
                            <span className='text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="equipment"
                            style={{ fontFamily: 'MyCustomFont2', fontSize: 18 }}
                            value={formData.equipment}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5f00]"
                            required
                        />
                    </div>
                    
                    {/* อัพโหลดรูปภาพ */}
                    <div>
                        <label className="block text-black" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>อัพโหลดรูปภาพ
                            <span className='text-red-500'> *</span></label>
                    </div>
                    <div class="flex items-center justify-center w-full mb-4">
                        <input
                            id="dropzone-file"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
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
                        className="w-full bg-orange-500 text-white py-2 rounded-2xl hover:bg-orange-600" style={{ fontFamily: 'MyCustomFont', fontSize: 30 }}
                    >
                        แจ้งซ่อม
                    </button>
                </form>
            </div>

        </div>
    )
}
export default RepairRequest
