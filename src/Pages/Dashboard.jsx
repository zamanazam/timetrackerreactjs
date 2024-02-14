import React, { useEffect, useState } from "react";
import { paginationArray, getPagesTags, getEntriesOfPagination, getStartPointOfPagination, SuperAdminRoleId } from "../GlobalFile";
import { useNavigate } from "react-router-dom";
import CustomFields from "../Components/CustomFields";
import Chart from "../Components/Chart";
import { DateRangePicker } from "react-date-range";
import Multiselect from "multiselect-react-dropdown";
import commonServices from "../Services/CommonServices";
function Dashboard() {
  const [ProjectDataObj, setProjectData] = useState(null);
  const [RecentLogsArray, setRecentTimeLogs] = useState([]);
  const [CompaniesData, setCompaniesData] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [chartSearchObj, setChartSearchObj] = useState({ startDate: new Date(), endDate: new Date() });
  const navigate = useNavigate();
  var currentRoleId = sessionStorage.getItem('RoleId');
  const [multiAxisChartFilterData, setMultiAxisChartFilterData] = useState({
    Employees: [],
    Projects: [],
    DateFrom: null,
    DateTo: null
  });
  const handleDateRange = async (ranges) => {
    setChartSearchObj(prevDateRange => ({ ...prevDateRange, startDate: ranges.startDate, endDate: ranges.endDate }));
  };

  const upDateDateRange = () => {
    if (chartSearchObj?.startDate && chartSearchObj?.endDate) {
      setDatePickerVisible(false);
      GetMultiValueAxisChart();
    }
  }

  const getDayNamesbydifference = (inputDate) => {
    inputDate = new Date(inputDate);
    var todaydate = new Date();
    var diff = todaydate - inputDate;
    var DifferenceDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    var val;
    if (DifferenceDays == 0) return "Today";
    if (DifferenceDays == 1) return "Yesterday";

    if (DifferenceDays > 1 && DifferenceDays <= 7)
      val = inputDate.toLocaleString("default", { weekday: "long" });

    if (DifferenceDays > 8 && DifferenceDays <= 30)
      val = inputDate.toLocaleString('en-us', { day: 'numeric', month: 'short' });

    if (DifferenceDays > 30 && DifferenceDays <= 365)
      val = inputDate.toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' });

    if (DifferenceDays > 365)
      val = inputDate.toLocaleString('en-us', { month: 'short', year: 'numeric' });

    return val;
  }

  const [formInput, updateFormInput] = useState({
    name: null,
    roleId: [],
    startFrom: new Date(),
    endDate: new Date(),
    data: [],
    diff: Math.round((new Date(chartSearchObj?.endDate) - new Date(chartSearchObj?.startDate)) / (1000 * 60 * 60 * 24)),
    width: "100%",
    height: "100%"
  });

  const [pagination, setPagination] = useState({
    Page: 1,
    PageSize: 10,
    Total: 10,
    TotalPages: 1
  });

  useEffect(() => {
    GetMultiValueAxisChart();
    GetDropDowns();
    setChartSearchObj(prevDateRange => ({ ...prevDateRange, startDate: new Date(), endDate: new Date() }));

  }, [chartSearchObj?.Employee, chartSearchObj?.Project]);

  useEffect(() => {
    GetCompanywithProject();
  }, [pagination.Page, pagination.PageSize]);

  useEffect(() => {
    ProjectsData();
    RecentTimeLogs();
  }, []);

  const RecentTimeLogs = async () => {
    setRecentTimeLogs(await commonServices.HttpGet(null, '/Home/GetRecentTimeLogs'));
  };

  const ProjectsData = async () => {
    setProjectData(await commonServices.HttpGet(null, '/Admin/GetSuperAdminDashboardData'));
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
    if(currentRoleId == SuperAdminRoleId){
        navigate('/ProjectStatus/' + id);
    }
  }

  const GetCompanywithProject = async () => {
    var data = await commonServices.HttpGet(pagination, '/Admin/GetCompanyProjects');
    setCompaniesData(data.results);
    setPagination({
      Page: data?.page || 1,
      PageSize: data?.pageSize || 10,
      Total: data?.total || 0,
      TotalPages: data?.totalPages || 0
    })
  }

  const GetDropDowns = async () => {
    var response = await commonServices.HttpGetbyId(null, '/Home/GetDropDowns');
    setMultiAxisChartFilterData(prevState => ({
      ...prevState,
      Employees: response.userNameDTOs,
      Projects: response.projectNamesDTOs
    }));
  }

  const GetMultiValueAxisChart = async () => {
    setDatePickerVisible(false);
    let searchChartDTO = {
      DateFrom: chartSearchObj?.startDate,
      DateTo: chartSearchObj?.endDate,
      Employee: chartSearchObj?.Employee ? chartSearchObj?.Employee.map(x => x.id) : [],
      Project: chartSearchObj?.Project ? chartSearchObj?.Project.map(x => x.id) : [],
      RoleId: currentRoleId
    };
    let result = await commonServices.HttpPost(searchChartDTO, '/Home/ChartDatabyCondition');
    updateFormInput(prevState => (
      { ...prevState, data: result ,
        diff  : Math.round((new Date(chartSearchObj?.endDate) - new Date(chartSearchObj?.startDate)) / (1000 * 60 * 60 * 24)),
        startFrom :  chartSearchObj?.startDate,
        endDate : chartSearchObj?.endDate
      }));
  }

  return (
    <div className='container'>
      <div className="row mt-4 mb-4">
        <h1 className="float-start">Dashboard</h1>
      </div>
      {/* Projects status section */}
      <div className="row mb-2">
        <div className="col-xl-3 col-md-6">
          <div className="card mb-4">
            <div className="card-body text-white bg-primary fw-bold">Total</div>
            <div className="card-footer bg-body" href="#" onClick={() => NavigatetoProjects(1)}>
              <p className="fw-bold border-0 bg-body text-black-50 float-start">{ProjectDataObj?.totalProjects}</p>
              <span className="border-0 bg-body float-end"><i className="fas fa-angle-right"></i></span>
            </div>
          </div>
        </div>
        {currentRoleId == SuperAdminRoleId && 
        <>
            <div className="col-xl-3 col-md-6">
              <div className="card mb-4">
                <div className="card-body bg-warning text-white fw-bold">In-Progress</div>
                <div className="card-footer bg-body" href="#" onClick={() => NavigatetoProjects(1)}>
                  <p className="fw-bold border-0 bg-body text-black-50 float-start">{ProjectDataObj?.totalProjects}</p>
                  <span className="border-0 bg-body float-end"><i className="fas fa-angle-right"></i></span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card mb-4">
                <div className="card-body bg-success text-white fw-bold">BackLog</div>
                <div className="card-footer bg-body" href="#" onClick={() => NavigatetoProjects(3)}>
                  <p className="fw-bold border-0 bg-body text-black-50 float-start">{ProjectDataObj?.unAssignedProjects}</p>
                  <span className="border-0 bg-body float-end"><i className="fas fa-angle-right"></i></span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card mb-4">
                <div className="card-body bg-danger text-white fw-bold">Pause</div>
                <div className="card-footer bg-body" href="#" onClick={() => NavigatetoProjects(4)}>
                  <p className="fw-bold border-0 bg-body text-black-50 float-start">{ProjectDataObj?.blockedProjects}</p>
                  <span className="border-0 bg-body float-end"><i className="fas fa-angle-right"></i></span>
                </div>
              </div>
            </div>
          </>
        }

      </div>

      {/* Chart and recent timeLogs section */}
      <div className="row mb-2">
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12">
          <div className="card border-0">
            <div className="card-header border-0 bg-primary">
              <p className="text-white fw-bold">Time Log Charts</p>
            </div>
            <div className="card-body bg-light">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-12 col-12 mb-2">
                  <CustomFields type="multiselect" className="form-select ms-3" placeholder="Select Employees" optionsArray={multiAxisChartFilterData.Employees} value={formInput.roleId}
                    onChange={(e) => { setChartSearchObj((prevFormInput) => ({ ...prevFormInput, Employee: e.target.value })) }}>
                  </CustomFields>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-12 col-12 mb-2">
                  <CustomFields type="multiselect" className="form-select ms-3" placeholder="Select Projects" optionsArray={multiAxisChartFilterData.Projects} value={formInput.roleId}
                    onChange={(e) => { setChartSearchObj((prevFormInput) => ({ ...prevFormInput, Project: e.target.value })) }}>
                  </CustomFields>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-12 col-12 mb-2">
                  <input type="text" id="datePickerInputs" className="form-control w-100"
                    value={`${chartSearchObj?.startDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} - ${chartSearchObj?.endDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    onClick={() => setDatePickerVisible(true)} onChange={(e) => setDatePickerVisible(true)} />
                  {datePickerVisible && (
                    <div className="mt-1 ml-4 pb-3 border bg-body" style={{ position: 'absolute', zIndex: 100 }}>
                      <DateRangePicker ranges={[chartSearchObj]} onChange={(selected) => { const { range1 } = selected; handleDateRange(range1); }} />
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

              <Chart inputs={formInput} ></Chart>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <div className="card h-100">
            <div className="card-header bg-primary">
              <p className="text-white fw-bold">Recent TimeLogs</p>
            </div>
            <div className="card-body overflow-auto p-0" style={{ height: '452px' }} >
              {RecentLogsArray.length > 0 ?
                RecentLogsArray.map((RecentLogs, key) => (
                  <div className="mb-4" key={key}>
                    <div>
                      <div>
                        <span className="me-3 ms-1"><i className="fa fa-circle" style={{ color: getEmployeeColor(RecentLogs.employeeId) }}></i></span>
                        <p className="badge bg-light text-black-50">{RecentLogs.hours}h</p>
                        <p className="border-start border-5 ms-2 ps-4 text-black-50">
                          {RecentLogs.timeLogText}
                          <span className="fw-bold me-4"> by {RecentLogs.employee}</span>
                          <span className="small">{getDayNamesbydifference(RecentLogs.sendOn)}</span>
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                )) :
                <p className="text-center h5 mt-5 text-black-50 fw-bold">No TimeLog Found</p>
              }
            </div>
          </div>
        </div>
      </div>
      {/* Companies table */}
      <div className="row mt-3">
        <div className="col">
        <div className="card mt-4">
          <div className="card-body">
            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
              <div className="datatable-top">
                <h5 className="float-start">Projects Chart</h5>
                <div className="datatable-dropdown">
                  <label>
                    <CustomFields type="select" classField="datatable-selector" value={pagination.PageSize}
                      onChange={(e) => setPagination({ ...pagination, PageSize: e.target.value, Page: 1 })} optionsArray={paginationArray}></CustomFields>
                  </label>
                </div>
                {/* <div className="datatable-search">
                  <CustomFields type="text" classField="form-control" placeholder="Name" value={formInput.name} onChange={(e) => { updateFormInput({ ...formInput, name: e.target.value }) }}></CustomFields>
                </div> */}
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
                    {CompaniesData.length > 0 ? (
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
                                  <div style={{ fontsize: 'small' }} key={empIndex}>
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
                                {Comp.employeeLogsandHours.map((Hour, empHourIndex) => (
                                  <div className="d-flex" key={empHourIndex}>
                                    <p>{Hour.employee}</p>
                                    <p className="ms-5">{Hour.hours}</p>
                                  </div>
                                ))}
                              </div>
                            }
                          </td>
                          <td>{new Date(Comp.createdOn).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                        </tr>
                      ))) : (
                      <tr>
                        <td colSpan={7} align="center">No Data Found</td>
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
      </div>
    </div>

  );
}
export default Dashboard;