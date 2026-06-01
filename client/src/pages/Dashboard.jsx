import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet} from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

const Dashboard = () => {

    const {loading: authLoading} = useSelector( (state) => state.auth );
    const {loading: profileLoading} = useSelector( (state) => state.profile );



    if(profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }


  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] bg-slate-900'>
        <Sidebar />
        <div className='flex-1 overflow-auto bg-slate-900'>
            <div className='py-10 px-4 md:px-8'>
                <Outlet /> {/* all childrens of this dashboard component will render here */}
            </div>
        </div>
    </div>
  )
}

export default Dashboard