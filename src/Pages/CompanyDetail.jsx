import React, { useEffect, useState } from "react";
import { apiUrl } from '../GlobalFile';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import PopUps from "../Components/PopUps";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";

const CompanyDetail = () => {
    const [CompanyData, setCompanyData] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyStatus, setCompanyStatus] = useState('');
    const [isEmailValid, setEmailValid] = useState(true);
    const [isNameValid, setNameValid] = useState(true);

    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const { companyId } = useParams();
    const navigate = useNavigate();

    const token = sessionStorage.getItem('Token');
    const controller = new AbortController();
    const signal = controller.signal;

    const openPopup = (props) => {
        setPopupProps(props);
    };

    const closePopup = () => {
        setPopupProps(null);
    };

    const GetCompanyDetailsbyId = (e) => {
        setIsLoading(true);
        const headers = new Headers();
        const token = sessionStorage.getItem('Token');
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Content-Type', 'application/json');

        const url = new URL(apiUrl + '/Company/GetCompanyDatabyId');
        url.searchParams.append('id', companyId);
        const options = {
            method: 'GET',
            headers: headers,
        };

        fetch(url, options, { signal })
            .then((response) => response.json())
            .then((data) => {
                console.log('Companies', data);
                setCompanyData(data);
                setCompanyStatus(data?.isActive);
                setCompanyName(data?.name);
                setCompanyEmail(data?.email);
                setIsLoading(false);
            })
            .catch((error) => {
                setAlert({ type: 'Error', msg: error.message });
            });
    };

    useEffect(() => {
        GetCompanyDetailsbyId();
    }, []);


    const CheckTimeLogbyAdmin = (id) => {
        navigate('/ProjectTimeLogs/' + id + '/' + undefined);
    }

    const saveProject = (firstInputValue, secondInputValue) => {
        setIsLoading(true);
        let AddProjectDTO = {
            Name: firstInputValue,
            Description: secondInputValue,
            CompanyId: companyId
        }
        let url = apiUrl + '/Project/AddNewProjects';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(AddProjectDTO),
        }).then((response) => response.json())
            .then(response => {
                setIsLoading(false)
                if (response.statusCode == 200) {
                    setAlert({ type: 'success', msg: "Project saved successfully!" });
                    GetCompanyDetailsbyId();
                } else {
                    setAlert({ type: 'danger', msg: "Updating Project Failed" });
                }
            })
            .catch(error => {
                setAlert({ type: 'danger', msg: error.message });
            })
    }

    const UpdateCompany = () => {
        setIsLoading(true)
        if (companyName.trim() === "") {
            setNameValid(false);
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(companyEmail);
        if (!isValid) {
            setEmailValid(false);
            return false;
        }

        let UpdateCompanyDTO = {
            name: companyName,
            email: companyEmail,
            isActive: companyStatus,
            id: companyId
        }
        let url = apiUrl + '/Company/UpdateCompanybyId';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UpdateCompanyDTO),
        }).then((response) => response.json())
            .then(response => {
                setIsLoading(false);
                if (response.statusCode == 200) {
                    setAlert({ type: 'success', msg: "Company Updated successfully!" });
                    GetCompanyDetailsbyId();
                } else {
                    setAlert({ type: 'danger', msg: "Updating Company Failed" });
                }
            })
            .catch(error => {
                setAlert({ type: 'danger', msg: error.message });
            })
    };


    const handleCompanyName = (e) => {
        setCompanyName(e.target.value)
        setNameValid(true);
    };

    const handleCompanyEmail = (e) => {
        e.preventDefault();
        setCompanyEmail(e.target.value);
        setEmailValid(true);
    }

    const handleCompanyStatus = (e) => {
        setCompanyStatus(!companyStatus);
    }

    const ProjectDetails = (projectId) => {
        navigate('/ProjectDetails/' + projectId);
    }

    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}
            <div className="container">
                {popupProps && (
                    <PopUps
                        show={popupProps.show}
                        title={popupProps.title}
                        message={popupProps.message}
                        firstInputTitle={popupProps.firstInputTitle}
                        secondInputTitle={popupProps.secondInputTitle}
                        buttontitle={popupProps.buttontitle}
                        onClose={closePopup}
                        onClick={popupProps.onClick} />)}
                {isLoading && <LoadingSpinner />}

                <h1 className="mt-4 mb-4">Company Details</h1>
                <div className="row mb-2">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Company Name</label>
                        <input type="text" className="form-control" onChange={handleCompanyName} defaultValue={CompanyData?.name} />
                        {!isNameValid && (
                            <p className='text-danger mt-1 small'>Enter name first</p>
                        )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Company Email</label>
                        <input type="text" className="form-control" onChange={handleCompanyEmail} defaultValue={CompanyData?.email} />
                        {!isEmailValid && (
                            <p className='text-danger mt-1 small'>Enter valid email</p>
                        )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Status</label>
                        <select className="form-select" onChange={handleCompanyStatus} value={companyStatus ? "true" : "false"}>
                            <option value="true">Active</option>
                            <option value="false">Block</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-4">
                    <div>
                        <button className="btn btn-success mt-4 float-end" onClick={() => UpdateCompany()}><span className="me-2"><i className="fas fa-redo"></i></span>Update</button>

                        <button type="button" href="#" className="btn btn-warning mt-4 float-end me-2"
                            onClick={(e) => {
                                openPopup({
                                    show: true,
                                    title: "Create Project",
                                    firstInputTitle: 'Name',
                                    secondInputTitle: 'Description',
                                    buttontitle: 'Save',
                                    onClick: saveProject,
                                    event: e
                                });
                            }}>
                            <span className="me-2">
                                <i className="fa fa-plus"></i>
                            </span>Project
                        </button>
                    </div>
                </div>
                <div className="card">
                    <header className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <a href="#" data-bs-target="#tab_specs" data-bs-toggle="tab" className="nav-link active">Clients</a>
                            </li>
                            <li className="nav-item">
                                <a href="#" data-bs-target="#tab_warranty" data-bs-toggle="tab" className="nav-link">Projects</a>
                            </li>
                        </ul>
                    </header>
                    <div className="tab-content">
                        <article id="tab_specs" className="tab-pane show card-body">
                            <table className="table border table-hover" id="Specifications">
                                <thead>
                                    <tr>
                                        <th className="text-center">Sr.</th>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">Email</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CompanyData !== null && CompanyData.clientsCompany.length > 0 ? (
                                        CompanyData.clientsCompany.map((client, index) => (
                                            <tr className="border" key={index}>
                                                <td className="border text-center">{index + 1}</td>
                                                <td className="border text-center">{client.name}</td>
                                                <td className="border text-center">{client.email}</td>

                                                {client.isActive ? (
                                                    <td className="border text-center">
                                                        <i className="fa fa-check" title="Active" style={{ fontSize: '24px', color: 'green' }} ></i>
                                                    </td>
                                                ) : (
                                                    <td className="border text-center">
                                                        <i className="fa fa-ban" title="Blocked" style={{ fontSize: '24px', color: 'red' }} ></i>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} align="center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mb-5 mt-5" id="paginationContainer1"></div>
                        </article>

                        <article id="tab_warranty" className="tab-pane active card-body">
                            <div className="row">
                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                    <div className="datatable-container">
                                        <table id="data-table" className="datatable-table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">Sr.</th>
                                                    <th className="text-center">Projects</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-center">Created On</th>
                                                    <th className="text-center">TimeLogs</th>
                                                    <th className="text-center">Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody id="dataContainer">
                                                {CompanyData !== null && CompanyData.companyProjects.length > 0 ? (
                                                    CompanyData.companyProjects.map((projects, index) => (
                                                        <tr key={index}>
                                                            <td className="border text-center">{index + 1}</td>
                                                            <td className="border text-center">{projects.name}</td>
                                                            <td className="border text-center">
                                                                {projects.employeesProjects && projects.employeesProjects.length == 0
                                                                    ? 'Un-Assigned'
                                                                    : 'Assigned'}
                                                            </td>
                                                            <td className="border text-center">{projects.createdOn}</td>
                                                            {projects.employeesProjects && projects.employeesProjects.length == 0
                                                                ? <td className="border text-center"></td>
                                                                : <td className="border text-center"><a onClick={() => CheckTimeLogbyAdmin(projects.id)} className="btn btn-outline-info"><span><i className="fa fa-solid fa-list" style={{ fontsize: '24px' }}></i></span></a></td>
                                                            }

                                                            <td className="border text-center"><a onClick={() => ProjectDetails(projects.id)} className="btn btn-outline-warning"><span><i className="fa fa-pencil" style={{ fontsize: '24px' }}></i></span></a></td>
                                                        </tr>
                                                    ))) :
                                                    (
                                                        <tr><td colSpan={7} align="center">No Data Found</td></tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mb-5 mt-5" id="paginationContainer"></div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CompanyDetail;