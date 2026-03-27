import React, { useState } from 'react';
import { FaBars, FaTimes, FaUsers, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate, Outlet } from 'react-router-dom';

const Drawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex ">
            {/* Drawer content */}
            <div className='min-h-screen'
                style={{
                    width: isOpen ? '240px' : '64px',
                    // height: '100vh',
                    backgroundColor: '#333',
                    color: '#fff',
                    transition: 'width 0.3s ease',
                }}
            >
                {/* Toggle Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                    <button
                        onClick={toggleDrawer}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        {isOpen ? <div className='flex items-center gap-32'><span>Logo</span><span><FaTimes /></span></div>  : <div><FaBars /></div>}
                    </button>
                </div>

                {/* Drawer Menu */}
                <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
                    <li
                        style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onClick={() => navigate('/AdminDashboard')}
                    >
                        <MdAdminPanelSettings style={{ marginRight: isOpen ? '20px' : '0', fontSize: '24px' }} />
                        {isOpen && <span>Dashboard</span>}
                    </li>
                    <li
                        style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onClick={() => navigate('/users')}
                    >
                        <FaUsers style={{ marginRight: isOpen ? '20px' : '0', fontSize: '24px' }} />
                        {isOpen && <span>Users</span>}
                    </li>
                    <li
                        style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onClick={() => navigate('/items')}
                    >
                        <FaPlusCircle style={{ marginRight: isOpen ? '20px' : '0', fontSize: '24px' }} />
                        {isOpen && <span>Add Items</span>}
                    </li>
                    <li
                        style={{
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                    >
                        <FaSignOutAlt style={{ marginRight: isOpen ? '20px' : '0', fontSize: '24px' }} />
                        {isOpen && <span>Logout</span>}
                    </li>
                </ul>
            </div>

            {/* Main content rendered by the nested routes */}
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Drawer;