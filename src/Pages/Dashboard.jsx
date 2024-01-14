import React, { useEffect, useState } from "react";
import { apiUrl, allRoles,paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination, SuperAdminRoleId } from "../GlobalFile";
import { useNavigate } from "react-router-dom";
import CustomFields from "../Components/CustomFields";
import Chart from "../Components/Chart";
function Dashboard() {
  const [ProjectDataObj, setProjectData] = useState(null);
  const [RecentLogsObj, setRecentTimeLogs] = useState(null);
  const [CompaniesData, setCompaniesData] = useState([]);
  const [multiAxisChartData,setMultiAxisChartData]= useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('Token');
  const [formInput, updateFormInput] = useState({
    name: null,
    roleId:[]
});
  const [pagination, setPagination] = useState({
    Page: 1,
    PageSize: 10,
    Total: 10,
    TotalPages: 1
  });
  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    GetCompanywithProject();
  }, [pagination.Page, pagination.PageSize]);

  function getDashboardData() {
    ProjectsData();
    RecentTimeLogs();
    GetMultiValueAxisChant();
  }

  const RecentTimeLogs = () => {
    fetch(apiUrl + '/Home/GetRecentTimeLogs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setRecentTimeLogs(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const ProjectsData = () => {
    const date = new Date();
    const token = sessionStorage.getItem('Token');

    fetch(apiUrl + '/Admin/GetSuperAdminDashboardData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setProjectData(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  var employeeColors = {};
  const getEmployeeColor = (employeeId) => {
    if (!employeeColors[employeeId]) {
      employeeColors[employeeId] = getRandomColor();
    }
    return employeeColors[employeeId];
  };

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const NavigatetoProjects = (id) => {
    debugger
    navigate('/ProjectsStatusWise/id?='+id);
  }

  const GetCompanywithProject = function () {
    const token = sessionStorage.getItem('Token');
    const newUrl = apiUrl + '/Admin/GetCompanyProjects';
    const parameter1 = pagination.Page;
    const parameter2 = pagination.PageSize;

    const url = new URL(newUrl);
    url.searchParams.append('Page', parameter1);
    url.searchParams.append('PageSize', parameter2);

    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'GET',
      headers: headers,
    };


    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setCompaniesData(data.results);
        setPagination({
          Page:data.page,
          PageSize:data.pageSize,
          Total:data.total,
          TotalPages:data.totalPages
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const GetMultiValueAxisChant =async ()=>{
      debugger
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      };
      const currentDate = new Date();
      const dateFrom = new Date(currentDate);
      dateFrom.setDate(currentDate.getDate() - 13);
      let searchChartDTO = {
          DateFrom: dateFrom,
          DateTo: new Date(),
          Employee: [],
          Project:[],
          RoleId:null
      };
      let url = apiUrl + '/Home/ChartDatabyCondition';
       let response = await fetch(url, {
                                        headers:headers,
                                        method:'POST',
                                        body: JSON.stringify(searchChartDTO),
                                    });
       let data = await response.json();
       console.log('data',data);
       setMultiAxisChartData(data);
  }


  return (
    <div className='container' onLoad={getDashboardData}>
      <h5>Dashboard</h5>
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card mb-4">
            <div className="card-body text-white bg-primary fw-bold">Total</div>
            <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="#" onClick={() => NavigatetoProjects(1)}>
              <p className="fw-bold border-0 bg-body text-black text-decoration-none">{ProjectDataObj?.totalProjects}</p>
              <span className="border-0 bg-body"><i className="fas fa-angle-right"></i></span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card mb-4">
            <div className="card-body bg-warning text-white fw-bold">In-Progress</div>
            <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="#" onClick={() => NavigatetoProjects(2)}>
              <p className="fw-bold border-0 bg-body text-black text-decoration-none">{ProjectDataObj?.totalProjects}</p>
              <span className="border-0 bg-body"><i className="fas fa-angle-right"></i></span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card mb-4">
            <div className="card-body bg-success text-white fw-bold">BackLog</div>
            <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="#" onClick={() => NavigatetoProjects(3)}>
              <p className="fw-bold border-0 bg-body text-black text-decoration-none">{ProjectDataObj?.unAssignedProjects}</p>
              <span className="border-0 bg-body"><i className="fas fa-angle-right"></i></span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card text-white mb-4">
            <div className="card-body bg-danger">Pause</div>
            <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="#" onClick={() => NavigatetoProjects(4)}>
              <p className="fw-bold border-0 bg-body text-black text-decoration-none">{ProjectDataObj?.blockedProjects}</p>
              <span className="border-0 bg-body"><i className="fas fa-angle-right"></i></span>
            </div>
          </div>
        </div>
      </div>


      <div className="row mb-4">
        <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12">
          <Chart data={multiAxisChartData} width="100%" height="100%"></Chart>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12">
          <div className="card">
            <div className="card-header bg-primary">
              <p className="text-white fw-bold">Recent TimeLogs</p>
            </div>
            <div className="card-body overflow-auto p-0" style={{ height: '452px' }} >
              {RecentLogsObj !== null ? (
                RecentLogsObj.map((RecentLogs, key) => (
                  <div className="mb-4" key={key}>
                    <div>
                      <div>
                        <span className="me-3 ms-1"><i className="fa fa-circle" style={{ color: getEmployeeColor(RecentLogs.employeeId) }}></i></span>
                        <p className="badge bg-light text-black-50">{RecentLogs.hours}h</p>
                        <p className="border-start border-5 ms-2 ps-5 text-black-50">
                          {RecentLogs.timeLogText}
                          <span className="fw-bold"> by {RecentLogs.employee}</span>
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (' No Data Found')}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
            <div className="datatable-top">
              <div className="datatable-dropdown">
                <label>
                  <CustomFields type="select" classField="datatable-selector" value={pagination.PageSize}
                    onChange={(e) => setPagination({ ...pagination, PageSize: e.target.value, Page: 1 })} optionsArray={paginationArray}></CustomFields>
                </label>
              </div>
              <div className="datatable-search">
                <CustomFields type="text" classField="form-control" placeholder="Name" value={formInput.name} onChange={(e) => { updateFormInput({ ...formInput, name: e.target.value }) }}></CustomFields>
              </div>

            </div>
            <div className="datatable-container">
              <table id="datatablesSimple" className="datatable-table">
                <thead>
                  <tr>
                      <th className="text-center">Sr</th>
                      <th className="text-center">Company</th>
                      <th className="text-center">Project</th>
                      <th className="text-center">Contributors</th>
                      <th className="text-center">TimeLogs</th>
                      <th className="text-center">Hours</th>
                      <th className="text-center">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {CompaniesData.length > 0  ? (
                    CompaniesData.map((Comp, index) => (
                      <tr key={index} className="text-center">
                        <td>{getStartPointOfPagination(pagination.PageSize, pagination.Page) + index}</td>
                        <td>{Comp.companyName}</td>
                        <td>{Comp.projectName}</td>
                        <td className="ShowAttachements">
                          {Comp.employeeName.length}
                              {Comp.employeeName.length > 0 && 
                                  <div className="ToShowAttachements position-absolute toast-header">
                                      {Comp.employeeName.map((Emp, empIndex) => (
                                              <div style={{fontsize:'small'}} key={empIndex}>
                                                <p>{Emp}</p>
                                              </div>
                                      ))} 
                                  </div>
                              }
                        </td>
                        <td className="ShowLogs">{Comp.totalTimeLogs}
                              {Comp.employeeLogsandHours.length > 0 &&
                                  <div className="ToShowLogs position-absolute toast-header">
                                      {Comp.employeeLogsandHours.map((Logs, empLogIndex) => (
                                        <div className="d-flex" key={empLogIndex}>
                                            <p>{Logs.employee}</p>
                                            <p className="ms-5">{Logs.timeLog}</p>
                                        </div>
                                      ))}
                                  </div>
                              }
                        </td>
                        <td className="ShowHours">{Comp.totalHours}
                            {Comp.employeeLogsandHours.length > 0 && 
                              <div className="ToShowHours position-absolute toast-header">
                                 { Comp.employeeLogsandHours.map((Hour, empHourIndex) => (
                                      <div className="d-flex" key={empHourIndex}>
                                          <p>{Hour.employee}</p>
                                          <p className="ms-5">{Hour.hours}</p>
                                      </div>
                                  ))}
                              </div>
                            }
                        </td>
                        <td>{new Date(Comp.createdOn).toLocaleDateString("en-US", {day: "2-digit",month: "short",year: "numeric",hour: "2-digit",minute: "2-digit",hour12: true})}</td>
                      </tr>
                    ))) : (
                          <tr>
                            <td colSpan={6} align="center">No Data Found</td>
                          </tr>
                  )}
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

  );
}
export default Dashboard;