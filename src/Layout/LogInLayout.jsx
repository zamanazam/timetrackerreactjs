import React from 'react'
import { Outlet } from 'react-router-dom'
import Alert from '../Components/Alert'

function LogInLayout() {
  return (
    <>
        <Outlet />
    </>
  )
}

export default LogInLayout