import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Root() {

  // Temporary
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
      })
      .catch((error) => console.error("Fetch error:", error));
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