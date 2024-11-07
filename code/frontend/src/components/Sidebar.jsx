import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuStethoscope, LuCross } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineMenu, HiOutlineMenuAlt3 } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLocationOn } from "react-icons/md";

import "../styles/sidebar.css"
import { useAuth } from "../context/Auth";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth()

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    useEffect(() => {
      const closeBtn = document.querySelector("#btn");
      if (closeBtn) {
        closeBtn.classList.replace(
          isOpen ? "bx-menu" : "bx-menu-alt-right",
          isOpen ? "bx-menu-alt-right" : "bx-menu"
        );
      }
    }, [isOpen]);

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="logo-details">
                <img src="../../mypharma-logo-white.png" alt="" className="icon" style={{height:'30px', width:'120px', paddingInlineStart: '18px'}}/>
                
                <i className="bx bx-menu" id="btn" onClick={toggleSidebar}>
                    {isOpen ? <HiOutlineMenuAlt3/> : <HiOutlineMenu/>}                    
                </i>
            </div>

            <ul className="nav-list">
                <li>
                    <Link to={`/`}>
                        <i><RxDashboard /></i>
                        <span className="links_name">Vendas</span>
                    </Link>
                    <span className="tooltip">Vendas</span>
                </li>
                <li>
                    <Link to={`/delegados/`}>
                        <i className="bx bx-user"><IoPeopleOutline /></i>
                        <span className="links_name">Delegados</span>
                    </Link>
                    <span className="tooltip">Delegados</span>
                </li>
                <li>
                    <Link to={`/visitas/`}>
                        <i className="bx bx-user"><MdOutlineLocationOn /></i>
                        <span className="links_name">Visitas</span>
                    </Link>
                    <span className="tooltip">Visitas</span>
                </li>
                <li>
                    <Link to={`/medicos/`}>
                        <i className="bx bx-chat"><LuStethoscope /></i>
                        <span className="links_name">Médicos</span>
                    </Link>
                    <span className="tooltip">Médicos</span>
                </li>
                <li>
                    <Link to={`/farmacias/`}>
                        <i className="bx bx-pie-chart-alt-2"><LuCross /></i>
                        <span className="links_name">Farmácias</span>
                    </Link>
                    <span className="tooltip">Farmácias</span>
                </li>
                
                <li className="profile">
                    <div className="profile-details">                        
                        <i className="bx bx-pie-chart-alt-2"><CgProfile /></i>
                        <div className="name_job">
                            <div className="name">Rui Correia</div>
                            <div className="job">Delegado</div>
                        </div>
                    </div>
                    <div className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <i className="bx bx-log-out" id="log_out"><TbLogout2 /></i>
                        <span className="links_name">Logout</span>
                    </div>
                </li>
            </ul>
      </div>
    )
}
  
export default Sidebar;