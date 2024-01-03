import React, { useEffect, useState } from 'react';
import { apiUrl, ClientRoleId, SuperAdminRoleId } from '../GlobalFile';
import Alert from '../Components/Alert';
import LoadingSpinner from '../Components/LoadingSpinner';

export default function CreateAccount() {
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [roles, allRoles] = useState(null);
    const [companies, allCompanies] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const GetRoles = async () => {
        try {
            const token = sessionStorage.getItem('Token');
            const url = new URL(apiUrl + '/Admin/GetRoles');

            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json');

            const options = {
                method: 'GET',
                headers: headers,
            };

            const response = await fetch(url, options);
            const data = await response.json();
            allRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const GetCompanies = async () => {
        try {
            const token = sessionStorage.getItem('Token');
            const url = new URL(apiUrl + '/Admin/GetCompanyName');

            const headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);
            headers.append('Content-Type', 'application/json');

            const options = {
                method: 'GET',
                headers: headers,
            };

            const response = await fetch(url, options);
            const data = await response.json();
            console.log('rol',data);
            allCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await GetRoles();
            await GetCompanies();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const saveUser = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAlert({ type: 'success', msg: 'Company saved successfully!' });
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
                                                    <input className="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" />
                                                    <label htmlFor="inputFirstName">First name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input className="form-control" id="inputLastName" type="text" placeholder="Enter your last name" />
                                                    <label htmlFor="inputLastName">Last name</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
                                            <label htmlFor="inputEmail">Email address</label>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3 mb-md-0">
                                                    <input className="form-control" id="inputPassword" type="password" placeholder="Create a password" />
                                                    <label htmlFor="inputPassword">Password</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3 mb-md-0">
                                                    <input className="form-control" id="inputPasswordConfirm" type="password" placeholder="Confirm password" />
                                                    <label htmlFor="inputPasswordConfirm">Confirm Password</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            {roles != null ?
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <select className="form-select" id="inputRole" onChange={handleRoleChange}>
                                                            {roles.filter(role => role.id !== SuperAdminRoleId)
                                                                .map((role, index) => (
                                                                    <option key={index} value={role.id}>
                                                                            {role.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label htmlFor="inputRole">Roles</label>
                                                    </div>
                                                </div>
                                            :
                                                null
                                            }

                                            {selectedRole == ClientRoleId && companies != null
                                            ? 
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <select className="form-select" id="inputCompany" onChange={handleCompanyChange}>
                                                        {companies.map((company, index) => (
                                                            <option key={index} value={company.id}>
                                                                {company.name}
                                                            </option>
                                                        ))}
                                                        </select>
                                                        <label htmlFor="inputCompany">Company</label>
                                                    </div>
                                                </div>
                                            :
                                                null
                                            }
                                        </div>
                                        <div className="mt-4 mb-0">
                                            <div className="d-grid"><a className="btn btn-primary btn-block" href="#" onClick={()=>saveUser()}>Create Account</a></div>
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
