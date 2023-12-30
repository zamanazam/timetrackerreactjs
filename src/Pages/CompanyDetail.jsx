import React,{useEffect,useState}from "react";
import { apiUrl } from '../GlobalFile';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CustomButton from "../Components/CustomButton";
function CompanyDetail(){
    const [CompanyData ,setCompanyData] = useState(null);
    const { companyId } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if (CompanyData === null) {
            GetCompanyDetailsbyId();
        }
    },[CompanyData]);

    const CheckTimeLogbyAdmin = (id)=>{
        navigate('/ProjectTimeLogs/'+id+'/'+undefined);
    }
    const SelectedName = (id)=>{
        navigate('/ProjectDetails/'+id);
    }
    const GetCompanyDetailsbyId = ()=>{
            const headers = new Headers();
            const token = sessionStorage.getItem('Token');
            headers.append('Authorization', 'Bearer '+ token);
            headers.append('Content-Type', 'application/json');

            const url = new URL(apiUrl+'/Company/GetCompanyDatabyId');
            url.searchParams.append('id', companyId);
            const options = {
                method: 'GET',
                headers: headers,
            };

            fetch(url,options)
            .then((response) => response.json())
            .then((data) => {
                console.log('Companies',data);
                if(CompanyData == null){
                    setCompanyData(data);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });    
    }

      const UpdateCompany = () => {
        debugger;
        // const companyName = CompanyData.name; 
        // const companyEmail = CompanyData.email; 
        // const companyStatus = CompanyData.isActive;
      
      };

      const ProjectDetails = (projectId)=>{
        debugger
        navigate('/ProjectDetails/' + projectId);
      }

    return (
        <div className="container">
            <div className="row mt-4 mb-4">
                <h4 className="text-danger">Company Details</h4>
            </div>
            <div className="row mb-2">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <label>Company Name</label>
                    <input type="text" className="form-control" defaultValue={CompanyData?.name} />
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <label>Company Email</label>
                    <input type="text" className="form-control" defaultValue={CompanyData?.email} />
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <label>Status</label>
                        <select className="form-select" defaultValue={CompanyData?.isActive} >
                            <option value="true" >Active</option>
                            <option value="false" >Block</option>
                        </select>    
                </div> 
            </div>
            <div className="row mb-4">
                <div>
                    <CustomButton className="btn btn-success mt-4 float-end" label="Update" onClick={()=>UpdateCompany()} ></CustomButton>
                    <CustomButton className="btn btn-warning mt-4 float-end me-2" label="Project" onClick={()=>UpdateCompany()} ></CustomButton>
                </div>
            </div>
            <div className="card">
            <header className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a href="#" data-bs-target="#tab_specs" data-bs-toggle="tab" className="nav-link active">Projects</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" data-bs-target="#tab_warranty" data-bs-toggle="tab" className="nav-link">Clients</a>
                    </li>
                </ul>
            </header>
            <div className="tab-content">
                <article id="tab_specs" className="tab-pane show card-body">
                    <table className="table border table-hover" id="Specifications">
                       <thead>
                            <tr>
                                <th className="text-center">Sr.</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Status</th>
                            </tr>
                       </thead>
                       <tbody>
                        {CompanyData !== null && CompanyData.clientsCompany.length > 0 ? (
                            CompanyData.clientsCompany.map((client, index) => (
                            <tr className="border" key={index}>
                                <td className="border text-center">{index + 1}</td>
                                <td className="border text-center">{client.name}</td>
                                <td className="border text-center">{client.email}</td>

                                {client.isActive ? (
                                <td className="border text-center">
                                    <i
                                    className="fa fa-check"
                                    title="Active"
                                    style={{ fontSize: '24px', color: 'green' }}
                                    ></i>
                                </td>
                                ) : (
                                <td className="border text-center">
                                    <i
                                    className="fa fa-ban"
                                    title="Blocked"
                                    style={{ fontSize: '24px', color: 'red' }}
                                    ></i>
                                </td>
                                )}
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan={3} align="center">
                                No Data Found
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className="mb-5 mt-5" id="paginationContainer1"></div>
                </article>

                <article id="tab_warranty" className="tab-pane active card-body">
                    <div className="row">
                            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                <div className="datatable-container">
                                    <table id="data-table" className="datatable-table">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Sr.</th>
                                            <th className="text-center">Projects</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Created On</th>
                                            <th className="text-center">TimeLogs</th>
                                            <th className="text-center">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody id="dataContainer">
                                        {CompanyData !== null && CompanyData.companyProjects.length > 0 ? ( 
                                            CompanyData.companyProjects.map((projects,index) => (
                                                <tr key={index}>
                                                    <td className="border text-center">{index+1}</td>
                                                    <td className="border text-center">{projects.name}</td>
                                                    <td className="border text-center">
                                                        {projects.employeesProjects && projects.employeesProjects.length == 0 
                                                            ? 'Un-Assigned'
                                                            :'Assigned'}
                                                        </td>
                                                    <td className="border text-center">{projects.createdOn}</td>
                                                    {projects.employeesProjects && projects.employeesProjects.length == 0 
                                                        ?   <td className="border text-center"></td>
                                                        :   <td className="border text-center"><a onClick={()=>CheckTimeLogbyAdmin(projects.id)} className="btn btn-outline-info"><span><i className="fa fa-solid fa-list" style={{fontsize:'24px'}}></i></span></a></td>
                                                    }

                                                    <td className="border text-center"><a onClick={()=>ProjectDetails(projects.id)} className="btn btn-outline-warning"><span><i className="fa fa-pencil" style={{fontsize:'24px'}}></i></span></a></td>
                                                </tr>
                                            ))):
                                            (
                                                <tr><td colSpan={7} align="center">No Data Found</td></tr>
                                            )}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                         <div className="mb-5 mt-5" id="paginationContainer"></div>
                    </div>
                </article>
            </div>
            </div>
        </div>
    )
}
export default CompanyDetail;