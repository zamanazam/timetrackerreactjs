import React, { useEffect, useState } from "react";
import { apiUrl, statusArray } from "../GlobalFile";
import { json, useParams } from "react-router-dom";
import CustomButton from "../Components/CustomButton";
import CustomFields from "../Components/CustomFields";
import Alert from "../Components/Alert";
import LoadingSpinner from "../Components/LoadingSpinner";
import PopUps from "../Components/PopUps";
import projectServices from "../Services/ProjectServices";
import commonServices from "../Services/CommonServices";
function ProjectDetails() {
    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [ProjectData, setProjectData] = useState(null);
    const { id } = useParams();
    const [formInput, updateFormInput] = useState({});
    const [optionsArray, setEmployeesArray] = useState([]);
    const [assigneeIds, setAssingee] = useState([]);


    useEffect(() => {
        GetProjectDetails();
        GetAllEmployees();

    }, []);

    const GetAllEmployees = async () => {
        let response = await commonServices.HttpGet(null,'/Admin/GetAllAssignes');
        setEmployeesArray(response);
    }

    const GetProjectDetails = async () => {
        setIsLoading(true);
        try{
            var data = await commonServices.HttpGetbyId(id,'/Project/GetProjectDetailsbyId');
            setProjectData(data);
            updateFormInput({
                name: data?.name,
                description: data?.description,
                isActive: data?.isActive,
                employeesProjects: data?.employeesProjects,
                Assignees: [],
            })
        }catch(error){
            setAlert({type: 'danger', msg: "Operation Failed!" });
        }
        setIsLoading(false);
    }

    const handleProjectStatus = (e) => {
        updateFormInput({ ...formInput, isActive: !formInput.isActive })
    }

    const handelProjectAssignments = (assignee,e)=>{
        const employeeProjectStatus = e;
            const updatedEmployeesProjects = ProjectData.employeesProjects.map(employee => {
                if (employee.assignedTo === assignee) {
                    return { ...employee, employeeProjectStatus };
                }
                return employee;
            });
            
            setProjectData(prevInput => ({
                ...prevInput,
                employeesProjects: updatedEmployeesProjects
            }));

    }
    const updateProject = async () => {
        setIsLoading(true);
        let updateProjectDTO = {
            Name: formInput.name,
            Description: formInput.description,
            isActive: formInput.isActive,
            id: id,
            EmployeesProjects: ProjectData?.employeesProjects
        }
        
        try{
                var response = await commonServices.HttpPost(updateProjectDTO,'/Project/UpdateProjectbyIdandAsignee');
                if (response.statusCode == 200) {
                    GetProjectDetails();
                    setAlert({ type: 'success', msg: "Project Updated Successfully!" });
                } else {
                    setAlert({ type: 'danger', msg: "Error Updating Project!" });
                }

            }catch(error){
                setAlert({ type: 'danger', msg: error.message });
            }
            setIsLoading(false);
    }
    const assignPoject = async (selectedValues) => {
        setIsLoading(true);
        try{
                let toAssignEmployees = selectedValues.filter(({ name }) => name === "Assignees").map(({ value }) => (Array.isArray(value) ? value.map(assignee => assignee.id) : value));
                let inWard = selectedValues.filter(({ name }) => name === "InWard").map(({ value }) => value);
                let outWard = selectedValues.filter(({ name }) => name === "OutWard").map(({ value }) => value);
                    let AssignProjectDTO = {
                        ProjectId:id,
                        InWardRate:inWard[0],
                        OutWardRate:outWard[0],
                        EmployeeId:toAssignEmployees[0]
                    }
                
                let data = await commonServices.HttpPost(AssignProjectDTO,'/Project/AssingProjectbyId');
                if(data.statusCode ==200){
                    setAlert({ type: 'success', msg: "Project assigned successfully!" });
                }
                else{
                    setAlert({ type: 'danger', msg: "Operation Failed!" });
                }
            }catch(error)
            {
                setIsLoading(false);
                setAlert({ type: 'danger', msg: "Operation Failed!" });
            }
            closePopup();
            setIsLoading(false);
            GetProjectDetails();
    };

    const openPopup = (props) => {
        const assignedIds = ProjectData.employeesProjects.map(
            (employee) => employee.projectAssignedToUser.id
        );

        const filteredOptions = optionsArray.filter(
            (option) => !assignedIds.includes(option.id)
        );

        const assigneesInput = props.inputs.find((input) => input.name === "Assignees");
        if (assigneesInput) {
            assigneesInput.optionsArray = filteredOptions;
        }
        setPopupProps(props);
    };
    
    const closePopup = () => {
        setPopupProps(null);
    };


    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}

            <div className="container">
                {popupProps && (
                    <PopUps inputs={popupProps.inputs || null}
                        show={popupProps.show}
                        title={popupProps.title || null}
                        message={popupProps.message || null}
                        buttontitle={popupProps.buttontitle || null}
                        onClose={closePopup}
                        onClick={popupProps.onClick} />)}

                {isLoading && <LoadingSpinner />}

                <h1 className="mt-4">Project Detail Page</h1>
                <div className="row mt-4">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="form-floating mb-3">
                            <CustomFields name="Name" classField="form-control" type="text" placeholder="Project Name" value={formInput.name} onChange={e => updateFormInput({ ...formInput, name: e.target.value })}></CustomFields>
                            <label htmlFor="inputFirstName">Name</label>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="form-floating mb-3">
                            <CustomFields name="isActive" classField="form-select" type="select" placeholder="Project Status" value={formInput.isActive} onChange={handleProjectStatus} optionsArray={statusArray}></CustomFields>
                            <label className="inputFirstName">Status</label>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div className="form-floating mb-3">
                            <input className="border form-control w-100" defaultValue={ProjectData?.company.name} readOnly />
                            <label htmlFor="inputCompanyName">Company Name</label>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="form-floating mb-3">
                                <input className="border form-control w-100" defaultValue={ProjectData?.company.email} readOnly />
                                <label htmlFor="inputFirstName">Company Email</label>
                            </div>
                    </div>

                </div>

                <div className="row mt-3">
                    <div className="form-floating mb-3">
                        <CustomFields name="Description" classField="form-control mt-2" type="textarea" placeholder="Description" value={formInput.description} onChange={e => updateFormInput({ ...formInput, description: e.target.value })}></CustomFields>
                        <label >Description</label>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <label className="fw-bold mb-3">Assigned Employees:</label>
                        <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns ">
                            <div className="datatable-container " id="table-container">
                                <table id="data-table" className="datatable-table">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Sr.</th>
                                            <th className="text-center">Employess</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {ProjectData?.employeesProjects.length > 0 ? (
                                            ProjectData?.employeesProjects.map((employee, i) => (
                                                <tr key={i}>
                                                    <td className="text-center">{i + 1}</td>
                                                    <td className="text-center">{employee.projectAssignedToUser.name}</td>
                                                    <td className="text-center">
                                                        <form action="/action_page.php">
                                                            <CustomFields type="radio" onChange={() => handelProjectAssignments(employee.assignedTo, true)}
                                                                checked={employee.employeeProjectStatus === true} classField="me-2"
                                                            />
                                                            <label className="me-4">Active</label>
                                                            <CustomFields type="radio" onChange={() => handelProjectAssignments(employee.assignedTo, false)}
                                                                checked={employee.employeeProjectStatus === false} classField="me-2"
                                                            />
                                                            <label className="me-4">Disable</label>
                                                        </form>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} align="center">
                                                    No data Found
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12"></div>
                </div>

                <div className="row mt-4 mb-5">
                    <div className="float-end">
                        <CustomButton className="btn btn-success float-end mt-3 ms-lg-1" onClick={(e) => updateProject(e)} label="Update" icon={<span className="me-2"><i className="fas fa-redo" style={{ fontsize: '20px' }}></i></span>}></CustomButton>
                        <CustomButton className="btn btn-warning float-end mt-3"
                            onClick={() => openPopup({
                                inputs: [
                                    { name: 'InWard', InputTitle: 'InWard', classField: 'form-control mb-2', placeholder: 'Inward', type: 'text' },
                                    { name: 'OutWard', InputTitle: 'OutWard', classField: 'form-control mb-2', placeholder: 'OutWard', type: 'text' },
                                    { name: 'Assignees', InputTitle: 'Employees', classField: 'form-select mb-2', placeholder: 'Employees', type: 'multiselect', optionsArray },
                                ],
                                show: true,
                                title: 'Assing Project',
                                buttontitle: 'Save',
                                onClick: assignPoject,
                            })} label="Asssign" icon={<span className="me-2"><i className="fa fa-plus" style={{ fontsize: '20px' }}></i></span>}></CustomButton>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ProjectDetails;