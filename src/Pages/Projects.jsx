import React, { useEffect, useState } from "react";
import {EmployeeRoleId, ClientRoleId, LeadRoleId } from "../GlobalFile";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import commonServices from "../Services/CommonServices";

function Projects() {
    const [AllProjects, SetProjects] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const currentUserId = sessionStorage.getItem('UserId');
    const currentRoleId = sessionStorage.getItem('RoleId');

    useEffect(() => {
        if (AllProjects === null) {
            GetAllProjects();
        }
    }, [AllProjects]);

    const GetAllProjects = async (page = 1) => {
        setIsLoading(true);
        var requestedUrl = "";
        var searchProjectsObj = {
            'Page': page,
            'PageSize': 100,
            'Id': currentUserId
        };

        requestedUrl = "";

        if (currentRoleId === LeadRoleId) {
            requestedUrl = "/Project/GetLeadAllProjects";
        }
        if (currentRoleId === EmployeeRoleId) {
            requestedUrl = "/Project/GetEmployeeProjects";
        }
        if (currentRoleId === ClientRoleId) {
            requestedUrl = "/Project/GetClientProjects";
        }
        var data = await commonServices.HttpPost(searchProjectsObj,requestedUrl);
        console.log('projects',data);
        setIsLoading(false);
        SetProjects(data.results);
    }

    const projectDetail = (id) => {
        navigate('/ProjectDetails/' + id);
    }

    const projectTimeLogs = (projectId, assigneeId) => {
        navigate('/ProjectTimeLogs/' + projectId + '/' + assigneeId);
    }
    return (
        <div className="container">
        {isLoading && <LoadingSpinner />}
            <h1 className="mt-4 mb-4">Projects</h1>
            {AllProjects !== null &&
            <>

                        {currentRoleId === LeadRoleId &&
                            <section>
                                <div className="row mb-4">
                                    <div className="mb-4">
                                        Assigned To Me:
                                    </div>
                                    {AllProjects.filter(project => project.assigneeId == currentUserId).map((project, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="d-flex">
                                                        <p>Project</p>
                                                        <p className="ms-auto">{project.projectName}</p>
                                                    </div>

                                                    <div className="d-flex">
                                                        <p>Company</p>
                                                        <p className="ms-auto">{project.companyName}</p>
                                                    </div>
                                                </div>
                                                <div className="card-body bg-gradient">
                                                    <div className="d-flex">
                                                        <p className="ms-3 mt-1">Hours :</p>
                                                        <p className="ms-auto me-5">{project.totalHours}</p>
                                                    </div>
                                                    <div className="d-flex mt-3">
                                                        <p className="ms-3 mt-1">Logs :</p>
                                                        <p className="ms-auto me-5">{project.totalTimeLogs}</p>
                                                    </div>
                                                </div>
                                                <div className="card-footer d-lg-inline-flex">
                                                    <a className="float-start" title="Edit" target="_self" href="#" onClick={() => projectDetail(project.projectId)}><span><i className="fa fa-solid fa-pencil" style={{ fontsize: '24px', color: 'darkgoldenrod' }}></i></span></a>
                                                    <p className="text-center ms-auto">{new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                                                    <a className="float-end ms-auto" href="#" title="TimeLogs" onClick={() => projectTimeLogs(project.projectId)}><span><i className="fa fa-solid fa-list" style={{ fontsize: '24px' }}></i></span></a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="row mb-4">
                                    <div className="mb-4">
                                        Assigned To Others:
                                    </div>
                                    {AllProjects.filter(project => project.assigneeId !== currentUserId && project.totalTimeLogs !== 0).map((project, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                                            <div className="card" onClick={() => projectTimeLogs(project.projectId, project.assigneeId)}>
                                                <div className="card-header">
                                                    <div className="d-flex">
                                                        <p>Project</p>
                                                        <p className="ms-auto">{project.projectName}</p>
                                                    </div>
                                                    <div className="d-flex">
                                                        <p>Company</p>
                                                        <p className="ms-auto">{project.companyName}</p>
                                                    </div>
                                                    <div className="d-flex">
                                                        <p>Employee</p>
                                                        <p className="ms-auto">{project.employeeName}</p>
                                                    </div>
                                                </div>
                                                <div className="card-body bg-gradient">
                                                    <div className="d-flex ">
                                                        <p className="ms-3 mt-1">Hours :</p>
                                                        <p className="ms-auto me-5">{project.totalHours}</p>
                                                    </div>
                                                    <div className="d-flex mt-3">
                                                        <p className="ms-3 mt-1">Logs :</p>
                                                        <p className="ms-auto me-5">{project.totalTimeLogs}</p>
                                                    </div>
                                                </div>
                                                <div className="card-footer text-center">
                                                    {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        }

                        {currentRoleId === EmployeeRoleId && 
                            <section>
                                <div className="row mb-4">
                                    {AllProjects.map((project, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                                            <div className="card" onClick={() => projectTimeLogs(project.projectId, project.assigneeId)}>
                                                <div className="card-header">
                                                    <div className="d-flex">
                                                        <p>Project</p>
                                                        <p className="ms-auto">{project.projectName}</p>
                                                    </div>
                                                    <div className="d-flex">
                                                        <p>Company</p>
                                                        <p className="ms-auto">{project.companyName}</p>
                                                    </div>
                                                </div>
                                                <div className="card-body bg-gradient">
                                                    <div className="d-flex">
                                                        <p className="ms-3 mt-1">Hours :</p>
                                                        <p className="ms-auto me-5">{project.totalHours}</p>
                                                    </div>
                                                    <div className="d-flex mt-3">
                                                        <p className="ms-3 mt-1">Logs :</p>
                                                        <p className="ms-auto me-5">{project.totalTimeLogs}</p>
                                                    </div>
                                                </div>
                                                <div className="card-footer text-center">
                                                    {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        }

                        {currentRoleId === ClientRoleId && 
                            <section>
                                <div className="row mb-4">
                                {AllProjects.filter(project => project.clientProjectTimes.some(timelogs => timelogs.totalHours !== 0)).map((project, key) => (
                                // {AllProjects.filter(project => project.clientProjectTimes.length > 0).map((project, key) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={key}>
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <div className="d-flex">
                                                        <p>Project</p>
                                                        <p className="ms-auto">{project.projectName}</p>
                                                    </div>
                                                </div>
                                                <div className="card-body bg-gradient">
                                                    {/* {project.clientProjectTimes.length > 0 && */}
                                                        <div>
                                                            <div className="row">
                                                                <p className="col text-center">Employee</p>
                                                                <p className="col text-center">Logs</p>
                                                                <p className="col text-center">Hours</p>
                                                            </div>

                                                            {project.clientProjectTimes.map((timelogs, innerKey) => (
                                                                <div key={innerKey}>
                                                                    {timelogs.totalTimeLogs != 0 &&
                                                                        <div className="row mt-2">
                                                                            <div className="col text-center">
                                                                            {/* <a href={`/ProjectTimeLogs/{project.projectId}/{timelogs.assigneeId}`} className="text-decoration-none text-body" onClick={() => projectTimeLogs(project.projectId, timelogs.assigneeId)}>{timelogs.employeeName}</a> */}
                                                                            <a href={`/ProjectTimeLogs/${project.projectId}/${timelogs.assigneeId}`} className="text-decoration-none text-body">
                                                                                {timelogs.employeeName}
                                                                            </a>
                                                                            </div>
                                                                            <div className="col text-center">
                                                                                <p className="ms-auto">{timelogs.totalTimeLogs}</p>
                                                                            </div>
                                                                            <div className="col text-center">
                                                                                <p className="ms-auto">{timelogs.totalHours}</p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                    {/* } */}
                                                </div>
                                                <div className="card-footer text-center">
                                                    {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        }
            </> 

            }

        </div>
    );
}
export default Projects;