import React,{useEffect,useState}from "react";
import { SuperAdminRoleId, apiUrl } from '../GlobalFile';
import { useNavigate } from 'react-router-dom';

const Companies =({ showAlert })=>{
    const [AllCompanies, setCompaniesData] = useState(null);
    const navigate = useNavigate();
    const currentRoleId = sessionStorage.getItem('RoleId');
        const CompanyDetail =(id)=>{
            debugger
            showAlert('danger', 'Invalid Company ID');
            //    navigate('/Detail/'+id);
        };

        useEffect(() => {
            const controller = new AbortController();
            const signal = controller.signal;
            const GetAllCompanies = async (Page = 1) => {
                const token = sessionStorage.getItem('Token');
                const newUrl = apiUrl + '/Company/GetAllComapnies';
                if (Page == null) Page = 1;
    
                const PageSize = 10;
    
                const url = new URL(newUrl);
                url.searchParams.append('Page', Page);
                url.searchParams.append('PageSize', PageSize);
    
                const headers = new Headers();
                headers.append('Authorization', 'Bearer ' + token);
                headers.append('Content-Type', 'application/json');
    
                const options = {
                    method: 'GET',
                    headers: headers,
                };
    
                try {
                    const response = await fetch(url, options,{signal});
                    const data = await response.json();
                    console.log('data', data.results);
                    setCompaniesData(data.results);
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            GetAllCompanies();
            
            return () => {
                controller.abort();
            };
        },[]);
        
    return (
        <>
         <div className="container-fluid px-4">
                <h1 className="mt-4">Companies</h1>
            <div className="row mb-4">
                <div>
                    <button className="btn btn-warning float-end"><span className="me-2"><i className="fa fa-plus"></i></span>Company</button>
                </div>
            </div>
            <div className="row mb-4">
                {AllCompanies !== null ? ( 
                    AllCompanies.map((company,index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-5" key={index}>
                            <div className="card" onClick={()=>CompanyDetail(company.id)}>
                                <div className="card-header">
                                    <div className="d-flex">
                                        <h4>{company.name}</h4>
                                    </div>
                                </div>
                                <div className="card-body bg-gradient"></div>
                                <div className="card-footer">
                                        <div className="d-flex border">
                                                <p className="ms-3 mt-1">Clients :</p>
                                                <h5 className="ms-5 mt-1">{company.totalClients}</h5>
                                        </div>
                                        <div className="d-flex border mt-3">
                                                <p className="ms-3 mt-1">Projects :</p>
                                                <h5 className="ms-5 mt-1">{company.totalProjects}</h5>
                                        </div>
                                </div>
                            </div>
                        </div>
                    ))
                ):
                ('No Data Found')}
            </div>
        </div> 
        </>
    )
}
export default Companies;



// const [AllCompanies, setCompaniesData] = useState(null);
// const navigate = useNavigate();
// const currentRoleId = sessionStorage.getItem('RoleId');

    // const GetAllCompanies = async (Page = 1) => {
    //         debugger
    //     const token = sessionStorage.getItem('Token');
    //     const newUrl = apiUrl + '/Company/GetAllComapnies';
    //     if (Page == null) Page = 1;
    
    //     const PageSize = 10;
    
    //     const url = new URL(newUrl);
    //     url.searchParams.append('Page', Page);
    //     url.searchParams.append('PageSize', PageSize);
    
    //     const headers = new Headers();
    //     headers.append('Authorization', 'Bearer ' + token);
    //     headers.append('Content-Type', 'application/json');
    
    //     const options = {
    //         method: 'GET',
    //         headers: headers,
    //     };
    
    //     fetch(url, options)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('data',data.results);
    //                 setCompaniesData(data.results);
    //         })
    //         .catch((error) => {
    //         console.error('Error:', error);
    //         });
    //     };
   
    // const CompanyDetail =(id)=>{
    //       navigate('/Detail/'+id);
    // };

    // useEffect(() => {
    //     GetAllCompanies();
    // },[]);