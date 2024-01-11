import React, { useEffect, useState } from "react";
import { apiUrl, AdminRoleId, EmployeeRoleId, ClientRoleId } from "../GlobalFile";
import { useNavigate } from "react-router-dom";

function Projects() {
    const [AllProjects, SetProjects] = useState(null);
    const navigate = useNavigate();
    const currentUserId = sessionStorage.getItem('UserId');
    const currentRoleId = sessionStorage.getItem('RoleId');

    useEffect(() => {
        if (AllProjects === null) {
            GetAllProjects();
        }
    }, [AllProjects]); 

    const GetAllProjects = (page = 1) => {
        debugger
        var requestedUrl = "";
        var searchProjectsObj = {
            'Page': page,
            'PageSize': 100,
            'Id': currentUserId
        };
        
        requestedUrl = "";

        if (currentRoleId === "2") {
            requestedUrl = "/Project/GetLeadAllProjects";
        }
        if (currentRoleId === "3") {
            requestedUrl = "/Project/GetEmployeeProjects";
        }
        if (currentRoleId === "4") {
            requestedUrl = "/Project/GetClientProjects";
        }
        const token = sessionStorage.getItem('Token');
        const url = new URL(apiUrl + requestedUrl);
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchProjectsObj)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('client', data.results);
                SetProjects(data.results);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const projectDetail = (id) => {
        navigate('/ProjectDetails/' + id);
    }

    const projectTimeLogs = (projectId,assigneeId)=>{
        navigate('/ProjectTimeLogs/'+projectId+'/'+assigneeId);
    }
    return (
        <div className="container">
                <h1 className="mt-4">Projects</h1>
            {AllProjects !== null ? (
                // Section For Lead
                <div className="mt-4">
                    {currentRoleId === AdminRoleId ? (
                        <section>
                            <div className="row mb-4">
                                <div className="mb-4">
                                    Assigned To Me:
                                </div>
                                {AllProjects.filter(project => project.assigneeId == currentUserId && project.totalTimeLogs !== 0).map((project, index) => (
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
                                                <a className="float-start" title="Edit" target="_self" href="#" onClick={() => projectDetail(project.projectId)}><span><i className="fa fa-solid fa-pencil" style={{fontsize:'24px', color:'darkgoldenrod'}}></i></span></a>
                                                <p className="text-center ms-auto">{new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                <a className="float-end ms-auto" href="#" title="TimeLogs" onClick={()=> projectTimeLogs(project.projectId)}><span><i className="fa fa-solid fa-list" style={{fontsize:'24px'}}></i></span></a>                                                
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
                                        <div className="card" onClick={() => projectTimeLogs(project.projectId,project.assigneeId)}>
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
                                                {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (null)}

                    <div>
                        {currentRoleId === EmployeeRoleId ? (
                            <section>
                                <div className="row mb-4">
                                    {AllProjects.map((project, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                                            <div className="card" onClick={() => projectTimeLogs(project.projectId,project.assigneeId)}>
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
                                                    {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (null)}
                    </div>

                    <div>
                        {currentRoleId === ClientRoleId ? (
                            <section>
                                <div className="row mb-4">
                                    {AllProjects.map((project, key) => (
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={key}>
                                            <div className="card h-100">
                                                <div className="card-header">
                                                    <div className="d-flex">
                                                        <p>Project</p>
                                                        <p className="ms-auto">{project.projectName}</p>
                                                    </div>
                                                </div>
                                                <div className="card-body bg-gradient">
                                                    {project.clientProjectTimes !== null ?
                                                        <div>
                                                            <div className="d-flex">
                                                                <p>Employee</p>
                                                                <p className="ms-auto">Logs</p>
                                                                <p className="ms-auto">Hours</p>
                                                            </div>

                                                            {project.clientProjectTimes.map((timelogs, key) => (
                                                                <div>
                                                                    {timelogs.totalTimeLogs != 0 ?
                                                                        <div className="row" key={key}>
                                                                            <div className="col text-center">
                                                                                <a href="#" className="text-decoration-none text-body" onClick={() => projectTimeLogs(project.projectId,timelogs.assigneeId)}>{timelogs.employeeName}</a>
                                                                            </div>
                                                                            <div className="col text-center">
                                                                                <p className="ms-auto">{timelogs.totalTimeLogs}</p>
                                                                            </div>
                                                                            <div className="col text-center">
                                                                                <p className="ms-auto">{timelogs.totalHours}</p>
                                                                            </div>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                        : null}
                                                </div>
                                                <div className="card-footer text-center">
                                                    {new Date(project.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (null)}
                    </div>

                </div>

            ) : ('No data Found ')}

        </div>
    );
}
export default Projects;