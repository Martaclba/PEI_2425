import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import { FloatButton } from 'antd';
import Sidebar from "../components/Sidebar";
import { RiRobot2Line } from "react-icons/ri";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleChatbotClick = () => {
    navigate("/chatbot/"); // Navigate to the chatbot route
  };

  const showFloatButton = location.pathname !== "/chatbot/";

  return (
    <>
      <Sidebar />

      <div id="detail">
        <Outlet />
      </div>
      {showFloatButton && <FloatButton
      icon={<RiRobot2Line style={{color:'#b24d51'}}/>}
      type="default"
      style={{
        insetInlineEnd: 94,
      }}
      onClick={handleChatbotClick}
    />}
    </>
  );
}

export default Root;