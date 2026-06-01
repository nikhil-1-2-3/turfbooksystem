import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
// import { setEditCourse } from '../../../slices/courseSlice';

const SidebarLink = ({ link, iconName }) => {

    const Icon = Icons[iconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }


    return (
        <NavLink
            to={link.path}
            className={`py-3 px-4 relative flex items-center md:px-8 text-sm font-medium transition-all duration-300 rounded-xl ${matchRoute(link.path) ? "bg-slate-700 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
        >

            <div className='flex items-center gap-x-3 flex-col md:flex-row'>

                <Icon className="md:text-lg text-2xl" />
                <span className='hidden md:block'>{link.name}</span>
                <span className={`absolute bottom-0 left-0 md:top-0 h-[0.2rem] w-full md:h-full md:w-[0.2rem] bg-blue-500 rounded-full transition-all duration-300
                  ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}>
                </span>
            </div>
        </NavLink>
    )
}

export default SidebarLink