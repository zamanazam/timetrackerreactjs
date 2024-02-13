import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import SideBar from '../Components/SideBar'
import Footer from '../Components/Footer'
import { Outlet } from 'react-router-dom'

function LayoutPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSidebarToggle = () => {
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    };

    return (
        <>
            <NavBar title="EmployeePortal" section1="Profile" section2="ActivityLogy" section3="LogOut" onClick={handleSidebarToggle}/>
            <div id="layoutSidenav" className={isSidebarOpen ? '' : 'sb-sidenav-toggled'}>
                <div id="layoutSidenav_nav">
                    <SideBar section1="Dashboard" section2="Companies" section3="Users" section4="Projects" />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <Outlet/>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default LayoutPage;
