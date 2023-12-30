import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import SideBar from '../Components/SideBar'
import Footer from '../Components/Footer'
import { Outlet } from 'react-router-dom'
import Alert from '../Components/Alert'
function LayoutPage() {

    const [alert, setAlert] = useState(null);

    const showAlert = (alertType,message)=>{
        debugger
        setAlert({
            type:alertType,
            msg:message
        })

    }

    return (
        <>
            <NavBar title="EmployeePortal" section1="Setting" section2="ActivityLogy" section3="LogOut" />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <SideBar section1="Dashboard" section2="Companies" section3="Users" section4="Projects" />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                    {alert && <Alert type={alert.type} message={alert.msg} />}
                        <Outlet showAlert={showAlert}/>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default LayoutPage
