import React from "react";
import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { FloatButton } from 'antd';
import Sidebar from "../components/Sidebar";
import { RiRobot2Line } from "react-icons/ri";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChatbotClick = () => {
    navigate("/chatbot");
  };

  const showFloatButton = location.pathname !== "/chatbot";

  return (
    <>
      <Sidebar />

      <div id="detail">
        <Outlet />
      </div>

      {showFloatButton && 
        <FloatButton
          icon={<RiRobot2Line style={{color:'#b24d51'}}/>}
          type="default"
          style={{
            insetInlineEnd: 94,
          }}
          onClick={handleChatbotClick}
        />
      }
    </>
  );
}

export default Root;