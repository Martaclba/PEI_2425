import { Outlet } from "react-router-dom";
// import { LuStethoscope, LuCross } from "react-icons/lu";
// import { IoPeopleOutline } from "react-icons/io5";
// import { BsGraphUpArrow } from "react-icons/bs";
// import { RiLogoutBoxRLine } from "react-icons/ri";

import Sidebar from "../components/Sidebar";


function Root() {
  return (
    <>
      <Sidebar />

      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Root;