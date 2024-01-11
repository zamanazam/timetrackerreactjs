import React from "react"; 
export const apiUrl = "https://localhost:7270";
//export const apiUrl = "https://employees.meshlogixsolutions.com";
export const SuperAdminRoleId = "1";
export const AdminRoleId = "2";
export const EmployeeRoleId = "3";
export const ClientRoleId = "4";
export const statusArray = [{ id: true, name: "Active" }, { id: false, name: "Block" }];
export const paginationArray = [{id: 5, name: 5},{id: 10, name: 10},{id: 25, name: 25},{id: 50, name: 50},{id: 100, name: 100}]
export const getPagesTags = (totalPages = 0) => {
                                            let page = 1;
                                            var pages = [];
                                            while (totalPages >= page) {
                                                pages.push(page);
                                                page++;
                                            }
                                            return pages;
                                        };

export const getEntriesOfPagination = (pageSize, page, total)=> {
    var entriesShouldBe = pageSize * page;
    if (entriesShouldBe > total) {
        return total;
    }
    else {
        return entriesShouldBe;
    }
};
export const getStartPointOfPagination = (pageSize, page)=> {
    return ((pageSize * page) - pageSize) + 1;
};

