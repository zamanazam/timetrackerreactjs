import React,{useState} from 'react';
import { apiUrl,SuperAdminRoleId } from '../GlobalFile';
import { Link, useNavigate } from 'react-router-dom';
import Alert from "../Components/Alert";

import LoadingSpinner from "../Components/LoadingSpinner";
import commonServices from '../Services/CommonServices';

function LogIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState('password'||'text');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

function showPassword(){
      if(inputType == 'password'){
        setInputType('text');
      }else{
        setInputType('password');
      }
  }
  const handleEmailChange = (e) => {
        setEmail
        (e.target.value);
  }

  const handlePasswordChange = (e) =>{
      setPassword(e.target.value);
  }

  const handleSubmit = () => {
    setIsLoading(true);
    const AuthenticateRequest = {
      email: email,
      password: password,
    };

        fetch(apiUrl+'/Home/LogIn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(AuthenticateRequest),
          })
            .then((response) => response.json())
            .then((response) => {
            // setIsLoading(false);
            if(response.id == undefined){
                return false;
            }
             sessionStorage.setItem('RoleId',response.roleId);
             sessionStorage.setItem('UserId',response.id);
             sessionStorage.setItem('Token',response.token);
             sessionStorage.setItem('Name',response.name);
            if(response.roleId == SuperAdminRoleId){
                navigate("/companies");
            }else{
                navigate("/projects");
            }
        })
        .catch((error) => {
            setAlert({ type: 'danger', msg: error.message });
        });
 };

  return (
    <div className="bg-primary">
    {alert && <Alert type={alert.type} message={alert.msg} />}
    {isLoading && <LoadingSpinner />}
    <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                    <div className="card-body">
                                        <form>
                                            <div className="form-floating mb-3">
                                                 <input type="text" name="username" className="form-control" id='Email' placeholder='Email' value={email} onChange={handleEmailChange} required />
                                                <label htmlFor="inputEmail">Email address</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                 {/* <input type="password" name="password" classNameName="form-control" id='Password' placeholder='password' value={password} onChange={handlePasswordChange} required /> */}
                                                 <input className="form-control" id="inputPassword" type={inputType} placeholder="Password" value={password} onChange={handlePasswordChange} required />
                                                <label htmlFor="inputPassword">Password</label>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" onChange={showPassword}/>
                                                <label className="form-check-label" htmlFor="inputRememberPassword" >Show Password</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-end mt-4 mb-0">
                                                <a className="btn btn-primary text-decoration-none" href='#' onClick={handleSubmit}>Login</a>
                                            </div>
                                        </form>
                                    </div>
                                    {/* <div className="card-footer text-center py-3">
                                        <div className="small"><Link to="createAccount">Need an account? Sign up!</Link></div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>

    );
  }
  export default LogIn;