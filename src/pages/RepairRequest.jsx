import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

function RepairRequest() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // ตัวแปรสถานะสำหรับเปิดหรือปิด Dropdown
    const [userEmail, setUserEmail] = useState('');  // ตัวแปรสถานะสำหรับเก็บอีเมลผู้ใช้
    const [formData, setFormData] = useState({
        building: '',
        room: '',
        floor: '',
        reportDate: '',
        details: '',
        equipment: '',
        image: null,
    });  // ตัวแปรสถานะสำหรับเก็บข้อมูลของแบบฟอร์ม
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // ตัวแปรสถานะสำหรับเปิดหรือปิดเมนู
    const navigate = useNavigate();  // ฟังก์ชันสำหรับเปลี่ยนเส้นทางของการนำทาง

    useEffect(() => {
        // ดึงอีเมลจาก localStorage
        const email = localStorage.getItem('user_email');
        if (email) {
            setUserEmail(email);  // ถ้ามีค่าใน localStorage จะตั้งค่าลง state
        }
    }, []);  // ใช้ useEffect เพื่อดึงอีเมลจาก localStorage เมื่อ component โหลดครั้งแรก

    const handleLogout = () => {
        localStorage.removeItem('access_Token');  // ลบ access token
        localStorage.removeItem('user_email');  // ลบอีเมล
        setUserEmail('');  // ตั้งค่าอีเมลผู้ใช้เป็นว่าง
        setIsDropdownOpen(false);  // ปิด dropdown
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
        const file = e.target.files[0];  // รับไฟล์รูป

        if (file) {
            if (file.size > 10 * 1024 * 1024) {  // ตรวจสอบขนาดไฟล์ (จำกัดที่ 10MB)
                setErrorMessage('ขนาดไฟล์เกิน 10MB กรุณาเลือกไฟล์ที่เล็กกว่า');  // แสดงข้อผิดพลาดหากไฟล์ใหญ่เกิน
                setSelectedImage(null);  // ลบรูปที่เลือก
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);  // ตั้งค่ารูปที่อัพโหลด
                setErrorMessage('');  // ลบข้อความข้อผิดพลาด
            };
            reader.readAsDataURL(file);  // อ่านไฟล์เป็น Data URL
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission
        console.log(formData);  // Log form data for debugging

        try {
            const response = await fetch('http://localhost:3000/api/maintenances', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Include token if needed
                },
                body: JSON.stringify(formData),  // Send the form data as JSON
            });

            if (!response.ok) {  // Check for HTTP response status
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error occurred while submitting the repair request');
            }

            const responseData = await response.json();
            console.log("Repair request submitted successfully:", responseData);
            // You can handle successful submission here (e.g., show a success message or redirect)

        } catch (error) {
            console.error("Error during submission:", error);
            // Handle errors (e.g., show an error message to the user)
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

    const hadleManageUser = () => {
        navigate('/manager-users');  // นำทางไปที่หน้าจัดการผู้ใช้
    };

    const handleStaticsRepair = () => {
        navigate('/statics-repair');  // นำทางไปที่หน้าสถิติการแจ้งซ่อม
    };

    return (
        <div>
            <nav className='bg-[#ff7b00] p-4' style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <img src="src/assets/sci_kmitl_logo_1.png" alt="Logo" className="h-10 md:h-12" />
                    </div>
                    <div className="hidden md:flex space-x-4 lg:space-x-6 text-white">
                        <button onClick={Returntohomepage} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="..."></path></svg>
                            <span>หน้าหลัก</span>
                        </button>
                        <button onClick={hadleRepairStatus} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>
                            <span>สถานะการแจ้งซ่อม</span>
                        </button>
                        <button onClick={handleRequestRepair} className="border-b-2 mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>
                            <span>แจ้งปัญหา/แจ้งซ่อม</span>
                        </button>
                        <button onClick={handleStaticsRepair} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>
                            <span>สถิติการแจ้งซ่อม</span>
                        </button>
                        <button onClick={toggleDropdown} className="border-b-2 border-transparent hover:border-white mx-1.3 sm:mx-7 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>
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
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* เมนูมือถือ */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#ff7b00] py-2 px-4 text-white space-y-2">
                    <button onClick={Returntohomepage} className="block text-left w-full">หน้าหลัก</button>
                    <button onClick={hadleRepairStatus} className="block text-left w-full">สถานะการแจ้งซ่อม</button>
                    <button onClick={handleRequestRepair} className="block text-left w-full">แจ้งปัญหา/แจ้งซ่อม</button>
                    <button onClick={handleStaticsRepair} className="block text-left w-full">สถิติการแจ้งซ่อม</button>
                    <button onClick={toggleDropdown} className="block text-left w-full">{userEmail ? userEmail : 'เข้าสู่ระบบ'}</button>
                    {userEmail && isDropdownOpen && (
                        <div className="absolute right-4 mt-2 w-40 bg-white rounded-md shadow-lg">
                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={hadleManageUser}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    จัดการผู้ใช้
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-gray-100 p-8" style={{ fontFamily: 'MyCustomFont', fontSize: 20 }}>
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">แบบฟอร์มแจ้งปัญหา/แจ้งซ่อม</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">อาคาร</label>
                            <input
                                type="text"
                                name="building"
                                value={formData.building}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกชื่ออาคาร"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">ห้อง</label>
                            <input
                                type="text"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกหมายเลขห้อง"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">ชั้น</label>
                            <input
                                type="text"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกหมายเลขชั้น"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">วันที่แจ้งซ่อม</label>
                            <input
                                type="text"
                                name="reportDate"
                                value={formData.reportDate}
                                readOnly
                                className="w-full px-3 py-2 border rounded-md bg-gray-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">รายละเอียด</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกรายละเอียดการแจ้งซ่อม"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">อุปกรณ์ที่ต้องซ่อม</label>
                            <input
                                type="text"
                                name="equipment"
                                value={formData.equipment}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="กรอกชื่ออุปกรณ์"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">รูปภาพ (ถ้ามี)</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                            {selectedImage && (
                                <div className="mt-4">
                                    <img src={selectedImage} alt="Selected" className="h-40 object-contain" />
                                </div>
                            )}
                            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            ส่งคำร้อง
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RepairRequest;
