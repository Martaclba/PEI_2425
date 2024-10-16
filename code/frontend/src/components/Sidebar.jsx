
import React from "react";
import { useState } from "react";
import * as FaIcons from "react-icons/fa"

function Sidebar(){
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div className="sidebar">
            <FaIcons.FaBars onClick={showSidebar}/>
        </div>
    )
}

export default Sidebar