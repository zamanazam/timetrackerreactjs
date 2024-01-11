import React from 'react'
import { Outlet } from 'react-router-dom'
import Alert from '../Components/Alert'



// useEffect(()=>{
//   toggleFunction();
// },[])
    // const toggleFunction = ()=>{
    //       debugger
    //       const sidebarToggle = document.body.querySelector('#sidebarToggle');
    //       if (sidebarToggle) {
    //           sidebarToggle.addEventListener('click', function(event) {
    //               event.preventDefault();
    //               document.body.classList.toggle('sb-sidenav-toggled');
    //               localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    //           });
    //       }
    // }

function LogInLayout() {
  return (
    <>
        <Outlet/>
    </>
  )
}

export default LogInLayout