import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId, AdminRoleId, EmployeeRoleId, ClientRoleId } from "../GlobalFile";
import { useParams } from "react-router-dom";
import CustomButton from "../Components/CustomButton";


function ProjectTimeLogs() {
    const [TimeLogsData, setTimeLogsData] = useState(null);
    const { projectId, AssigneeId } = useParams();
    const currentRoleId = sessionStorage.getItem('RoleId');
    const currentUserId = sessionStorage.getItem('UserId');

    useEffect(() => {
        GetTimeLogs();
    }, []);


    function GetTimeLogs(page = 1) {
        debugger
        const token = sessionStorage.getItem('Token');
        var EmployeeId = null;
        var UserId = null;
        var date = new Date();
        var d = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 3, 0);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (currentRoleId != EmployeeRoleId) {
            if (AssigneeId == undefined) {
                if (currentRoleId == SuperAdminRoleId) {
                    EmployeeId = null;
                } else {
                    EmployeeId = currentUserId;
                }
            } else {
                //if (AssigneeId == 'null' || AssigneeId == '0')
                    EmployeeId = AssigneeId;
            }
        } else {
            UserId = currentUserId;
        }

        var TimeLogsuserProjectDTo = {
            'DateFrom': firstDay,
            'DateTo': lastDay,
            'EmployeeId': EmployeeId,
            'Page': page,
            'PageSize': 100,
            'ProjectId': projectId,
            'UserId': UserId,
            'CRoleId': currentRoleId
        }
        debugger
        const url = new URL(apiUrl + '/ProjectTimeLogs/GetTimeLogbyConditions');
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TimeLogsuserProjectDTo)
        })
            .then((response) => response.json())
            .then((data) => {
                debugger
                console.log('client', data.results);
                setTimeLogsData(data.results);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const UpdateTimeLogs = () => {
        debugger
    }


    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const allRows = TimeLogsData.map((_, index) => index);
        setSelectedRows(selectAll ? [] : allRows);
    };

    const handleCheckboxChange = (index) => {
        const updatedSelectedRows = [...selectedRows];
        const currentIndex = updatedSelectedRows.indexOf(index);
        if (currentIndex === -1) {
            updatedSelectedRows.push(index);
        } else {
            updatedSelectedRows.splice(currentIndex, 1);
        }
        setSelectedRows(updatedSelectedRows);
    };

    const showButtons = selectedRows.length > 0;


    if (currentRoleId == SuperAdminRoleId) {
        return (
            <div className="container">
                <h1 className="mt-4">Project TimeLogs</h1>
                <div className="row mt-4 mb-5">
                    <div className="card p-3">
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
                                                {/* <th><input type="checkbox" className="form-check-input" style={{height:'15px',width:'15px'}}/></th> */}
                                                <th className="text-center">Company</th>
                                                <th className="text-center">Employee</th>
                                                <th className="text-center">LogText</th>
                                                <th className="text-center">Hours</th>
                                                <th className="text-center">Created On</th>
                                                <th className="text-center">Approved</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {TimeLogsData !== null ? (
                                                TimeLogsData.map((Log, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">{Log.sendOn}</td>
                                                        <td className="text-center">{Log.isApproved == 1 ? <i className="bi bi-check-lg"></i> : ''}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={7}>No Data Found</td></tr>
                                            )}
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
            </div>
        )
    }

    if (currentRoleId == ClientRoleId) {
        return (
            <div className="container">
                <h1 className="mt-4">Project TimeLogs</h1>
                <div className="row mt-4 mb-4">
                    {showButtons && (
                        <div>
                            <button className="btn btn-warning float-end ms-2"><span className="me-2"><i className="fa fa-close"></i></span>Reject</button>
                            <button className="btn btn-success float-end" ><span className="me-2"><i className="fa fa-check"></i></span>Approve</button>
                        </div>
                    )}
                    <div>
                    </div>
                </div>
                <div className="row mt-4 mb-5">
                    <div className="card p-3">
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
                                                <th><input type="checkbox" className="form-check-input" style={{ height: '15px', width: '15px' }} checked={selectAll} onChange={handleSelectAll} /></th>
                                                <th className="text-center">Company</th>
                                                <th className="text-center">Employee</th>
                                                <th className="text-center">LogText</th>
                                                <th className="text-center">Hours</th>
                                                <th className="text-center">Created On</th>
                                                <th className="text-center">Approved</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {TimeLogsData !== null ? (
                                                TimeLogsData.map((Log, index) => (
                                                    <tr key={index}>
                                                        <th><input type="checkbox" className="form-check-input" style={{ height: '15px', width: '15px' }} checked={selectedRows.includes(index)} onChange={() => handleCheckboxChange(index)} /></th>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">{Log.sendOn}</td>
                                                        {Log.isApproved == 0 && Log.isRejected == 0 ? <td className="text-center"></td> : null}
                                                        {Log.isRejected == 1 ? <td className="text-center"><i className="fa fa-warning" style={{ fontsize: '30px', color: 'red' }}></i></td> : null}
                                                        {Log.isApproved == 1 ? <td className="text-center"><i className="fa fa-check"></i></td> : null}

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={7}>No Data Found</td></tr>
                                            )}
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

                    </div><i className="fa fa-warning" style={{ fontsize: '30px', color: 'red' }}></i>
                </div>
            </div>
        )
    }



    if (currentRoleId == EmployeeRoleId) {
        return (
            <div className="container">
                <h1 className="mt-4">Project TimeLogs</h1>
                <div className="row bg-light pb-3 pt-2 rounded-3">
                    <div className="col-lg-1 col-md-6 col-sm-12">
                        <label>Hours</label>
                        <input type="text" className="form-control" id="Hours" />
                    </div>
                    <div className="col-lg-10 col-md-6 col-sm-12">
                        <label>Description</label>
                        <input type="text" className="form-control" id="Description" />
                    </div>
                    <div className="col-lg-1 col-md-6 col-sm-12">
                        <CustomButton className="btn btn-success mt-4" label="Save" onClick={() => UpdateTimeLogs()} ></CustomButton>
                    </div>
                </div>
                <div className="row mt-4 mb-5">
                    <div className="card p-3">
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
                                                <th className="text-center">Company</th>
                                                <th className="text-center">Employee</th>
                                                <th className="text-center">LogText</th>
                                                <th className="text-center">Hours</th>
                                                <th className="text-center">Created On</th>
                                                <th className="text-center">Approved</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {TimeLogsData !== null ? (
                                                TimeLogsData.map((Log, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">{Log.sendOn}</td>
                                                        <td className="text-center">{Log.isApproved == 1 ? <i className="fa fa-check"></i> : ''}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={7}>No Data Found</td></tr>
                                            )}
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
            </div>
        )
    }

}
export default ProjectTimeLogs;