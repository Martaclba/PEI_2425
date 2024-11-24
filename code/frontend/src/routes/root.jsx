import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FloatButton } from "antd";
import Sidebar from "../components/Sidebar";
import { RiRobot2Line } from "react-icons/ri";
import { HiOutlineX } from "react-icons/hi";

import Chatbot from "../pages/Chatbot";

function Root() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>

      <div id="detail">
        <Outlet />
      </div>
    
      {isChatbotVisible && (
        <div style={{width: '60%', paddingLeft: isOpen ? '222px' : '100px', transition: 'all 0.5s ease'}}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '0.5rem'
          }}>
            <button
              onClick={toggleChatbot}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#333',
                marginTop: '2rem',
                boxShadow: 'none'
              }}
            >
              <HiOutlineX />
            </button>
          </div>

          <div>
            <Chatbot />
          </div>
                
        </div>
      )}

      {!isChatbotVisible && (
        <FloatButton
          icon={<RiRobot2Line style={{ color: "#b24d51" }} />}
          type="default"          
          onClick={toggleChatbot}
        />
      )}
    </>
  )
}

export default Root;