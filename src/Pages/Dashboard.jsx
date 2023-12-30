import React,{useEffect,useState}from "react";
import { apiUrl,UserId,RoleId } from '../GlobalFile';
import { useNavigate } from "react-router-dom";
import CustomButton from "../Components/CustomButton";


function Dashboard() {
  const [ProjectDataObj, setProjectData] = useState(null);
  const [RecentLogsObj, setRecentTimeLogs] = useState(null);
  const [CompaniesData, setCompaniesData] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('Token');        

  useEffect(() => {
    getDashboardData();
  }, []); 
  
  function getDashboardData() {
    debugger
    if(token == null){
      navigate('/logIn');
      return false;
    }
    ProjectsData();
    RecentTimeLogs();
    GetCompanywithProject();
  }

      const RecentTimeLogs =()=>{
                //const token = sessionStorage.getItem('Token');        
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

    var employeeColors ={};
    const getEmployeeColor = (employeeId)=> {
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

   const NavigatetoProjects =(id)=>{
           const navigate = useNavigate();
          navigate('/ProjectsStatusWise/id?='+id);
        }

   const GetCompanywithProject = function(Page = 1){
                const token = sessionStorage.getItem('Token');
                const newUrl = apiUrl+'/Admin/GetCompanyProjects'; 
                const parameter1 = Page; 
                const parameter2 = 10;
                
                const url = new URL(newUrl);
                url.searchParams.append('Page', parameter1);
                url.searchParams.append('PageSize', parameter2);

                const headers = new Headers();
                headers.append('Authorization', 'Bearer '+token);
                headers.append('Content-Type', 'application/json');

                const options = {
                  method: 'GET',
                  headers: headers,
                };


                fetch(url,options)
                  .then((response) => response.json())
                  .then((data) => {

                    setCompaniesData(data.results);

                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
   }

    return (
        <div className='container' onLoad={getDashboardData}>
            <h5>Dashboard</h5>
            <div className="row mb-4">
                    <div className="col-xl-3 col-md-6">
                        <div className="card mb-4">
                            <div className="card-body text-white bg-primary fw-bold">Total</div>
                            <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="/ProjectsStatusWise/1">
                                <CustomButton className="fw-bold border-0 bg-body text-black text-decoration-none" label={ProjectDataObj == null ? 0 : ProjectDataObj.totalProjects} onClick={() => NavigatetoProjects(1)}></CustomButton>
                                <CustomButton className="fw-bold border-0 bg-body text-black text-decoration-none" label={ProjectDataObj == null ? 0 : ProjectDataObj.totalProjects} onClick={()=>NavigatetoProjects(1)}></CustomButton>
                                <CustomButton className="border-0 bg-body" label={<i className="fas fa-angle-right"></i>} onClick={()=>NavigatetoProjects(1)}></CustomButton>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6">
                          <div className="card mb-4">
                              <div className="card-body bg-warning text-white fw-bold">In-Progress</div>
                              <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="/ProjectsStatusWise/2">
                                <CustomButton className="fw-bold border-0 bg-body text-black text-decoration-none" label={ProjectDataObj == null ? 0 : ProjectDataObj.totalProjects} onClick={NavigatetoProjects(2)}></CustomButton>
                                <CustomButton className="border-0 bg-body" label={<i className="fas fa-angle-right"></i>} onClick={NavigatetoProjects(2)}></CustomButton>
                              </div>
                          </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6">
                      <div className="card mb-4">
                          <div className="card-body bg-success text-white fw-bold">BackLog</div>
                          <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="/ProjectsStatusWise/3">
                              <CustomButton className="fw-bold border-0 bg-body text-black text-decoration-none" label={ProjectDataObj == null ? 0 :  ProjectDataObj.unAssignedProjects} onClick={()=>NavigatetoProjects(3)}></CustomButton>
                              <CustomButton className="border-0 bg-body" label={<i className="fas fa-angle-right"></i>} onClick={()=>NavigatetoProjects(3)}></CustomButton>
                          </div>
                      </div>
                  </div>

                  <div className="col-xl-3 col-md-6">
                      <div className="card text-white mb-4">
                          <div className="card-body bg-danger">Pause</div>
                          <div className="card-footer bg-body d-flex align-items-center justify-content-between" href="/ProjectsStatusWise/4">
                              <CustomButton className="fw-bold border-0 bg-body text-black text-decoration-none" label={ProjectDataObj == null ? 0 :  ProjectDataObj.blockedProjects} onClick={()=>NavigatetoProjects(4)}></CustomButton>
                              <CustomButton className="border-0 bg-body" label={<i className="fas fa-angle-right"></i>} onClick={()=>NavigatetoProjects(4)}></CustomButton>

                          </div>
                        </div>
                    </div>
            </div>


            <div className="row mb-4">
                  <div className="col-lg-8 col-md-12 col-sm-12"></div>
                       <div className="col-lg-4 col-md-12 col-sm-12">
                          <div className="card">
                              <div className="card-header bg-primary">
                                  <p className="text-white fw-bold">Recent TimeLogs</p>
                                    </div>
                                      <div className="card-body overflow-auto p-0"style={{height:'452px'}} >
                                        {RecentLogsObj !== null ?  (
                                           RecentLogsObj.map((RecentLogs, key) => (
                                            <div className="mb-4">
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
                       ): (' No Data Found')}
                    </div>
                  </div>
                </div>
             </div>

              <div className="card">
              <div className="card-header text-primary fw-bold">
                      <div className="float-start d-flex mt-2">
                          <span><i className="material-icons">collections</i></span>
                            <label className="ms-2">Projects Detail</label>
                      </div> 
                            <div className="float-end">
                                <input type="text" className="form-control" />
                            </div>
                                <label className="float-end mt-1 me-3" >Search:</label>
                    </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Project</th>
                        <th>Contributors</th>
                        <th>TimeLogs</th>
                        <th>Hours</th>
                        <th>Created On</th>
                      </tr>
                    </thead>
                    <tbody>
                    {CompaniesData !== null ?(
                      CompaniesData.map((Comp,index)=>(
                        <tr>
                          <td>{Comp.companyName}</td>
                          <td>{Comp.companyName}</td>
                          <td>{Comp.employeeName.length}
                                {Comp.employeeName !== null ?(
                                        <div className="ToShowEmployeeName position-absolute toast-header">
                                          {Comp.employeeName.map((Emp,empIndex) => (
                                              <div ng-repeat="Emp in Comp.employeeName track by $index">
                                                      <p>{Emp}</p>
                                              </div>
                                          ))}
                                        </div>
                                ):('')}
                          </td>
                          <td>{Comp.totalTimeLogs}
                                  <div className="ToShowLogs position-absolute toast-header">
                                        {Comp.employeeLogsandHours != null?(
                                          Comp.employeeLogsandHours.map((Logs,empLogIndex) =>(
                                             <div className="d-flex">
                                                <p>{Logs.employee}</p>
                                                <p className="ms-5">{Logs.timeLog}</p>
                                              </div>
                                          ))
                                        ):('')}  
                                  </div>
                          </td>
                          <td>{Comp.totalHours}
                                    <div className="ToShowHours position-absolute toast-header">
                                        {Comp.employeeLogsandHours != null?(
                                              Comp.employeeLogsandHours.map((Hour,empHourIndex) =>(
                                                <div className="d-flex">
                                                    <p>{Hour.employee}</p>
                                                    <p className="ms-5">{Hour.hours}</p>
                                                  </div>
                                              ))
                                        ):('')}  
                                    </div>
                          </td>
                          <td>{new Date(Comp.createdOn).toLocaleDateString("en-US", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                              })}</td>
                        </tr>
                      ))):(
                          <tr>
                            <td colSpan={6} align="center">No Data Found</td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

        </div>
    );
}
export default Dashboard;