import React, { useEffect, useState } from "react";
import { SuperAdminRoleId, apiUrl } from '../GlobalFile';
import { useNavigate } from 'react-router-dom';
import PopUps from "../Components/PopUps";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";

const Companies = () => {
    const [AllCompanies, setCompaniesData] = useState(null);
    const navigate = useNavigate();
    const currentRoleId = sessionStorage.getItem('RoleId');
    const token = sessionStorage.getItem('Token');
    let controller = new AbortController();
    let signal = controller.signal;

    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const openPopup = (props) => {
        setPopupProps(props);
    };

    const closePopup = () => {
        setPopupProps(null);
    };

    const CompanyDetail = (id) => {
        navigate('/Detail/' + id);
    };
    const saveCompany = (inputsFromPopUp) => {
        const AddCompanyDTO = {
            CompanyName: inputsFromPopUp.Name,
            CompanyEmail:inputsFromPopUp.Email
        };
        let url = apiUrl + '/Company/AddNewCompany';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(AddCompanyDTO),
        }).then((response) => response.json())
            .then(response => {
                if (response.statusCode == 200) {
                    setAlert({ type: 'success', msg: "Company saved successfully!" });
                    GetAllCompanies();
                } else {
                    setAlert({ type: 'danger', msg: "Creating company Failed" });
                }
            })
            .catch(error => {
                setAlert({ type: 'danger', msg: error.message });
            })
    }

    const GetAllCompanies = async (Page = 1) => {
        setIsLoading(true);
        const newUrl = apiUrl + '/Company/GetAllComapnies';
        if (Page == null) Page = 1;

        const PageSize = 10;

        const url = new URL(newUrl);
        url.searchParams.append('Page', Page);
        url.searchParams.append('PageSize', PageSize);

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Content-Type', 'application/json');

        const options = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(url, options, { signal });
        const data = await response.json();
        setCompaniesData(data.results);
        setIsLoading(false);
    };

    useEffect(() => {
        GetAllCompanies();
    }, []);

    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}
            <div className="container-fluid px-4">
                {popupProps && (
                    <PopUps
                        inputs={popupProps.inputs||null}
                        show={popupProps.show}
                        title={popupProps.title || null}
                        message={popupProps.message || null}
                        buttontitle={popupProps.buttontitle || null}
                        onClose={closePopup}
                        onClick={saveCompany} />)}
                {isLoading && <LoadingSpinner />}
                <h1 className="mt-4">Companies</h1>
                <div className="row mb-4">
                    <div>
                        <button type="button" className="btn btn-warning float-end"   
                        onClick={() => openPopup({
                                        inputs: [
                                            { name:'Name', InputTitle: 'Name',classField:'form-control mb-4', placeholder : 'Name', type: 'text'},
                                            { name:'Email', InputTitle: 'Email',classField:'form-control mb-2', placeholder : 'Email', type: 'text' },
                                        ],
                                        show: true,
                                        title: 'Create Company',
                                        buttontitle: 'Save',
                                        onClick: saveCompany,
                                    })
                                }>

                            <span className="me-2">
                                <i className="fa fa-plus"></i>
                            </span>Company
                        </button>
                    </div>
                </div>
                <div className="row mb-4">
                    {AllCompanies !== null ? (
                        AllCompanies.map((company, index) => (
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                                <div className="card" onClick={() => CompanyDetail(company.id)}>
                                    <div className="card-header">
                                        <div className="d-flex">
                                            <h4>{company.name}</h4>
                                        </div>
                                    </div>
                                    <div className="card-body bg-gradient"></div>
                                    <div className="card-footer">
                                        <div className="d-flex border">
                                            <p className="ms-3 mt-1">Clients :</p>
                                            <h5 className="ms-5 mt-1">{company.totalClients}</h5>
                                        </div>
                                        <div className="d-flex border mt-3">
                                            <p className="ms-3 mt-1">Projects :</p>
                                            <h5 className="ms-5 mt-1">{company.totalProjects}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) :
                        ('No Data Found')}
                </div>
            </div>
        </>
    )
}
export default Companies;
