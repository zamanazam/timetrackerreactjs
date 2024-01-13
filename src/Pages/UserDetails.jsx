import React, { useState, useEffect } from 'react'
import { apiUrl, SuperAdminRoleId, allRoles, LeadRoleId, EmployeeRoleId, ClientRoleId, statusArray, paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination } from "../GlobalFile";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CustomFields from "../Components/CustomFields";
import LoadingSpinner from "../Components/LoadingSpinner";
import Alert from "../Components/Alert";
import PopUps from "../Components/PopUps";
import CustomButton from '../Components/CustomButton';
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

  const headers = new Headers();
  const token = sessionStorage.getItem('Token');
  headers.append('Authorization', 'Bearer ' + token);
  headers.append('Content-Type', 'application/json');
  const getCallOptions = {
    method: 'GET',
    headers: headers,
  };  
  const controller = new AbortController();
  const signal = controller.signal;
  const currentRoleId = sessionStorage.getItem('RoleId');

  const openPopup = (props) => {
    setPopupProps(props);
  };

  const closePopup = () => {
    setPopupProps(null);
  };

const setRole = (e)=>{
  debugger
  updateFormInput({ ...formInput, roleId: e.target.value,
    userRoles: formInput.userRoles.map((role) =>
      role.id === formInput.id
        ? { ...role, roleId: e.target.value }
        : role
    )
  });
}

  const onLoad = () => {
    debugger
    if (paramRoleId == SuperAdminRoleId) {
      getAdminData();
    }

    if (paramRoleId == EmployeeRoleId) {
      getEmployeeData();
    }

    if (paramRoleId == ClientRoleId) {
      getClientData();
    }
  }
  const getEmployeeData = async () => {
    const url = new URL(apiUrl + '/Admin/GetEmployeebyId');
    url.searchParams.append('id', paramUserId);

    const response = await fetch(url, getCallOptions, { signal });
    const data = await response.json();
    debugger
    console.log('employee', data);
    setEmployeeData(data[0].projectAssignedToUsers);
    updateFormInput({
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      isActive: data[0].isActive,
      roleId: data[0].userRoles[0].roleId,
      userRoles:data[0].userRoles
    });

  }

  const getClientData = async () => {
    debugger
    const url = new URL(apiUrl + '/Admin/GetClientDatabyId');
    url.searchParams.append('id', paramUserId);

    const response = await fetch(url, getCallOptions, { signal });
    const data = await response.json();
    console.log('client', data);
    setClientData(data);
  }

  const getAdminData = async () => {
    debugger
    const url = new URL(apiUrl + '/Admin/GetAdminDatabyId');
    url.searchParams.append('id', paramUserId);

    const response = await fetch(url, getCallOptions, { signal });
    const data = await response.json();
    console.log('admin', data);
    setLeadData(data);
  }

  useEffect(() => {
    onLoad();
  }, []);


  const updateUser = async () => {
    debugger
    let updateUserDTO = {
        Id:formInput.id,
        Name:formInput.name,
        Email:formInput.email,
        IsActive:formInput.isActive,
        UserRoles:formInput.userRoles
    }

    const postCallOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(updateUserDTO)
    };  

    const url = new URL(apiUrl + '/Admin/UpdateUserById');
    const response = await fetch(url,postCallOptions)

  }

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

        <h1 className="mt-4">User Detail Page</h1>
        <div className="row mt-4">
          <div className="col-lg-6 col-md-6 col-sm-12">

            <div className="form-floating mb-3">
              <CustomFields name="Name" classField="form-control" type="text" placeholder="Name" value={formInput.name} onChange={e => updateFormInput({ ...formInput, name: e.target.value })}></CustomFields>
              <label htmlFor="inputFirstName">Name</label>
            </div>

            <div className="form-floating mb-3">
              <CustomFields name="Email" classField="form-control" type="text" placeholder="Email" value={formInput.email} onChange={e => updateFormInput({ ...formInput, email: e.target.value })}></CustomFields>
              <label htmlFor="inputFirstName">Email</label>
            </div>

            <div className="form-floating mb-3">
              <CustomFields name="isActive" classField="form-select" type="select" placeholder="Status" value={formInput.isActive} onChange={e => updateFormInput({ ...formInput, isActive: !formInput.isActive })} optionsArray={statusArray}></CustomFields>
              <label className="inputFirstName">Status</label>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-floating mb-3">
              <CustomFields name="Role" classField="form-select" type="select" placeholder="Role" value={formInput.roleId} onChange={e => setRole(e)} optionsArray={allRoles} hideOption={SuperAdminRoleId}></CustomFields>
              <label htmlFor="inputCompanyName">Role</label>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="float-end">
            <CustomButton className="btn btn-success float-end mt-3 ms-lg-1" onClick={(e) => updateUser(e)} label="Update" icon={<span className="me-2"><i className="fas fa-redo" style={{ fontsize: '20px' }}></i></span>}></CustomButton>
          </div>
        </div>


        <div className="row mt-4 mb-5">
          <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
            {paramRoleId == EmployeeRoleId &&
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
                        <td className="text-center">{employee.assignedOn}</td>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetails