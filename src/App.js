import React, { useEffect, useState } from 'react';
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
import LayoutPage from './Layout/LayoutPage';
import LogInLayout from './Layout/LogInLayout';
import UserDetails from './Pages/UserDetails';
import Dashboard from './Pages/Dashboard';
import ProjectStatus from './Pages/ProjectStatus';
function App() {
  const PrivateRoute = ({ element, ...props }) => {
    const token = sessionStorage.getItem('Token');
    const isLoggedIn = !!token;
    return isLoggedIn ? (
      React.cloneElement(element, props)
    ) : (
      <Navigate to="/logIn" replace state={{ from: props.location?.pathname || '/' }} />
    );
  };

  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeLoaderState = (input = false) => {
    setIsLoading(input);
 };

 const showAlert = (alertType,message)=>{
      setAlert({
            type:alertType,
            msg:message
      })

    }

  return (
    <Router>
      <>
        <Routes>
              <Route path="/logIn/*" element={<LogInLayout />}>
                <Route index element={<LogIn changeLoaderState={changeLoaderState}/>} />
              </Route>
              
                <Route path='/' element={<PrivateRoute element={<LayoutPage showAlert={showAlert} />}/>}>
                <Route exact path="/companies" element={<PrivateRoute element={<Companies />} />} />
                <Route exact path="/Dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route exact path="/notAuthorized" element={<PrivateRoute element={<NotAuthorized showAlert={showAlert} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/Detail/:companyId" element={<PrivateRoute element={<CompanyDetail/>} />} />
                <Route exact path="/users" element={<PrivateRoute element={<Users />} />} />
                <Route exact path="/Details/:paramUserId/:paramRoleId" element={<PrivateRoute element={<UserDetails />} />} />
                <Route exact path="/projects" element={<PrivateRoute element={<Projects showAlert={showAlert} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/ProjectDetails/:id" element={<PrivateRoute element={<ProjectDetails showAlert={showAlert} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/ProjectTimeLogs/:projectId/:AssigneeId" element={<PrivateRoute element={<ProjectTimeLogs showAlert={showAlert} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/ProjectStatus/:status" element={<PrivateRoute element={<ProjectStatus showAlert={showAlert} changeLoaderState={changeLoaderState}/>} />} />
                <Route path="/createAccount" element={<PrivateRoute element={<CreateAccount />} />}/>
              </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;