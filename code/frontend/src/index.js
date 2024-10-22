import './App.css'
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";

import Root from "./routes/root"
import ErrorPage from './pages/Error'

import Delegados from './pages/Delegados'
import Medicos from './pages/Medicos'
import Farmacias from './pages/Farmacias'
import EditarDelegado from "./pages/EditarDelegado"
import RegistarDelegado from "./pages/RegistarDelegado"
import RegistarFarmacia from './pages/RegistarFarmacia';
import RegistarMedico from './pages/RegistarMedico';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    
    children: [
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
        path: "farmacias/",
        element: <Farmacias />,
      },
      {
        path: "farmacias/registar/",
        element: <RegistarFarmacia />,
      },

      {
        path: "vendas/",
        element: <EditarDelegado />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);