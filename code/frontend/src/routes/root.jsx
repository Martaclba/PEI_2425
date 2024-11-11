import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function Root() {

  // Temporary
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_PATH  + "/")
      .then((res) => {
        console.log("Fetched data:", res.data);
      })
      .catch((error) => {
        console.error("Fetch error:", error)
      });
  }, []);

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