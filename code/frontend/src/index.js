import './App.css'
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";

import Root from "./routes/root"
import ErrorPage from './pages/Error'

import Vendas from './pages/Vendas';
import Delegados from './pages/Delegados'
import Medicos from './pages/Medicos'
import Farmacias from './pages/Farmacias'
import EditarDelegado from "./pages/EditarDelegado"
import RegistarDelegado from "./pages/RegistarDelegado"
import RegistarFarmacia from './pages/RegistarFarmacia';
import RegistarMedico from './pages/RegistarMedico';
import EditarFarmacia from './pages/EditarFarmacia';
import EditarMedico from './pages/EditarMedico';
import Login from './pages/Login';
import Visitas from './pages/Visitas';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    
    children: [
      { index: true, element: <Vendas />},

      /* Routes */
      {
        path: "delegados/",
        element: <Delegados />,
      },
      {
        path: "delegados/registar/",
        element: <RegistarDelegado />,
      },
      {
        path: "delegados/detalhes/:key",
        element: <EditarDelegado />,
      },

      {
        path: "medicos/",
        element: <Medicos />,
      },
      {
        path: "medicos/registar/",
        element: <RegistarMedico />,
      },
      {
        path: "medicos/detalhes/:key",
        element: <EditarMedico />,
      },

      {
        path: "farmacias/",
        element: <Farmacias />,
      },
      {
        path: "farmacias/registar/",
        element: <RegistarFarmacia />,
      },
      {
        path: "farmacias/detalhes/:key",
        element: <EditarFarmacia />,
      },
      
      {
        path: "visitas/",
        element: <Visitas />,
      },
    ],
  },
  {
    path: "/login/",
    element: <Login />,
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);