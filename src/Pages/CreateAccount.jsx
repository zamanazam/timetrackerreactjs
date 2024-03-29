import React, { useEffect, useState } from 'react';
import { ClientRoleId, SuperAdminRoleId } from '../GlobalFile';
import Alert from '../Components/Alert';
import LoadingSpinner from '../Components/LoadingSpinner';
import CustomFields from '../Components/CustomFields';
import commonServices from '../Services/CommonServices';
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [roles, allRoles] = useState([]);
    const [companies, allCompanies] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formInput, updateFormInput] = useState({})
    const [samePasswords,setPasswordsState] = useState(true);
    const navigate = useNavigate();

    const GetRoles = async () => {
            allRoles(await commonServices.HttpGet(null,'/Admin/GetRoles'));
    };

    const GetCompanies = async () => {
            allCompanies(await commonServices.HttpGet(null,'/Admin/GetCompanyName'));
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsLoading(false);
            await GetRoles();
            await GetCompanies();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleRoleChange = (e) => {
        updateFormInput({ ...formInput, forRole: e.target.value })
        setSelectedRole(e.target.value);
    };

    const handleCompanyChange = (e) => {
        updateFormInput({ ...formInput, companyId: e.target.value })
        setSelectedCompany(e.target.value);
    };


    const saveUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setPasswordsState(true);
        
        if(formInput.password != formInput.confirmPassword){
            setPasswordsState(false);
            return null;
        }

            let AddUserDTO = {
                Name: formInput.firstName + formInput.lastName,
                Email: formInput.email,
                Password: formInput.password,
                ForRole:formInput.forRole,
                CompanyId:formInput.companyId
            }
            var data = await commonServices.HttpPost(AddUserDTO,'/Admin/AddUser')
            setIsLoading(false);
            if(data.statusCode ==200){
                setAlert({ type: 'success', msg: 'User created successfully!' });
                navigate('/users');
            }else{
                setAlert({ type: 'danger', msg: 'User creating failed!' });
            }
    };
  return (
    <div>
        {alert && <Alert type={alert.type} message={alert.msg} />}
        {isLoading && <LoadingSpinner />}
    <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
            <main>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="card shadow-lg border-0 rounded-lg mt-5">
                                <div className="card-header"><h3 className="text-center font-weight-light my-4">Create Account</h3></div>
                                <div className="card-body">
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3 mb-md-0">
                                                    <CustomFields classField="form-control" type="text" placeholder="Enter your first name"
                                                    onChange={e => updateFormInput({ ...formInput, firstName: e.target.value })} ></CustomFields>
                                                    <label htmlFor="inputFirstName">First name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                <CustomFields classField="form-control" type="text" placeholder="Enter your last name"
                                                    onChange={e => updateFormInput({ ...formInput, lastName: e.target.value })} ></CustomFields>
                                                    <label htmlFor="inputLastName">Last name</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                                <CustomFields classField="form-control" type="email" placeholder="name@example.com"
                                                    onChange={e => updateFormInput({ ...formInput, email: e.target.value })} ></CustomFields>
                                            <label htmlFor="inputEmail">Email address</label>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3 mb-md-0">
                                                <CustomFields classField="form-control" type="password" placeholder="Password"
                                                    onChange={e => updateFormInput({ ...formInput, password: e.target.value })} ></CustomFields>
                                                    <label htmlFor="inputPassword">Password</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3 mb-md-0">
                                                <CustomFields classField="form-control" type="password" placeholder="Confirm Password"
                                                    onChange={e => updateFormInput({ ...formInput, confirmPassword: e.target.value })} ></CustomFields>
                                                    <label htmlFor="inputPasswordConfirm">Confirm Password</label>
                                                </div>
                                                {!samePasswords && <strong className='text-danger small'>password and confirm password should same</strong>}
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            {roles.length > 0 &&
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <CustomFields classField="form-select" type="select" placeholder=" " onChange={e => handleRoleChange(e)}
                                                            optionsArray={roles} hideOption={SuperAdminRoleId}>
                                                         </CustomFields>
                                                        <label htmlFor="inputRole">Roles</label>
                                                    </div>
                                                </div>
                                            }

                                            {selectedRole == ClientRoleId && companies.length > 0 && 
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <CustomFields classField="form-select" type="select" placeholder=" " onChange={e => handleCompanyChange(e)}
                                                            optionsArray={companies} hideOption={null}>
                                                         </CustomFields>
                                                        <label htmlFor="inputCompany">Company</label>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="mt-4 mb-0">
                                            <div className="d-grid"><a className="btn btn-primary btn-block" href="#" onClick={(e)=>saveUser(e)}>Create Account</a></div>
                                        </div>
                                    </form>
                                </div>
                                {/* <div className="card-footer text-center py-3">
                                    <div className="small"><Link to="/logIn">Have an account? Go to login</Link></div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</div>
  )
}
