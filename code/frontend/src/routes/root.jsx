import React from "react";
import { Outlet } from "react-router-dom";

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