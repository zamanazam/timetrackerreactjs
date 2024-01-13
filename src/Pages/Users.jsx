import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId, AdminRoleId, EmployeeRoleId, ClientRoleId, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import { useNavigate } from 'react-router-dom';
import CustomFields from "../Components/CustomFields";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";
import PopUps from "../Components/PopUps";

function Users({ changeLoaderState }) {
    const navigate = useNavigate();
    const currentRoleId = sessionStorage.getItem('RoleId');
    const [Users, setUsers] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [popupProps, setPopupProps] = useState(null);
    const [pagination, setPagination] = useState({
        Page: 1,
        PageSize: 10,
        Total: 10,
        TotalPages: 1
    });

    const showPopUp = (props)=>{
        setPopupProps(props);
    }
    const closePopup = () => {
        setPopupProps(null);
    };


    const getUsers = (Page = 1) => {
        setIsLoading(true)
        const token = sessionStorage.getItem('Token');
        const url = new URL(apiUrl + '/Admin/GetAllUsers');
        const PageSize = 10;
        var RoleIds = [];
        var SearchUsersObj = {
            'Page': Page,
            'PageSize': PageSize,
            'RoleId': RoleIds
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(SearchUsersObj)
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false)
                setUsers(data.results);
                console.log('Users', data.results);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getUsers();
    }, [pagination.Page, pagination.PageSize]);

    const updateUserStatus = (id,status= false)=>{
        const token = sessionStorage.getItem('Token');
        const url = new URL(apiUrl + '/Admin/UpdateUserStatus');

        var newStatus = status == true ? 1 : 0;

        let UpdateUserStatusDTO ={
            Id:id,
            Status:newStatus
        }
        fetch(url,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UpdateUserStatusDTO)
        }).then((response) => response.json())
        .then((data) => {
            closePopup();
            setAlert({type: 'success', msg: "Company saved successfully!" });
            getUsers();
        })
        .catch((error) => {
            setIsLoading(false);
            setAlert({type:'danger',msg:'Status updating failed!'});
        });
    }

    const createAccount = ()=>{
        navigate("/createAccount");
    }

    const getUserDetails = (id,roleId)=>{
        debugger
        navigate("/Details/"+id+'/'+roleId);
    }

    return (
        <>
        {popupProps && (
                <PopUps
                    inputs={popupProps.inputs || null}
                    show={popupProps.show}
                    title={popupProps.title || null}
                    message={popupProps.message || null}
                    buttontitle={popupProps.buttontitle || null}
                    onClose={closePopup}
                    onClick={popupProps.onClick} />)}
                {alert && <Alert type={alert.type} message={alert.msg} />}
            <div className="container">
                    {isLoading && <LoadingSpinner />}
                <h1 className="mt-4">Users</h1>
                <div className="row mb-4">
                    <div>
                        <button className="btn btn-warning float-end" onClick={() => createAccount()}><span className="me-1"><i className="fa fa-plus"></i></span>User</button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header bg-gray">
                        <i className="fas fa-table me-1"></i>
                        Users Table
                    </div>
                    <div className="card-body">
                        <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                            <div className="datatable-top">
                                <div className="datatable-dropdown">
                                    <label>
                                    <CustomFields type="select" classField="datatable-selector" value={pagination.PageSize} 
                                                onChange={(e) => setPagination({ ...pagination, PageSize: e.target.value, Page: 1 })} optionsArray={paginationArray}></CustomFields>
                                    </label>
                                </div>
                                <div className="datatable-search">
                                    <input type="text" className="datatable-input" placeholder="Search" />
                                </div>
                            </div>
                            <div className="datatable-container">
                                <table id="datatablesSimple" className="datatable-table">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Email</th>
                                            <th className="text-center">Company</th>
                                            <th className="text-center">Role</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Users !== null && Users.length > 0 ? (
                                            Users.map((User, index) => (
                                                <tr key={index} className="text-center">
                                                    <td>{User.name}</td>
                                                    <td>{User.email}</td>
                                                    <td>{User.companyName}</td>
                                                    <td>{User.roleName}</td>
                                                    <td>
                                                        {
                                                            User.isActive == true
                                                                ? <a className="btn btn-group text-success" onClick={()=>showPopUp({
                                                                    inputs : [],
                                                                    show : true,
                                                                    title : 'Block User',
                                                                    message : 'Do you want to block this user?',
                                                                    buttontitle : 'Save',
                                                                    onClick : ()=>updateUserStatus(User.id,false)
                                                                })
                                                            }><i className="fas fa-toggle-on"></i></a>
                                                                : <a className="btn btn-group text-secondary" onClick={()=>showPopUp({
                                                                    inputs: [],
                                                                    show: true,
                                                                    title: 'Un-block User',
                                                                    message:'Do you want to Un-block this user?',
                                                                    buttontitle: 'Save',
                                                                    onClick : ()=>updateUserStatus(User.id,true),
                                                                })
                                                            }><i className="fas fa-toggle-off"></i></a>
                                                        }

                                                        <a href="#" className="btn-outline-warning bg-transparent" onClick={()=>getUserDetails(User.id,User.roleId)}><i className="fa fa-pencil"></i></a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (<tr><td colSpan={5} align="center">No Data Found</td></tr>)}
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
        </>
    )
}
export default Users;