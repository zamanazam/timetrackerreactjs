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
import LayoutPage from './Layout/LayoutPage';
import Alert from './Components/Alert';
import LogInLayout from './Layout/LogInLayout';
import PopUps from './Components/PopUps';
import LoadingSpinner from './Components/LoadingSpinner';
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
  const [popupProps, setPopupProps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeLoaderState = (input = false) => {
    setIsLoading(input);
 };

  const openPopup = (props) => {
    setPopupProps(props);
  };

  const closePopup = () => {
    setPopupProps(null);
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
      {popupProps && (
                <PopUps 
                      show={popupProps.show} 
                      title={popupProps.title} 
                      message={popupProps.message} 
                      firstInputTitle={popupProps.firstInputTitle} 
                      secondInputTitle={popupProps.secondInputTitle} 
                      buttontitle={popupProps.buttontitle} 
                      onClose={closePopup} 
                      onClick={popupProps.onClick}  /> )}
                      {/* {alert && <Alert type={alert.type} message={alert.msg} />} */}
                      {isLoading && <LoadingSpinner />}
        <Routes>
              <Route path="/logIn/*" element={<LogInLayout />}>
                <Route index element={<LogIn changeLoaderState={changeLoaderState}/>} />
                <Route path="createAccount" element={<CreateAccount changeLoaderState={changeLoaderState}/>} />
              </Route>
              
                <Route path='/' element={<PrivateRoute element={<LayoutPage showAlert={showAlert}/>}/>}>
                <Route exact path="/companies" element={<PrivateRoute element={<Companies showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/notAuthorized" element={<PrivateRoute element={<NotAuthorized showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/Detail/:companyId" element={<PrivateRoute element={<CompanyDetail showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/users" element={<PrivateRoute element={<Users showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/projects" element={<PrivateRoute element={<Projects showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/ProjectDetails/:id" element={<PrivateRoute element={<ProjectDetails showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
                <Route exact path="/ProjectTimeLogs/:projectId/:AssigneeId" element={<PrivateRoute element={<ProjectTimeLogs showAlert={showAlert} openPopup={openPopup} changeLoaderState={changeLoaderState}/>} />} />
              </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;