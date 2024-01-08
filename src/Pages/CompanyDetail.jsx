import React, { useEffect, useState } from "react";
import { apiUrl,statusArray } from '../GlobalFile';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import PopUps from "../Components/PopUps";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";
import CustomFields from "../Components/CustomFields";

const CompanyDetail = () => {
    const [CompanyData, setCompanyData] = useState(null);
    const [isEmailValid, setEmailValid] = useState(true);
    const [isNameValid, setNameValid] = useState(true);

    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formInput, updateFormInput] = useState({})

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
                setCompanyData(data);
                    updateFormInput({
                        name: data?.name,
                        email: data?.email,
                        isActive: data?.isActive
                    })
                setIsLoading(false);
            })
            .catch((error) => {
                setAlert({ type: 'danger', msg: error.message });
            });
    };

    useEffect(() => {
        GetCompanyDetailsbyId();
    }, []);


    const CheckTimeLogbyAdmin = (id) => {
        navigate('/ProjectTimeLogs/' + id + '/' + undefined);
    }

    const saveProject = (popReturn) => {
        setIsLoading(true);
        let AddProjectDTO = {
            Name: popReturn.Name,
            Description: popReturn.Description,
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
        setIsLoading(true);
        if (formInput.name.trim() === "") {
            setIsLoading(false);
            setNameValid(false);
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(formInput.email);
        if (!isValid) {
            setIsLoading(false);
            setEmailValid(false);
            return false;
        }

        let UpdateCompanyDTO = {
            name: formInput.name,
            email: formInput.email,
            isActive: formInput.isActive,
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

    const handleCompanyStatus = (e) => {
        updateFormInput({ ...formInput, isActive: !formInput.isActive })
    }

    const ProjectDetails = (projectId) => {
        navigate('/ProjectDetails/' + projectId);
    }

    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}
            <div className="container">
                {popupProps && (
                    <PopUps                        inputs={popupProps.inputs||null}
                    show={popupProps.show}
                    title={popupProps.title || null}
                    message={popupProps.message || null}
                    buttontitle={popupProps.buttontitle || null}
                    onClose={closePopup}
                    onClick={saveProject} />)}
                {isLoading && <LoadingSpinner />}

                <h1 className="mt-4 mb-4">Company Details</h1>
                <div className="row mb-2">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Company Name</label>
                        <CustomFields classField="form-control" type="text" placeholder="Name"
                                             value={formInput.name} onChange={e => updateFormInput({ ...formInput, name: e.target.value })} ></CustomFields>
                        {!isNameValid && (
                            <p className='text-danger mt-1 small'>Enter name first</p>
                        )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Company Email</label>
                        <CustomFields classField="form-control" type="email" placeholder="Email"
                                             value={formInput.email} onChange={e => updateFormInput({ ...formInput, email: e.target.value })} ></CustomFields>
                        {!isEmailValid && (
                            <p className='text-danger mt-1 small'>Enter valid email</p>
                        )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <label>Status</label>
                        <CustomFields classField="form-select" type="select" placeholder="Project Status" value={formInput.isActive} onChange={handleCompanyStatus} optionsArray={statusArray}></CustomFields>
                    </div>
                </div>
                <div className="row mb-4">
                    <div>
                        <button className="btn btn-success mt-4 float-end" onClick={() => UpdateCompany()}><span className="me-2"><i className="fas fa-redo"></i></span>Update</button>

                        <button type="button" href="#" className="btn btn-warning mt-4 float-end me-2"
                            onClick={() => openPopup({
                                inputs: [
                                    { name:'Name', InputTitle: 'Name',classField:'form-control mb-4', placeholder : 'Name', type: 'text'},
                                    { name:'Description', InputTitle: 'Description',classField:'form-control mb-2', placeholder : 'Description', type: 'textarea' },
                                ],
                                show: true,
                                title: 'Create Project',
                                buttontitle: 'Save',
                                onClick: saveProject,
                            })}>
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