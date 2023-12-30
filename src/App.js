import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Companies from './Pages/Companies';
import Users from './Pages/Users';
import Projects from './Pages/Projects';
import CompanyDetail from './Pages/CompanyDetail';
import ProjectDetails from './Pages/ProjectDetails';
import ProjectTimeLogs from './Pages/TimeLogs';
import CreateAccount from './Pages/CreateAccount';
import NotAuthorized from './Pages/NotAuthorized';
import LayoutPage from './Layout/LayouPage';
function App() {
  const PrivateRoute = ({ element, ...props }) => {
    const token = sessionStorage.getItem('Token');
    document.body.classList.remove('sb-sidenav-toggled');
    localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    var navbar = document.getElementById('NavBar');
    if (navbar != null) {
      navbar.style.display = 'flex';
    }

    const isLoggedIn = !!token;
    return isLoggedIn ? (
      React.cloneElement(element, props)
    ) : (
      <Navigate to="/logIn" replace state={{ from: props.location?.pathname || '/' }} />
    );
  };



  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/logIn" element={<LogIn />} />
          <Route exact path="/createAccount" element={<CreateAccount />} />
          <Route path='/' element={<LayoutPage />}>
            <Route exact path="/companies" element={<PrivateRoute element={<Companies />} />} />
            <Route exact path="/notAuthorized" element={<PrivateRoute element={<NotAuthorized />} />} />
            <Route exact path="/Detail/:companyId" element={<PrivateRoute element={<CompanyDetail />} />} />
            <Route exact path="/users" element={<PrivateRoute element={<Users />} />} />
            <Route exact path="/projects" element={<PrivateRoute element={<Projects />} />} />
            <Route exact path="/ProjectDetails/:id" element={<PrivateRoute element={<ProjectDetails />} />} />
            <Route exact path="/ProjectTimeLogs/:projectId/:AssigneeId" element={<PrivateRoute element={<ProjectTimeLogs />} />} />
          </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;