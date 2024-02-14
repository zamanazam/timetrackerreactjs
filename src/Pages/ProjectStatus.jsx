import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner";
import commonServices from "../Services/CommonServices";
import { json, useParams,useNavigate } from "react-router-dom";
import { SuperAdminRoleId, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import CustomFields from "../Components/CustomFields";

function ProjectStatus(){
    const [AllProjects, SetProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { status } = useParams();
    const [pagination, setPagination] = useState({
        Page: 1,
        PageSize: 10,
        Total: 10,
        TotalPages: 1
    });

    useEffect(()=>{
        GetProjects();
    },[pagination?.Page,pagination?.PageSize]);

    const GetProjects= async ()=>{
        var searchProjectsObj = {
            'Page':pagination?.Page || 1,
            'PageSize':pagination?.PageSize || 10,
            'Id' : status
        }
        setIsLoading(true);
        let data = await commonServices.HttpPost(searchProjectsObj,'/Project/GetProjectsbyStatus');
        setPagination({
            Page: data?.page,
            PageSize: data?.pageSize,
            Total: data?.total,
            TotalPages: data?.totalPages
        })
        console.log('res',data);
        setIsLoading(false);
        SetProjects(data?.results);
    }

    const projectDetail = (id) => {
        navigate('/ProjectDetails/' + id);
    }
     return (
        <>
        <div className="container">
            {isLoading && <LoadingSpinner />}
            <h1 className="mt-4 mb-4">Project Status Wise</h1>
            <div className="card p-3">
                    <div className="row mb-4">
                        <div className="card-body">
                            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                <div className="datatable-top">
                                    <div className="datatable-dropdown">
                                        <label>
                                            <CustomFields type="select" classField="datatable-selector"
                                                value={pagination.PageSize} onChange={(e) => setPagination({ ...pagination, PageSize: e.target.value, Page: 1 })} optionsArray={paginationArray}></CustomFields>
                                        </label>
                                    </div>
                                </div>
                                <div className="datatable-container">
                                    <table id="datatablesSimple" className="datatable-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Sr</th>
                                                <th className="text-center">Name</th>
                                                <th className="text-center">Company</th>
                                                <th className="text-center">Company Email</th>
                                                <th className="text-center">Employee</th>
                                                <th className="text-center">TimeLogs</th>
                                                <th className="text-center">Hours</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {AllProjects.length > 0 && AllProjects.map((project, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {getStartPointOfPagination(pagination.PageSize, pagination.Page) + index}
                                                    </td>
                                                    <td className="text-center">{project.projectName}</td>
                                                    <td className="text-center">{project.companyName}</td>
                                                    <td className="text-center">{project.companyEmail}</td>
                                                    <td className="text-center ShowEmployees">{project.employeeName.length}
                                                        <div className="ToShowEmployeeName position-absolute toast-header">
                                                            {project.employeeName.map((emp, empIndex) => (
                                                                <div key={empIndex}>
                                                                    <p>{emp}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-center ShowLogs">{project.totalTimeLogs}
                                                        <div className="ToShowLogs position-absolute toast-header">
                                                            {project.timeLogDetails.map((log,logIndex)=>(
                                                                    <div className="d-flex" key={logIndex}>
                                                                        <p>{log.employee}</p>
                                                                        <p className="ms-5">{log.timeLog}</p>
                                                                    </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-center ShowHours">{project.totalHours}
                                                        <div className="ToShowHours position-absolute toast-header">
                                                            {project.timeLogDetails.length > 0 && project.timeLogDetails.map((hour,hourIndex)=>(
                                                                <div className="d-flex" key={hourIndex}>
                                                                    <p>{hour.employee}</p>
                                                                    <p className="ms-5">{hour.hours}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <a href="#" className="btn-outline-warning bg-transparent" onClick={() => projectDetail(project.projectId)}>
                                                            <i className="fa fa-pencil" style={{ fontsize: '24px', color: 'orange' }}></i></a>
                                                    </td>
                                                </tr>
                                            ))}
                                            {AllProjects.length == 0 &&
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
export default ProjectStatus;