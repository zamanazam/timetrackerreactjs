import React,{useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function NavBar(props) {
    const navigate = useNavigate();
    
    function SignOut(){
        sessionStorage.clear();
        navigate('/logIn');
      }
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark" id="NavBar">
            <a className="navbar-brand ps-3 text-decoration-none" href="#">{props.title}</a>

            <button className="sidebarToggle btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" data-bs-toggle="tooltip" data-bs-placement="right" title="Toggle Sidebar">
                <i className="fas fa-bars"></i>
            </button>

            {/* <button className="sidebarToggle btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button> */}
            {/* <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" onClick={props.onClick}><i className="fas fa-bars"></i></button> */}
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle text-decoration-none" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item text-decoration-none" href="#!">{props.section1}</a></li>
                        {/* <li><a className="dropdown-item" href="#!">{props.section2}</a></li> */}
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-decoration-none" href="#!" onClick={SignOut}>{props.section3}</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

NavBar.propTypes = {
    title: PropTypes.string,
    section1: PropTypes.string,
    section2: PropTypes.string,
    section3: PropTypes.string,
}

NavBar.defaultProps ={
    title : 'Set Title Here',
    section1: 'Set Section1',
    section2: 'Set Section2',
    section3: 'Set Section3',
}


export default NavBar