import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId, AdminRoleId, EmployeeRoleId, ClientRoleId, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import { useNavigate } from 'react-router-dom';
import PopUps from "../Components/PopUps";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";
import CustomFields from "../Components/CustomFields";
const Companies = () => {
    const [AllCompanies, setCompaniesData] = useState([]);
    const navigate = useNavigate();
    const currentRoleId = sessionStorage.getItem('RoleId');
    const token = sessionStorage.getItem('Token');
    let controller = new AbortController();
    let signal = controller.signal;

    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [pagination, setPagination] = useState({
        Page: 1,
        PageSize: 10,
        Total: 10,
        TotalPages: 1
    });
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
            CompanyEmail: inputsFromPopUp.Email
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

    const GetAllCompanies = async () => {
        setIsLoading(true);
        const newUrl = apiUrl + '/Company/GetAllComapnies';

        const url = new URL(newUrl);
        url.searchParams.append('Page', pagination.Page);
        url.searchParams.append('PageSize', pagination.PageSize);

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        headers.append('Content-Type', 'application/json');

        const options = {
            method: 'GET',
            headers: headers,
        };
        const response = await fetch(url, options, { signal });
        const data = await response.json();
        setPagination({
            Page: data.page,
            PageSize: data.pageSize,
            Total: data.total,
            TotalPages: data.totalPages
        })
        setCompaniesData(data.results);
        setIsLoading(false);
    };

    useEffect(() => {
        GetAllCompanies();
    }, [pagination.PageSize, pagination.Page]);

    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}
            <div className="container">
                {popupProps && (
                    <PopUps
                        inputs={popupProps.inputs || null}
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
                                    { name: 'Name', InputTitle: 'Name', classField: 'form-control mb-2', type: 'text' },
                                    { name: 'Email', InputTitle: 'Email', classField: 'form-control mb-2', type: 'text' },
                                ],
                                show: true,
                                title: 'Create Company',
                                buttontitle: 'Save',
                                onClick: saveCompany,
                            })}>

                            <span className="me-2">
                                <i className="fa fa-plus"></i>
                            </span>Company
                        </button>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="card p-3">
                        <div className="card-body">
                            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                <div className="datatable-top">
                                    <div className="datatable-dropdown">
                                        <label>
                                            <CustomFields type="select" classField="datatable-selector"
                                                value={pagination.PageSize} onChange={(e) => setPagination({ ...pagination, PageSize: e.target.value, Page: 1 })} optionsArray={paginationArray}></CustomFields>
                                        </label>
                                    </div>
                                    <div className="datatable-search">
                                        <input type="text" id="datePickerInput" placeholder="Search" className="form-control text-center" />
                                    </div>
                                </div>
                                <div className="datatable-container">
                                    <table id="datatablesSimple" className="datatable-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Sr</th>
                                                <th className="text-center">Name</th>
                                                <th className="text-center">Email</th>
                                                <th className="text-center">Clients</th>
                                                <th className="text-center">Projects</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {AllCompanies.length > 0 && AllCompanies.map((com, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {getStartPointOfPagination(pagination.PageSize, pagination.Page) + index}
                                                    </td>
                                                    <td className="text-center">{com.name}</td>
                                                    <td className="text-center">{com.email}</td>
                                                    <td className="text-center">{com.totalClients}</td>
                                                    <td className="text-center">{com.totalProjects}</td>
                                                    <td className="text-center">{com.isActive == true ? 'Active' : 'Block'}</td>
                                                    <td className="text-center">
                                                        <a href="#" className="btn-outline-warning bg-transparent" onClick={() => CompanyDetail(com.id)}>
                                                            <i className="fa fa-pencil" style={{ fontsize: '24px', color: 'orange' }}></i></a>
                                                    </td>
                                                </tr>
                                            ))}
                                            {AllCompanies.length == 0 &&
                                                <tr>
                                                    <td colSpan={7} align="center">No Data Found</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="datatable-bottom">
                                    <div className="datatable-info">
                                        Showing {getStartPointOfPagination(pagination.PageSize, pagination.Page)} to {getEntriesOfPagination(pagination.PageSize, pagination.Page, pagination.Total)} of {pagination.Total} entries
                                    </div>
                                    <nav className="datatable-pagination">
                                        <ul className="datatable-pagination-list">
                                            <li className={`datatable-pagination-list-item ${pagination.Page === 1 ? 'datatable-disabled datatable-hidden' : ''}`}>
                                                <a data-page="1" href="#" onClick={() => setPagination({ ...pagination, Page: pagination.Page - 1 })} className="datatable-pagination-list-item-link">
                                                    <i className="fas fa-angle-left"></i>
                                                </a>
                                            </li>
                                            {getPagesTags(pagination.TotalPages).length > 0 && getPagesTags(pagination.TotalPages).map((result, key) => (
                                                <li className={`datatable-pagination-list-item ${pagination.Page == result ? 'datatable-active' : ''}`}
                                                    onClick={() => setPagination({ ...pagination, Page: result })} key={key}>
                                                    <a data-page={result} className="datatable-pagination-list-item-link text-decoration-none">{result}</a>
                                                </li>
                                            ))}

                                            <li className={`datatable-pagination-list-item ${pagination.Page === pagination.TotalPages ? 'datatable-disabled' : ''}`}>
                                                <a data-page="2" href="#" onClick={() => setPagination({ ...pagination, Page: pagination.Page + 1 })} className="datatable-pagination-list-item-link">
                                                    <i className="fas fa-angle-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Companies;