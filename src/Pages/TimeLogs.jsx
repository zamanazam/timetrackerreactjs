import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId, AdminRoleId, EmployeeRoleId, ClientRoleId } from "../GlobalFile";
import { useParams } from "react-router-dom";
import CustomButton from "../Components/CustomButton";
import CustomFields from "../Components/CustomFields";
import Alert from "../Components/Alert";
import LoadingSpinner from "../Components/LoadingSpinner";
import PopUps from "../Components/PopUps";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function ProjectTimeLogs() {
    const [TimeLogsData, setTimeLogsData] = useState(null);
    const { projectId, AssigneeId } = useParams();
    const [toUpdate, setUpdateButton] = useState(false);
    const currentRoleId = sessionStorage.getItem('RoleId');
    const currentUserId = sessionStorage.getItem('UserId');
    //const [formInput, updateFormInput] = useState({});
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [formInput, setFormInput] = useState({
        id: null,
        hours: '',
        description: ''
    });
    const token = sessionStorage.getItem('Token');
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [popupProps, setPopupProps] = useState(null);
  
    useEffect(() => {
        GetTimeLogs();
    }, []);
    
    const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      ]);

      const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
        setDatePickerVisible(false);
      };
    function GetTimeLogs(page = 1) {
        debugger
        setIsLoading(true);
        var EmployeeId = null;
        var UserId = null;
        var date = new Date();
        var d = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 3, 0);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (currentRoleId != EmployeeRoleId) {
            if (AssigneeId == 'undefined') {
                if (currentRoleId == SuperAdminRoleId) {
                    EmployeeId = null;
                } else {
                    EmployeeId = currentUserId;
                }
            } else {
                debugger
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
                console.log('logs',data.results);
                setTimeLogsData(data.results);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const CreateTimeLog = () => {
        setIsLoading(true);
        var ProjectTimeLogDTO = {
            ProjectId: projectId,
            Hours: formInput.hours || 0,
            Text: formInput.description || ''
        };
        const url = new URL(apiUrl + '/ProjectTimeLogs/AddProjectTimeLogsbyProjectId');
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ProjectTimeLogDTO)
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);
                setAlert({ type: 'success', msg: data });
                window.location.reload();
            })
            .catch((error) => {
                setAlert({ type: 'danger', msg: "TimeLog Creating Failed!" });
            });
    }

    const updateFormInput = (newInput) => {
        setFormInput((prevInput) => ({
            ...prevInput,
            ...newInput
        }));
    };
    const EditTimeLogs = (obj) => {
        debugger
        setUpdateButton(true);
        updateFormInput({
            id: obj?.timeLogsId,
            hours: obj?.hours,
            description: obj.timeLogText
        })
    }

    const updateTimeLogs = () => {
        setIsLoading(true);
        let UpdateTimeLogsDTO = {
            Id: formInput.id,
            Hours: formInput.hours,
            Text: formInput.description
        }

        const url = new URL(apiUrl + '/ProjectTimeLogs/UpdateTimeLogbyId');
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UpdateTimeLogsDTO)
        })
            .then((response) => response.json())
            .then((data) => {
                setUpdateButton(false);
                if (data.statusCode == 200) {
                    setAlert({ type: 'success', msg: "TimeLog Updated Successfully!" });
                }
                window.location.reload();
                setIsLoading(true);
            })
            .catch((error) => {
                setAlert({ type: 'danger', msg: "TimeLog Updating Failed!" });
            });
    }

    const showDeletTimeLogsModal = (props) => {
        setPopupProps({
            ...props,
            onClick: () => props.onClick(props.customId)
        });
    }

    const showPopUp = (props)=>{
        setPopupProps(props);
    }
    const closePopup = () => {
        setPopupProps(null);
    };

    const DeleteTimeLog = (id) => {
        setIsLoading(true);
        const url = new URL(apiUrl + '/ProjectTimeLogs/DeleteTimeLogsbyId?id=' + id);
        fetch(url, {
            method: 'Delete',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((data) => {
                setUpdateButton(false);
                if (data.statusCode == 200) {
                    setAlert({ type: 'success', msg: "TimeLog Deleted Successfully!" });
                }
                GetTimeLogs();
                setIsLoading(false);
                closePopup();

            })
            .catch((error) => {
                setAlert({ type: 'danger', msg: "TimeLog Deleting Failed!" });
            });
    }

    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const showButtons = selectedRows.length > 0;

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

    const approveTimeLog = ()=>{
        const selectedLogs = selectedRows.map(index => TimeLogsData[index].timeLogsId);
        setTimeLogsStatus(selectedLogs,true,null);

    }

    const rejectTimeLog = (popReturn)=>{
        const selectedLogs = selectedRows.map(index => TimeLogsData[index].timeLogsId);
        setTimeLogsStatus(selectedLogs,false,popReturn.Comment||'');
    }

    const setTimeLogsStatus = (selectedIds,status,text=null)=>{
        if(selectedIds.length == 0){
            return false;
        }
        setIsLoading(true);
        let TimeLogsCommentDTO =[];
        for(var s of selectedIds){
            TimeLogsCommentDTO.push({Id:s,Status:status,Text:text})
        }
    
        const url = new URL(apiUrl + '/ProjectTimeLogs/UpdateTimeLogsStatus');
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TimeLogsCommentDTO)
        }).then((response) => response.json())
            .then((data) => {
                setAlert({ type: 'success', msg: data });
                GetTimeLogs();
                setIsLoading(false);
                closePopup();
            })
            .catch((error) => {
                setAlert({ type: 'danger', msg: error.message});
            });
    }
    const handleInputChange = (e) => {
        // Handle input change if needed
      };
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
            {isLoading && <LoadingSpinner />}
            {currentRoleId == SuperAdminRoleId &&
                <div className="container">
                    <h1 className="mt-4 mb-2">Project TimeLogs</h1>
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
                                            <input
                                                    type="text"
                                                    id="datePickerInput"
                                                    placeholder="Select Date Range"
                                                    className="form-control"
                                                    value={`${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`}
                                                    onChange={handleInputChange} 
                                                    onClick={() => setDatePickerVisible(true)}
                                                />
                                                {datePickerVisible && (
                                                    <div className="mt-4 ml-4">
                                                    <DateRangePicker ranges={dateRange} onChange={handleSelect} />
                                                    </div>
                                                )}
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

                                                {TimeLogsData && TimeLogsData.map((Log, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">{Log.sendOn}</td>
                                                        <td className="text-center">
                                                            {Log.isApproved == 1 && <a className="text-center" title="Approved"><i className="fa fa-check" style={{ fontsize: '30px', color: 'green' }}></i></a>}
                                                            {Log.isRejected == 1 && <a href="#" title="Rejected"
                                                                onClick={() => showDeletTimeLogsModal({
                                                                     inputs: [],
                                                                     customId: Log.timeLogsId,
                                                                     message: Log.rejectedComment,
                                                                     show: true,
                                                                     title: 'Rejected Comment',
                                                                     buttontitle: 'Cancel',
                                                                     onClick: closePopup,
                                                                })}><i className="fa fa-warning" style={{ fontsize: '20px', color: 'red' }}></i></a>}
                                                            {Log.isApproved == 0 && Log.isRejected == 0 && <a href="#" title="NotApproved/NotRejected"></a>}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {!TimeLogsData &&
                                                    <tr>
                                                        <td colSpan={6}>No Data Found</td>
                                                    </tr>}
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
            }

            {currentRoleId == ClientRoleId &&
                <div className="container">
                    <h1 className="mt-4">Project TimeLogs</h1>
                    <div className="row mt-4 mb-4">
                        {showButtons && (
                            <div>
                                <CustomButton className="btn btn-warning float-end ms-2" label="Reject" 
                                icon={<span className="me-2"><i className="fa fa-close"></i></span>}
                                onClick={() => showPopUp({
                                    inputs: [
                                        { name:'Comment', InputTitle: 'Comment',classField:'form-control mb-2', type: 'textarea'},
                                    ],
                                    show: true,
                                    title: 'Reject Comment',
                                    buttontitle: 'Save',
                                    onClick: rejectTimeLog,
                                })}
                                ></CustomButton>
                                <CustomButton className="btn  btn-success float-end" label="Approve" onClick={() => approveTimeLog()} icon={<span className="me-2"><i className="fa fa-check"></i></span>}></CustomButton>
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
                                                            <td className="text-center">
                                                                    {Log.isApproved == 0 && Log.isRejected == 0 && <a title="NotApproved/NotRejected"></a>}    
                                                                    {Log.isRejected == 1 && <a className="text-center" title="Approved"><i className="fa fa-warning" style={{ fontsize: '30px', color: 'red' }}></i></a>}
                                                                    {Log.isApproved == 1 && <a className="text-center" title="Rejected"><i className="fa fa-check" style={{ fontsize: '30px', color: 'green' }}></i></a>}
                                                            </td>
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
            }

            {currentRoleId == EmployeeRoleId &&
                <div className="container">
                    <h1 className="mt-4">Project TimeLogs</h1>
                    <div className="row bg-light pb-3 pt-2 rounded-3">
                        <div className="col-lg-2 col-md-6 col-sm-12">
                            <label>Hours</label>
                            <CustomFields classField="form-control" type="number" value={formInput.hours}
                                onChange={(e) => updateFormInput({ hours: e.target.value })}
                            />
                        </div>
                        <div className="col-lg-8 col-md-6 col-sm-12">
                            <label>Log Text</label>
                            <CustomFields classField="form-control" type="text" value={formInput.description}
                                onChange={(e) => updateFormInput({ description: e.target.value })}
                            />
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                            {!toUpdate && <CustomButton className="btn btn-success w-100 mt-3" label="ADD" onClick={() => CreateTimeLog()} icon={<span className="me-3"><i className="fas fa-forward"></i></span>}></CustomButton>}
                            {toUpdate && <CustomButton className="btn btn-success w-100 mt-3" label="Update" onClick={() => updateTimeLogs()} icon={<span className="me-3"><i className="fas fa-forward"></i></span>}></CustomButton>}
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
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {TimeLogsData && TimeLogsData.map((Log, index) => (
                                                    <tr key={index} className={Log.isRejected == 1 ? 'bg-light text-muted text-decoration-line-through': ''}>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">
                                                            {new Date(Log.sendOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="text-center">
                                                            {Log.isApproved == 1 && <a href="#" title="Approved"><i className="fa fa-check" style={{ fontsize: '20px', color: 'green' }}></i></a>}
                                                            {Log.isApproved == 0 && Log.isRejected == 0 && <a href="#" title="NotApproved/NotRejected"><i className="fa fa-square" style={{ fontsize: '20px', color: 'transparent' }}></i></a>}
                                                            {Log.isRejected == 1 && <a href="#" title="Rejected"
                                                                onClick={() => showDeletTimeLogsModal({
                                                                     inputs: [],
                                                                     customId: Log.timeLogsId,
                                                                     message: Log.rejectedComment,
                                                                     show: true,
                                                                     title: 'Rejected Comment',
                                                                     buttontitle: 'Cancel',
                                                                     onClick: closePopup,
                                                                })}><i className="fa fa-warning" style={{ fontsize: '20px', color: 'red' }}></i></a>}
                                                        </td>
                                                        <td className="text-center">
                                                            <a href="#" onClick={() => EditTimeLogs(Log)} className="btn-sm btn-outline-warning me-2"><span><i className="fa fa-solid fa-pencil" style={{ fontsize: '20px' }}></i></span></a>
                                                            <a href="#" className="btn-sm btn-outline-danger"
                                                                onClick={() => showDeletTimeLogsModal({
                                                                    inputs: [],
                                                                    customId: Log.timeLogsId,
                                                                    message: "Do you want to delete this?",
                                                                    show: true,
                                                                    title: 'Confirmation',
                                                                    buttontitle: 'Delete',
                                                                    onClick: DeleteTimeLog,
                                                                })}><span><i className="fa fa-solid fa-trash" style={{ fontsize: '20px' }}></i></span></a>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {!TimeLogsData && <tr><td colSpan={6}>No Data Found</td></tr>}
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
            }
        </>
    )
}
export default ProjectTimeLogs;