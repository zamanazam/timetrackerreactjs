import React,{useEffect,useState} from "react";
import { apiUrl } from "../GlobalFile";
import { useParams } from "react-router-dom";
function ProjectDetails(){
    const [ProjectData ,setProjectData] = useState(null);
    const { id } = useParams();
    useEffect(()=>{
        GetProjectDetails();
    },[]);

    function GetProjectDetails(){        
        const headers = new Headers();
            const token = sessionStorage.getItem('Token');
            headers.append('Authorization', 'Bearer '+ token);
            headers.append('Content-Type', 'application/json');

            const url = new URL(apiUrl+'/Project/GetProjectDetailsbyId');
            url.searchParams.append('id', id);
            const options = {
                method: 'GET',
                headers: headers,
            };

            fetch(url,options)
            .then((response) => response.json())
            .then((data) => {
                console.log('Companies',data);
                if(ProjectData == null){
                    setProjectData(data);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            }); 
    }


    return(

        <div className="container">
        {ProjectData !== null ? (
            <div>
                <h1 className="mt-4">Project Detail Page</h1>
                <div className="row mt-4">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <label>Project Name:</label>
                        <div>
                            <input className="Namedata form-control" defaultValue={ProjectData.name}/>
                        </div>
                            <label className="mt-3">Status:</label>
                            <select className="form-select" >
                                <option >Active</option>
                                <option >Pause</option>
                            </select>
                        <label className="mt-3">Created On:</label>
                        <input className="border form-control w-100"  defaultValue={new Date(ProjectData.createdOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} readOnly/>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <label>Company Name:</label>
                        <input className="border form-control w-100" defaultValue={ProjectData.company.name} readOnly/>
                        <label className="mt-3">Company Email:</label>
                        <input className="border form-control w-100" defaultValue={ProjectData.company.email} readOnly/>
                    </div>
                </div>
        
                <div className="row mt-3">
                    <label className="fw-bold" >Project Description:</label>
                    <div>
                        <input className="Descripdata form-control mt-2"defaultValue={ProjectData.description}  style={{textalign:'justify', lineheight:'40px'}} />
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
                                        {ProjectData.employeesProjects !== null? 
                                            ProjectData.employeesProjects.map((employee,i)=>(
                                                <tr key={i}>
                                                    <td className="text-center">{i+1}</td>
                                                    <td className="text-center" >{employee.projectAssignedToUser.name}</td>
                                                    <td className="text-center">
                                                        
                                                            {employee.isActive == true?
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
                                                <td colspan={3} align="center">
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
                        <button className="btn btn-success float-end mt-3 ms-lg-1" >Update<span className="ms-3"><i className="fas fa-redo" style={{fontsize:'20px'}}></i></span></button>
                        <button className="btn btn-warning float-end mt-3">Assign<span className="ms-2"><i className="fa fa-plus" style={{fontsize:'20px'}}></i></span></button>
                    </div>
                </div>
        </div>
        ):(
                <div className="row">
                    <h5>No Data Found</h5>
                </div>
        )}
        </div>
        )
}
export default ProjectDetails;