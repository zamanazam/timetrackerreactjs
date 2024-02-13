import { apiUrl } from "../GlobalFile";
import axios from "axios";
const token = sessionStorage.getItem('Token');
const headers = new Headers();
headers.append('Authorization', 'Bearer ' + token);
headers.append('Content-Type', 'application/json');

const GetCompanies = async (inputs) => {
    const newUrl = apiUrl + '/Company/GetAllComapnies';
    const url = new URL(newUrl);
    url.searchParams.append('Page', inputs.Page);
    url.searchParams.append('PageSize', inputs.PageSize);

    const options = {
        method: 'GET',
        headers: headers,
    };

    const response = await fetch(url, options);
    return await response.json();
};

const SaveCompany = async (AddCompanyDTO) => {
        const url = apiUrl + '/Company/AddNewCompany';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(AddCompanyDTO),
        });
        return await response.json();
};

const GetCompanyDetail = async (companyId)=>{
        const url = new URL(apiUrl + '/Company/GetCompanyDatabyId');
        url.searchParams.append('id', companyId);
        const options = {
            method: 'GET',
            headers: headers,
        };
        var response = await fetch(url,options);
        return await response.json();
};

const UpdateCompany = async (inputs)=>{
    let url = apiUrl + '/Company/UpdateCompanybyId';
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(inputs),
        };
        var response = await fetch(url, options);
        return await response.json();
}

const companyServices = {
    GetCompanies: GetCompanies,
    SaveCompany: SaveCompany,
    GetCompanyDetail:GetCompanyDetail,
    UpdateCompany:UpdateCompany
};

export default companyServices;
