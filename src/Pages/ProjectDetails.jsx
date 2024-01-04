import React, { useEffect, useState } from "react";
import { apiUrl } from "../GlobalFile";
import { useParams } from "react-router-dom";
import CustomButton from "../Components/CustomButton";
import CustomFields from "../Components/CustomFields";
import Alert from "../Components/Alert";
import LoadingSpinner from "../Components/LoadingSpinner";
import PopUps from "../Components/PopUps";
function ProjectDetails() {
    const [popupProps, setPopupProps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [ProjectData, setProjectData] = useState(null);
    const { id } = useParams();
    const [formInput, updateFormInput] = useState({});

    const openPopup = (props) => {
        setPopupProps(props);
    };

    const closePopup = () => {
        setPopupProps(null);
    };

    useEffect(() => {
        GetProjectDetails();
    }, []);
    let controller = new AbortController();
    let signal = controller.signal;

    const headers = new Headers();
    const token = sessionStorage.getItem('Token');
    headers.append('Authorization', 'Bearer ' + token);
    headers.append('Content-Type', 'application/json');

    function GetProjectDetails() {
        setIsLoading(true);
        const url = new URL(apiUrl + '/Project/GetProjectDetailsbyId');
        url.searchParams.append('id', id);
        const options = {
            method: 'GET',
            headers: headers,
        };

        fetch(url, options)
            .then((response) => response.json())
            .then((data) => {
                console.log('Companies', data);
                setProjectData(data);
                updateFormInput({
                    name: data?.name,
                    description: data?.description,
                    isActive: data?.isActive
                })
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setAlert({ type: 'Error', msg: error.message });
            });
    }
    let statusArray = [{ id: true, name: "Active" }, { id: false, name: "Block" }]

    const handleProjectStatus = (e) => {
        updateFormInput({ ...formInput, isActive: !formInput.isActive })
    }
    const updateProject = async () => {
        setIsLoading(true);
        const url = new URL(apiUrl + '/Project/UpdateProjectbyIdandAsignee');
        let updateProjectDTO = {
            Name: formInput.name,
            Description: formInput.description,
            isActive: formInput.isActive,
            id: id,
            EmployeesProjects:ProjectData?.employeesProjects
        }
        const options = {
            method: 'POST',
            headers: headers,
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateProjectDTO),
        }).then((response) => response.json())
            .then(response => {
                setIsLoading(false);
                if (response.statusCode == 200) {
                    GetProjectDetails();
                    setAlert({ type: 'success', msg: "Project Updated Successfully!" });
                }else{
                    setAlert({ type: 'danger', msg: "Error Updating Project!" });
                }
            }).catch(error => {
                setIsLoading(false);
                setAlert({ type: 'danger', msg: error.message });
            })

    }
    const assignPoject = () => {
        debugger
    }

    return (
        <>
            {alert && <Alert type={alert.type} message={alert.msg} />}

            <div className="container">
                {popupProps && (
                    <PopUps
                        show={popupProps.show}
                        title={popupProps.title}
                        message={popupProps.message}
                        firstInputTitle={popupProps.firstInputTitle}
                        secondInputTitle={popupProps.secondInputTitle}
                        buttontitle={popupProps.buttontitle}
                        onClose={closePopup}
                        onClick={popupProps.onClick} type="multiselect"/>)}
                {isLoading && <LoadingSpinner />}

                        <h1 className="mt-4">Project Detail Page</h1>
                        <div className="row mt-4">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-floating mb-3">
                                    <CustomFields classField="form-control" type="text" placeholder="Project Name" value={formInput.name} onChange={e => updateFormInput({ ...formInput, name: e.target.value })}></CustomFields>
                                    <label htmlFor="inputFirstName">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <CustomFields classField="form-select" type="select" placeholder="Project Status" value={formInput.isActive} onChange={handleProjectStatus} optionsArray={statusArray}></CustomFields>
                                    <label className="inputFirstName">Status</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input className="border form-control w-100" defaultValue={new Date(ProjectData?.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} readOnly />
                                    <label className="formInput">Created On</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-floating mb-3">
                                    <input className="border form-control w-100" defaultValue={ProjectData?.company.name} readOnly />
                                    <label htmlFor="inputCompanyName">Company Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input className="border form-control w-100" defaultValue={ProjectData?.company.email} readOnly />
                                    <label htmlFor="inputFirstName">Company Email</label>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="form-floating mb-3">
                                <CustomFields classField="form-control mt-2" type="textarea" placeholder="Description" value={formInput.description} onChange={e => updateFormInput({ ...formInput, description: e.target.value })}></CustomFields>
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
                                                {ProjectData?.employeesProjects.length > 0 ?
                                                    ProjectData?.employeesProjects.map((employee, i) => (
                                                        <tr key={i}>
                                                            <td className="text-center">{i + 1}</td>
                                                            <td className="text-center" >{employee.projectAssignedToUser.name}</td>
                                                            <td className="text-center">

                                                                {employee.isActive == true ?
                                                                    <form action="/action_page.php">
                                                                        <input type="radio" />
                                                                        <label>Active</label>
                                                                        <input type="radio" />
                                                                        <label>Disable</label>
                                                                    </form>
                                                                    :
                                                                    <form action="/action_page.php">
                                                                        <input type="radio" />
                                                                        <label>Active</label>
                                                                        <input type="radio" />
                                                                        <label>Disable</label>
                                                                    </form>
                                                                }

                                                            </td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td colSpan={3} align="center">
                                                            No data Found
                                                        </td>
                                                    </tr>
                                                }
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
                                <CustomButton className="btn btn-warning float-end mt-3" onClick={(e) => assignPoject(e)} label="Asssign" icon={<span className="me-2"><i className="fa fa-plus" style={{ fontsize: '20px' }}></i></span>}></CustomButton>
                            </div>
                        </div>
                    </div>
        </>
    )
}
export default ProjectDetails;