import React,{useState} from 'react';
import { apiUrl,SuperAdminRoleId } from '../GlobalFile';
import { Link, useNavigate } from 'react-router-dom';

import LoadingSpinner from "../Components/LoadingSpinner";

function LogIn(){
    console.log('login',1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState('password'||'text')
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
            setIsLoading(false);
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
        console.error('Error:', error);
      });
 };

  return (
    <div className="bg-primary">
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
                                                {/* <a className="small" href="password.html">Forgot Password?</a> */}
                                                <a className="btn btn-primary" href='#' onClick={handleSubmit}>Login</a>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center py-3">
                                        <div className="small"><Link to="createAccount">Need an account? Sign up!</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>


//     <div classNameName="container">
//         <section classNameName="section register d-flex position-absolute flex-column align-items-center justify-content-center py-4">
//     <div classNameName="container">
//         <div classNameName="row justify-content-center">
//             <div classNameName="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

//                 <div classNameName="d-flex justify-content-center py-4">
//                     <a href="index.html" classNameName="logo d-flex align-items-center w-auto">
//                         <img src="~/img/logo.png" alt=""/>
//                         <span classNameName="d-none d-lg-block">Employee Portal</span>
//                     </a>
//                 </div>

//                 <div classNameName="card mb-3">
//                     <div classNameName="card-body">
//                         <div classNameName="pt-4 pb-2">
//                             <h5 classNameName="card-title text-center pb-0 fs-4">Login to Your Account</h5>
//                             <p classNameName="text-center small">Enter your email & password to login</p>
//                         </div>

//                         <form classNameName="row g-3">

//                             <div classNameName="col-12">
//                                 <label htmlFor="yourUsername" classNameName="form-label">User Name</label>
//                                 <div classNameName="input-group has-validation">
//                                     <span classNameName="input-group-text" id="inputGroupPrepend">@</span>
//                                     <input type="text" name="username" classNameName="form-control" id='Email' placeholder='Email' value={email} onChange={handleEmailChange} required />
//                                 </div>
//                             </div>

//                             <div classNameName="col-12">
//                                 <label htmlFor="yourPassword" classNameName="form-label">Password</label>
//                                 <input type="password" name="password" classNameName="form-control" id='Password' placeholder='password' value={password} onChange={handlePasswordChange} required />
//                             </div>

//                             <div classNameName="col-12">
//                                 <div classNameName="form-check">
//                                     <input classNameName="form-check-input" type="checkbox" name="remember" ng-model="vm.AuthenticateObj.isRemember" value="false" id="rememberMe" />
//                                     <label classNameName="form-check-label" htmlFor="rememberMe">Show Password</label>
//                                 </div>
//                             </div>
//                             <div classNameName="col-12">
//                                 <a classNameName="btn btn-primary w-100" href='#' onClick={handleSubmit}>Login</a>
//                             </div>
//                             <div classNameName="col-12">
//                                 <p classNameName="small mb-0">Don't have account? <a href="/Auth/CreateAccount">Create an account</a></p>
//                             </div>
//                         </form>
                            
//                     </div>
//                 </div>


//             </div>
//         </div>
//     </div>

// </section>
//     </div>

    );
  }
  export default LogIn;