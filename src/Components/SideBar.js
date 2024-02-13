import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { Link,useLocation } from 'react-router-dom';
import { SuperAdminRoleId,AdminRoleId,ClientRoleId,EmployeeRoleId } from '../GlobalFile';

function SideBar(props) {
    const [darkMode,darkSideBar]= useState(true);
    const changeSideBarColour= (params)=>{
            darkSideBar(params);
    }
    const RoleId = sessionStorage.getItem("RoleId");
    let currentUserName= sessionStorage.getItem('Name');
    let currentRoleId = sessionStorage.getItem('RoleId');
    let location = useLocation();
    let currentRoleName = "Employee";
    if(RoleId == SuperAdminRoleId) {
        currentRoleName = "SuperAdmin";
    }
    
    if(RoleId == AdminRoleId) {
        currentRoleName = "Admin";
    }

    if(RoleId == ClientRoleId){
        currentRoleName = "Client";
    } 
    

  return (
    <nav className={`sb-sidenav accordion ${darkMode === true ? 'sb-sidenav-dark' : 'sb-sidenav-light'}`} id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">Core</div>
                    <Link className="nav-link" to="/Dashboard">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        {props.section1}
                    </Link>

                    <div className="sb-sidenav-menu-heading">Interface</div>
                    <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Layouts
                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <a className={`nav-link ${darkMode == true?'active':''}`} href="#" onClick={()=>changeSideBarColour(true)}>Static Navigation</a>
                            <a className={`nav-link ${darkMode != true ?'active':''}`} href="#" onClick={()=>changeSideBarColour(false)}>Light Sidenav</a>
                        </nav>
                    </div>
                    {/* {currentRoleId === SuperAdminRoleId ?
                        <>
                            <Link className="nav-link" to="/Companies">
                                <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                {props.section2}
                            </Link>
                            <Link className="nav-link" to="/Users">
                                <div className="sb-nav-link-icon"><i className="fa fa-users"></i></div>
                                {props.section3}
                            </Link>
                        </>
                    :
                        <Link className="nav-link" to="/Projects">
                            <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                            {props.section4}
                        </Link>
                    } */}
                    {currentRoleId === SuperAdminRoleId ? (
                        <>
                            <Link className={`nav-link ${location.pathname == "/Companies" ? 'active': ''}`} to="/Companies">
                                <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                {props.section2}
                            </Link>
                            <Link className={`nav-link ${location.pathname == "/Users" ? 'active': ''}`} to="/Users">
                                <div className="sb-nav-link-icon"><i className="fa fa-users"></i></div>
                                {props.section3}
                            </Link> 
                        </>
                    ) : (
                        <Link className={`nav-link ${location.pathname == "/Projects" ? 'active': ''}`} to="/Projects">
                            <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                            {props.section4}
                        </Link>
                    )}
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">Logged in as : {currentRoleName}</div>
                    {currentUserName}
            </div>
        </nav>
  )
}

SideBar.propTypes = {
    section1 : PropTypes.string,
    section2 : PropTypes.string,
    section3 : PropTypes.string,
    section4 : PropTypes.string
}

SideBar.defaultProps = {
    section1 : 'Set Section1',
    section2 : 'Set Section2',
    section3 : 'Set Section3',
    section4 : 'Set Section4'
}

export default SideBar