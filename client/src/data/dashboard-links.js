import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/owner",
    type: ACCOUNT_TYPE.OWNER,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Turf",
    path: "/dashboard/my-turfs",
    type: ACCOUNT_TYPE.OWNER,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Turf",
    path: "/dashboard/add-turf",
    type: ACCOUNT_TYPE.OWNER,
    icon: "VscAdd",
  },
  // {
  //   id: 5,
  //   name: "Booked Turf",
  //   path: "/dashboard/buy-turfs",
  //   type: ACCOUNT_TYPE.USER,
  //   icon: "VscMortarBoard",
  // },
  {
    id: 5,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.USER,
    icon: "VscHistory",
  },
  {
    id: 6,
    name: "Admin Panel",
    path: "/dashboard/admin-panel",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscHistory",
  },
];