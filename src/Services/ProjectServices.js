import { apiUrl } from "../GlobalFile";
import axios from "axios";
const token = sessionStorage.getItem('Token');
const headers = new Headers();
headers.append('Authorization', 'Bearer ' + token);
headers.append('Content-Type', 'application/json');

const SaveProject = async (inputs)=>{
    const url = apiUrl + '/Project/AddNewProjects';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        });
        return await response.json();
};

const GetProjectDetails = async (id)=>{
    const url = new URL(apiUrl + '/Project/GetProjectDetailsbyId');
        url.searchParams.append('id', id);
        const options = {
            method: 'GET',
            headers: headers,
        };
        var response = await fetch(url,options);
        return await response.json();
};

const UpdateProject = async (inputs)=>{
    debugger
    const url = new URL(apiUrl + '/Project/UpdateProjectbyIdandAsignee');
    const options = {
        method: 'POST',
        headers: headers,
        body:JSON.stringify(inputs),
    }
    var response = await fetch(url,options);
    return response.json();
}

const AssignProject = async (inputs)=>{
    debugger
    const options = {
        method: 'POST',
        headers: headers,
        body:JSON.stringify(inputs),
    }
    var response = await fetch(url,options);
    return response.json();
}
const projectServices = {
    SaveProject:SaveProject,
    GetProjectDetails:GetProjectDetails,
    UpdateProject:UpdateProject,
};
export default projectServices;