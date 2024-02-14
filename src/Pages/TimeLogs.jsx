import React, { useEffect, useState } from "react";
import { apiUrl, SuperAdminRoleId, AdminRoleId, EmployeeRoleId, ClientRoleId, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import { useParams } from "react-router-dom";
import CustomButton from "../Components/CustomButton";
import CustomFields from "../Components/CustomFields";
import Alert from "../Components/Alert";
import LoadingSpinner from "../Components/LoadingSpinner";
import PopUps from "../Components/PopUps";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import commonServices from "../Services/CommonServices";

const ProjectTimeLogs = () => {
    const [TimeLogsData, setTimeLogsData] = useState([]);
    const { projectId, AssigneeId } = useParams();
    const [toUpdate, setUpdateButton] = useState(false);
    const currentRoleId = sessionStorage.getItem('RoleId');
    const currentUserId = sessionStorage.getItem('UserId');
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [formInput, setFormInput] = useState({
        id: null,
        hours: '',
        description: '',
        //startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        //endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        employeeName: ''
    });
    const token = sessionStorage.getItem('Token');
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [popupProps, setPopupProps] = useState(null);
    const [projectAssigneeId, setProjectAssigneeId] = useState(0);
    const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date() });
    const [selectedRange, setSelectedRange] = useState('startDate');
    const [pagination, setPagination] = useState({
        Page: 1,
        PageSize: 10,
        Total: 10,
        TotalPages: 1
    });
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    let showButtons = selectedRows.length > 0;
    const handleDateRange = async (ranges) => {
          setDateRange(prevDateRange=>({...prevDateRange, startDate: ranges.startDate,endDate: ranges.endDate }));
    };

    const upDateDateRange = ()=>{
        if (dateRange?.startDate && dateRange?.endDate) {
            setDatePickerVisible(false);
            GetTimeLogs();
        }
    }

    const GetTimeLogs = async () => {
        setIsLoading(true);
        var EmployeeId = null;
        var UserId = null;
        var firstDate = dateRange?.startDate;
        var lastDate = dateRange?.endDate;
        console.log('first',firstDate);
        console.log('first',lastDate);
        EmployeeId = AssigneeId;
        setProjectAssigneeId(AssigneeId);
        if (currentRoleId == AdminRoleId && AssigneeId == 'undefined') {
            EmployeeId = currentUserId;
            setProjectAssigneeId(currentUserId);
        }

        if (currentRoleId == EmployeeRoleId) {
            UserId = currentUserId;
            setProjectAssigneeId(currentUserId);
        }

        if (EmployeeId == 'undefined')
            EmployeeId = null;

        // if (formInput?.employeeName == '')
        //     EmployeeId = null;

        var TimeLogsuserProjectDTo = {
            'DateFrom': firstDate,
            'DateTo': lastDate,
            'EmployeeId': EmployeeId,
            'Page': parseInt(pagination.Page, 10),
            'PageSize': parseInt(pagination.PageSize, 10),
            'ProjectId': projectId,
            'UserId': UserId,
            'CRoleId': currentRoleId,
            'EmployeeName': formInput?.employeeName
        }
        try{
            var data = await  commonServices.HttpPost(TimeLogsuserProjectDTo,'/ProjectTimeLogs/GetTimeLogbyConditions');
            setPagination({
                Page: data?.page,
                PageSize: data?.pageSize,
                Total: data?.total,
                TotalPages: data?.totalPages
            });
            setSelectedRows([]);
            setTimeLogsData(data.results);
        }catch(error){
            setAlert({ type: 'danger', msg: error.message });
        }
        setIsLoading(false);
    };


    useEffect(() => {
        GetTimeLogs();
    }, [formInput?.employeeName, pagination.Page, pagination.PageSize]);

    const CreateTimeLog = async () => {
        setIsLoading(true);
        var ProjectTimeLogDTO = {
            ProjectId: projectId,
            Hours: formInput.hours || 0,
            Text: formInput.description || '',
            EmployeeId: currentUserId
        };
        try
        {
            var data = await commonServices.HttpPost(ProjectTimeLogDTO,'/ProjectTimeLogs/AddProjectTimeLogsbyProjectId');
            setIsLoading(false);
            setAlert({ type: 'success', msg: data });
            GetTimeLogs();
        }catch(error){
            setAlert({ type: 'danger', msg: "TimeLog Creating Failed!" });
        }
    };

    const updateFormInput = (newInput) => {
        setFormInput((prevInput) => ({
            ...prevInput,
            ...newInput
        }));
    };
    const EditTimeLogs = (obj) => {
        setUpdateButton(true);
        updateFormInput({
            id: obj?.timeLogsId,
            hours: obj?.hours,
            description: obj.timeLogText
        })
    };

    const updateTimeLogs = async () => {
        setIsLoading(true);
        let UpdateTimeLogsDTO = {
            Id: formInput.id,
            Hours: formInput.hours,
            Text: formInput.description
        }

        // const url = new URL(apiUrl + '/ProjectTimeLogs/UpdateTimeLogbyId');
        // fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer ' + token,
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(UpdateTimeLogsDTO)
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setUpdateButton(false);
        //         if (data.statusCode == 200) {
        //             setAlert({ type: 'success', msg: "TimeLog Updated Successfully!" });
        //         }
        //         window.location.reload();
        //         setIsLoading(true);
        //     })
        //     .catch((error) => {
        //         setAlert({ type: 'danger', msg: "TimeLog Updating Failed!" });
        //     });

            try{
                var data = await commonServices.HttpPost(UpdateTimeLogsDTO,'/ProjectTimeLogs/UpdateTimeLogbyId');
                setUpdateButton(false);
                if (data.statusCode == 200) {
                    setAlert({ type: 'success', msg: "TimeLog Updated Successfully!" });
                }
                window.location.reload();
                setIsLoading(true);
            }catch(error){
                setAlert({ type: 'danger', msg: "TimeLog Updating Failed!" });
            }
    };

    const showDeletTimeLogsModal = (props) => {
        setPopupProps({
            ...props,
            onClick: () => props.onClick(props.customId)
        });
    };

    const showPopUp = (props) => {
        setPopupProps(props);
    };
    const closePopup = () => {
        setPopupProps(null);
    };

    const DeleteTimeLog = async (id) => {
        setIsLoading(true);
            try{
                    var data = await commonServices.HttpDelete(id,'/ProjectTimeLogs/DeleteTimeLogsbyId');
                    setUpdateButton(false);
                    if (data.statusCode == 200) {
                        setAlert({ type: 'success', msg: "TimeLog Deleted Successfully!" });
                    }
                    GetTimeLogs();
                    setIsLoading(false);
                    closePopup();
            }catch(error){
                    setAlert({ type: 'danger', msg: "TimeLog Deleting Failed!" });
            }
    };

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

    const approveTimeLog = () => {
        const selectedLogs = selectedRows.map(index => TimeLogsData[index].timeLogsId);
        setTimeLogsStatus(selectedLogs, true, null);
    };

    const rejectTimeLog = (popReturn) => {
        const selectedLogs = selectedRows.map(index => TimeLogsData[index].timeLogsId);
        setTimeLogsStatus(selectedLogs, false, popReturn.find(x => x.name === "Comment")?.value || "");
    };

    const setTimeLogsStatus = async (selectedIds, status, text = null) => {
        
        try{
                if (selectedIds.length == 0) {
                    return false;
                }
                setIsLoading(true);
                let TimeLogsCommentDTO = [];
                for (var s of selectedIds) {
                    TimeLogsCommentDTO.push({ Id: s, Status: status, Text: text })
                }
                var data = await commonServices.HttpPost(TimeLogsCommentDTO,'/ProjectTimeLogs/UpdateTimeLogsStatus');
                setAlert({ type: 'success', msg: data });
                GetTimeLogs();
                setIsLoading(false);
                closePopup();
        }catch(error){
                setAlert({ type: 'danger', msg: error.message });
        }
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

            <div className="container">
                <h1 className="mt-4 mb-2">Project TimeLogs</h1>
                {currentUserId == projectAssigneeId&&
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
                }
                    <div className="row mt-4 mb-4">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            {currentRoleId == SuperAdminRoleId &&
                                <CustomFields name="Assignees" InputTitle='Employees' classField='form-control mb-2 w-50' value={formInput?.employeeName} placeholder='Employees' type='text' onChange={(e) => updateFormInput({ ...formInput, employeeName: e.target.value })} ></CustomFields>
                            }
                        </div>
                        {showButtons && currentRoleId == ClientRoleId && (
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <CustomButton className="btn btn-warning float-end ms-2" label="Reject"
                                    icon={<span className="me-2"><i className="fa fa-close"></i></span>}
                                    onClick={() => showPopUp({
                                        inputs: [
                                            { name: 'Comment', InputTitle: 'Comment', classField: 'form-control mb-2', type: 'textarea' },
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
                    </div>

                <div className="row mb-5">
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
                                    <div className="datatable-search position-absolute end-0 me-4" style={{ zIndex: '100' }}>
                                        <input
                                            type="text"
                                            id="datePickerInput"
                                            placeholder="Select Date Range"
                                            className="form-control"
                                            value={`${dateRange?.startDate?.toLocaleDateString('en-US', { day: 'numeric',month: 'short', year: 'numeric' })} - ${dateRange?.endDate?.toLocaleDateString('en-US', { day: 'numeric',month: 'short', year: 'numeric' })}`}
                                            onChange={(e)=>setDatePickerVisible(true)}
                                            onClick={() => setDatePickerVisible(true)}
                                        />
                                        {datePickerVisible && (
                                            <div className="mt-1 bg-body ml-4 pb-3" style={{ position: 'relative' }}>
                                                  <DateRangePicker
                                                    ranges={[dateRange]}
                                                    onChange={(selected) => {
                                                        const { range1 } = selected;
                                                        handleDateRange(range1);
                                                    }}
                                                    />
                                                <button className="rounded-3 me-1 mb-2 btn-primary justify-content-end align-bottom" onClick={(e) => setDatePickerVisible(false)} style={{ position: 'absolute', bottom: 0, left: 245 }}>
                                                    Cancel
                                                </button>
                                                <button className="rounded-3 me-1 mb-2 btn-primary justify-content-end align-bottom" onClick={upDateDateRange} style={{ position: 'absolute', bottom: 0, right: 5 }}>
                                                    Apply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {currentRoleId == SuperAdminRoleId &&
                                    <div className="datatable-container">
                                        <table id="datatablesSimple" className="datatable-table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">Sr</th>
                                                    <th className="text-center">Company</th>
                                                    <th className="text-center">Employee</th>
                                                    <th className="text-center">LogText</th>
                                                    <th className="text-center">Hours</th>
                                                    <th className="text-center">Created On</th>
                                                    <th className="text-center">Approved</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {TimeLogsData.length > 0 && TimeLogsData.map((Log, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">
                                                            {getStartPointOfPagination(pagination.PageSize, pagination.Page) + index}
                                                        </td>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">
                                                            {new Date(Log.sendOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                        </td>
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
                                                {TimeLogsData == 0 &&
                                                    <tr>
                                                        <td colSpan={7} align="center">No Data Found</td>
                                                    </tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {currentRoleId == ClientRoleId &&
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

                                                {TimeLogsData.length > 0 &&
                                                    TimeLogsData.map((Log, index) => (
                                                        <tr key={index}>
                                                            <th><input type="checkbox" className="form-check-input" style={{ height: '15px', width: '15px' }} checked={selectedRows.includes(index)} onChange={() => handleCheckboxChange(index)} /></th>
                                                            <td className="text-center">{Log.company}</td>
                                                            <td className="text-center">{Log.employee}</td>
                                                            <td className="text-center">{Log.timeLogText}</td>
                                                            <td className="text-center">{Log.hours}</td>
                                                            <td className="text-center">
                                                                {new Date(Log.sendOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                            </td>
                                                            <td className="text-center">
                                                                {Log.isApproved == 0 && Log.isRejected == 0 && <a title="NotApproved/NotRejected"></a>}
                                                                {Log.isRejected == 1 && <a className="text-center" title="Rejected"><i className="fa fa-warning" style={{ fontsize: '30px', color: 'red' }}></i></a>}
                                                                {Log.isApproved == 1 && <a className="text-center" title="Approved"><i className="fa fa-check" style={{ fontsize: '30px', color: 'green' }}></i></a>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                {TimeLogsData.length == 0 && <tr><td colSpan={7} align="center">No Data Found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {(currentRoleId == EmployeeRoleId || currentRoleId == AdminRoleId) &&
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
                                                    {currentUserId == projectAssigneeId && <th className="text-center">Action</th>}
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {TimeLogsData.length > 0 && TimeLogsData.map((Log, index) => (
                                                    <tr key={index} className={Log.isRejected == 1 ? 'bg-light text-muted text-decoration-line-through' : ''}>
                                                        <td className="text-center">{Log.company}</td>
                                                        <td className="text-center">{Log.employee}</td>
                                                        <td className="text-center">{Log.timeLogText}</td>
                                                        <td className="text-center">{Log.hours}</td>
                                                        <td className="text-center">
                                                            {new Date(Log.sendOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
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
                                                        {projectAssigneeId == currentUserId &&
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
                                                            </td>}
                                                    </tr>
                                                ))}
                                                {TimeLogsData.length == 0 && <tr><td colSpan={currentUserId == projectAssigneeId ? 7 : 6} align="center">No Data Found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                }
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
export default ProjectTimeLogs;