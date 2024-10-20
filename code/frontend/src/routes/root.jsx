import { Outlet, Link } from "react-router-dom";
import { LuStethoscope, LuCross } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";

function Root() {
  return (
    <>
      <div id="sidebar">
        
      <div>
        <img src="../../myPharmaImage.png" alt=""
        style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
      </div>
        
        <h1><RiLogoutBoxRLine /></h1>

        <nav>
          <ul>
            <li>
              <div id="sidebar-option">
                <Link to={`/vendas/`}><BsGraphUpArrow />Vendas</Link>
              </div>
            </li>
            <li>
              <div id="sidebar-option">
                <Link to={`/delegados/`}><IoPeopleOutline />Delegados</Link>
              </div>
            </li>
            <li>
              <div id="sidebar-option">
                <Link to={`/medicos/`}><LuStethoscope />Médicos</Link>
              </div>
            </li>
            <li>
              <div id="sidebar-option">
                <Link to={`/farmacias/`}> <LuCross />Farmácias</Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Root;