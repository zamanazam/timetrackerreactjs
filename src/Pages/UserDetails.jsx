import React, { useState, useEffect } from 'react'
import { apiUrl, SuperAdminRoleId, allRoles, LeadRoleId, EmployeeRoleId, ClientRoleId, statusArray, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CustomFields from "../Components/CustomFields";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";
import PopUps from "../Components/PopUps";
import CustomButton from '../Components/CustomButton';
import commonServices from '../Services/CommonServices';
function UserDetails() {
  const [LeadData, setLeadData] = useState(null);
  const [EmployeeData, setEmployeeData] = useState(null);
  const [ClientData, setClientData] = useState(null);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);

  const [popupProps, setPopupProps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formInput, updateFormInput] = useState({});
  const [pagination, setPagination] = useState({
    Page: 1,
    PageSize: 10,
    Total: 10,
    TotalPages: 1
  });


  const { paramUserId, paramRoleId } = useParams();
  const navigate = useNavigate();
  const currentRoleId = sessionStorage.getItem('RoleId');

  const openPopup = (props) => {
    setPopupProps(props);
  };

  const closePopup = () => {
    setPopupProps(null);
  };

const setRole = (e)=>{
  updateFormInput({ ...formInput, roleId: e.target.value,
    userRoles: formInput.userRoles.map((role) =>
      role.id === formInput.id
        ? { ...role, roleId: e.target.value }
        : role
    )
  });
}

  const onLoad = () => {
    setIsLoading(true);
    if (paramRoleId == SuperAdminRoleId) {
      getAdminData();
    }

    if (paramRoleId == EmployeeRoleId || paramRoleId == LeadRoleId) {
      getEmployeeData();
    }

    if (paramRoleId == ClientRoleId) {
      getClientData();
    }
  }

  const getEmployeeData = async () => {
    const data = await commonServices.HttpGetbyId(paramUserId, '/Admin/GetEmployeebyId');
    setEmployeeData(data[0].projectAssignedToUsers);
    updateFormInput({
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      isActive: data[0].isActive,
      roleId: data[0].userRoles[0].roleId,
      userRoles:data[0].userRoles
    });
    setIsLoading(false);
  }

  const getClientData = async () => {
    const data = await commonServices.HttpGetbyId(paramUserId, '/Admin/GetClientDatabyId');
    setClientData(data[0].company.companyProjects);
    updateFormInput({
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      isActive: data[0].isActive,
      roleId: data[0].userRoles[0].roleId,
      userRoles:data[0].userRoles,
      companyName:data[0].company.name,
      companyEmail:data[0].company.email
    });
    setIsLoading(false);
  }

  const getAdminData = async () => {
    const data = await commonServices.HttpGetbyId(paramUserId, '/Admin/GetAdminDatabyId');
    setLeadData(data[0]);
    updateFormInput({
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      isActive: data[0].isActive,
      roleId: data[0].userRoles[0].roleId,
      userRoles:data[0].userRoles
    });
    setIsLoading(false);
  }

  useEffect(() => {
    onLoad();
  }, []);


  const updateUser = async () => {
    try{
      setIsLoading(true);
      let updateUserDTO = {
          Id:formInput.id,
          Name:formInput.name,
          Email:formInput.email,
          IsActive:formInput.isActive,
          UserRoles:formInput.userRoles
      }  
      await commonServices.HttpPost(updateUserDTO,'/Admin/UpdateUserById')
      setAlert({type: 'success', msg: "User updated successfully!" });
      onLoad();
      
    }catch(error){
      setIsLoading(false);
      setAlert({type: 'danger', msg: "Updating user failed!" });
    }
  }

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.msg} />}
        {popupProps && (
          <PopUps inputs={popupProps.inputs || null}
            show={popupProps.show}
            title={popupProps.title || null}
            message={popupProps.message || null}
            buttontitle={popupProps.buttontitle || null}
            onClose={closePopup}
            onClick={popupProps.onClick} />)}

      <div className="container">
        {isLoading && <LoadingSpinner />}

        <h1 className="mt-4">User Detail Page</h1>
        <div className="row mt-4">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">

            <div className="form-floating mb-3">
              <CustomFields name="Name" classField="form-control" type="text" placeholder="Name" value={formInput.name} onChange={e => updateFormInput({ ...formInput, name: e.target.value })}></CustomFields>
              <label htmlFor="inputFirstName">Name</label>
            </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="form-floating mb-3">
              <CustomFields name="Email" classField="form-control" type="text" placeholder="Email" value={formInput.email} onChange={e => updateFormInput({ ...formInput, email: e.target.value })}></CustomFields>
              <label htmlFor="inputFirstName">Email</label>
            </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="form-floating mb-3">
                <CustomFields name="isActive" classField="form-select" type="select" placeholder="Status" value={formInput.isActive} onChange={e => updateFormInput({ ...formInput, isActive: !formInput.isActive })} optionsArray={statusArray}></CustomFields>
                <label className="inputFirstName">Status</label>
              </div>
            </div>

          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="form-floating mb-3">
              <CustomFields name="Role" classField="form-select" type="select" placeholder="Role" value={formInput.roleId} onChange={e => setRole(e)} optionsArray={allRoles} hideOption={currentRoleId == SuperAdminRoleId? null: SuperAdminRoleId}></CustomFields>
              <label htmlFor="inputCompanyName">Role</label>
            </div>
          </div>

          {paramRoleId == ClientRoleId &&
            <>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="form-floating mb-3">
                  <CustomFields name="Company Name" classField="form-control" type="text" placeholder="Company Name" value={formInput.companyName} onChange={e => updateFormInput({ ...formInput, companyName: e.target.value })} ></CustomFields>
                  <label htmlFor="inputCompanyName">Company Name</label>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="form-floating mb-3">
                  <CustomFields name="Company Email" classField="form-control" type="text" placeholder="Company Email" value={formInput.companyEmail} onChange={e => updateFormInput({ ...formInput, companyEmail: e.target.value })} ></CustomFields>
                  <label htmlFor="inputCompanyName">Company Email</label>
                </div>
              </div>
            </>
          }
        </div>

        <div className="row">
          <div className="float-end">
            <CustomButton className="btn btn-success float-end mt-3 ms-lg-1" onClick={(e) => updateUser(e)} label="Update" icon={<span className="me-2"><i className="fas fa-redo" style={{ fontsize: '20px' }}></i></span>}></CustomButton>
          </div>
        </div>


        <div className="row mt-4 mb-5">
          <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
            {(paramRoleId == EmployeeRoleId || paramRoleId == LeadRoleId) &&
              <div className="datatable-container">
                <table id="datatablesSimple" className="datatable-table">
                  <thead>
                    <tr>
                      <th className="text-center">Project</th>
                      <th className="text-center">Company</th>
                      <th className="text-center">Inward</th>
                      <th className="text-center">OutWard</th>
                      <th className="text-center">AssignAt</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>

                    {EmployeeData != null && EmployeeData.map((employee, index) => (
                      <tr key={index}>
                        <td className="text-center">{employee.project.company.name}</td>
                        <td className="text-center">{employee.project.name}</td>
                        <td className="text-center">{employee.inwardRate}</td>
                        <td className="text-center">{employee.outwardRate}</td>
                        <td className="text-center">
                              {new Date(employee.assignedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                        </td>
                        <td className="text-center">
                          {employee.employeeProjectStatus == true
                            ? <i className="fa fa-check" style={{ fontsize: '24px', color: "green" }}></i>
                            : <i className="fa fa-ban" style={{ fontsize: '24px', color: "red" }}></i>}
                        </td>

                      </tr>
                    ))}
                    {EmployeeData != null && EmployeeData.length == 0 && <tr><td colSpan={6} align="center">No Data Found</td></tr>}
                  </tbody>
                </table>
              </div>
            }
            {paramRoleId == ClientRoleId &&
              <div className="datatable-container">
                <table id="datatablesSimple" className="datatable-table">
                  <thead>
                    <tr>
                      <th className="text-center">Project</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">ToAssigned</th>
                      <th className="text-center">CreatedAt</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ClientData != null && ClientData.map((client, index) => (
                      <tr key={index}>
                        <td className="text-center">{client.name}</td>
                        <td className="text-center">{client.description}</td>
                        <td className="text-center ShowAttachements">
                          {client.employeesProjects.length}
                          {client.employeesProjects.length > 0 &&
                            <div className="ToShowAttachements position-absolute toast-header" >
                                   {client.employeesProjects.map((emp,index)=>(
                                              <div style={{fontsize:'small'}} key={index}>
                                                  <p>{emp.projectAssignedToUser.name}</p>
                                              </div>
                                    ))}
                            </div>
                          }
                        </td>
                        <td className="text-center">
                              {new Date(client.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                        </td>
                        <td className="text-center">
                              { client.isActive == true 
                                  ? <i className="fa fa-check" style={{ fontsize: '24px', color: "green" }}></i>
                                  : <i className="fa fa-ban" style={{ fontsize: '24px', color: "red" }}></i>
                              }
                          </td> 
                      </tr>
                    ))} 
                    {ClientData != null && ClientData.length == 0 && <tr><td colSpan={5} align="center">No Data Found</td></tr>} 
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetails