import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operation/authApi"

export default function ProfileDropdown({ closeMobileMenu }) {
  const { user, profileImage } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null);



  useOnClickOutside(ref, () => setOpen(false))  // this hook is used for when we click anywhere on the screen then that dropdown will automatically closed.

  if (!user) {
    console.log("no user");
    localStorage.setItem("token", null);
    return null;
  }

  return (
    <div className="relative cursor-pointer z-[60]" ref={ref}>
      <div className="flex items-center gap-x-1" onClick={() => setOpen(!open)}>
        <img
          src={profileImage}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[35px] rounded-full object-cover border-2 border-slate-700"
        />
        <AiOutlineCaretDown className="text-sm text-slate-300" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full mb-2 md:bottom-auto md:top-[118%] right-0 md:-right-8 z-[1000] divide-y-[1px] divide-slate-800 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl w-48"
        >
          <Link to="/dashboard/my-profile" onClick={() => { setOpen(false); if(closeMobileMenu) closeMobileMenu(); }}>
            <div className="flex w-full items-center gap-x-3 py-[14px] px-[16px] text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">
              <VscDashboard className="text-xl" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
              if(closeMobileMenu) closeMobileMenu();
            }}
            className="flex w-full items-center gap-x-3 py-[14px] px-[16px] text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer font-medium"
          >
            <VscSignOut className="text-xl" />
            Logout
          </div>
        </div>
      )}
    </div>
  )
}