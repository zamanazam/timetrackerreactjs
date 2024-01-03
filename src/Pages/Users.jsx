import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId } from "../GlobalFile";
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from "../useEffectOnce";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";


function Users({ changeLoaderState }) {
    const navigate = useNavigate();
    const currentRoleId = sessionStorage.getItem('RoleId');
    const [Users, setUsers] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

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

    useEffectOnce(() => {
        getUsers();
    }, []);


    const createAccount = ()=>{
        debugger
        navigate("/createAccount");
    }

    return (
        <>
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
                                        <select className="datatable-selector">
                                            <option>10</option>
                                            <option>20</option>
                                            <option>30</option>
                                            <option>40</option>
                                            <option>50</option>
                                        </select>
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
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Company</th>
                                            <th>Role</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Users !== null && Users.length > 0 ? (
                                            Users.map((User, index) => (
                                                <tr key={index}>
                                                    <td>{User.name}</td>
                                                    <td>{User.email}</td>
                                                    <td>{User.companyName}</td>
                                                    <td>{User.roleName}</td>
                                                    <td className="text-center">
                                                        {
                                                            User.isActive == true
                                                                ? <a className="btn btn-group text-success"><i className="fas fa-toggle-on h5"></i></a>
                                                                : <a className="btn btn-group text-secondary"><i className="fas fa-toggle-off h5"></i></a>
                                                        }

                                                        <a href="#" className="btn-outline-warning h5 bg-transparent"><i className="fa fa-pencil"></i></a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (<tr><td colSpan={5} align="center">No Data Found</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="datatable-bottom">
                                <div className="datatable-info">Showing 1 to 10 of 57 entries</div>
                                <nav className="datatable-pagination">
                                    <ul className="datatable-pagination-list">
                                        <li className="datatable-pagination-list-item datatable-hidden datatable-disabled">
                                            <a data-page="1" className="datatable-pagination-list-item-link">
                                                <i className="fas fa-angle-left"></i>
                                            </a>
                                        </li>
                                        <li className="datatable-pagination-list-item datatable-active">
                                            <a data-page="1" className="datatable-pagination-list-item-link">1</a>
                                        </li>
                                        <li className="datatable-pagination-list-item">
                                            <a data-page="2" className="datatable-pagination-list-item-link">2</a>
                                        </li>
                                        <li className="datatable-pagination-list-item">
                                            <a data-page="3" className="datatable-pagination-list-item-link">3</a>
                                        </li>
                                        <li className="datatable-pagination-list-item">
                                            <a data-page="4" className="datatable-pagination-list-item-link">4</a>
                                        </li>
                                        <li className="datatable-pagination-list-item">
                                            <a data-page="5" className="datatable-pagination-list-item-link">5</a>
                                        </li>
                                        <li className="datatable-pagination-list-item">
                                            <a data-page="2" className="datatable-pagination-list-item-link">
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