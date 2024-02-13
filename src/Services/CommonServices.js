import { apiUrl } from "../GlobalFile";
var token = sessionStorage.getItem('Token');
var headers = new Headers();
headers.append('Authorization', 'Bearer ' + token);
headers.append('Content-Type', 'application/json');

const HttpGet = async (inputs,inputUrl)=>{
        const params = new URLSearchParams(inputs);
        const url = new URL(apiUrl + inputUrl);
        if(inputs != null){
            url.search = params.toString();
        }
        const options = {
            method: 'GET',
            headers: headers,
        };
        var response = await fetch(url,options);
        return await response.json();
};

const HttpGetbyId =async (id,inputUrl)=>{
    const url = new URL(apiUrl + inputUrl);
    url.searchParams.append('id', id);
        const options = {
            method: 'GET',
            headers: headers,
        };
        var response = await fetch(url,options);
        return await response.json();
}

const HttpPost = async(inputs,inputUrl)=>{
    const url = new URL(apiUrl + inputUrl);
    const options = {
        method: 'POST',
        headers: headers,
        body:JSON.stringify(inputs),
    }
    var response = await fetch(url,options);
    return await response.json();
};

const HttpDelete = async(inputs,inputUrl)=>{
    const url = new URL(apiUrl + inputUrl);
    const options={
        method: 'Delete',
        headers: headers,
        body:JSON.stringify(inputs),
    }
    var response = await fetch(url,options);
    return await response.json();
}

const commonServices = {
    HttpGet:HttpGet,
    HttpPost:HttpPost,
    HttpDelete:HttpDelete,
    HttpGetbyId:HttpGetbyId,
};
export default commonServices;