import './App.css'
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";

import Root from "./routes/root"
import { AuthProvider } from './context/Auth';
import Error from './pages/Error'
import { ProtectedRoute } from './context/Auth';
import Unhautorized from './pages/Unhautorized';

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
    errorElement: <Error />,
    
    children: [
      { index: true, element: <ProtectedRoute><Vendas /></ProtectedRoute>,},

      /* Routes */
      {
        path: "delegados/",
        element: <ProtectedRoute requiredRole="admin"><Delegados /></ProtectedRoute>,
      },
      {
        path: "delegados/registar/",
        element: <ProtectedRoute requiredRole="admin"><RegistarDelegado /></ProtectedRoute>,
      },
      {
        path: "delegados/:key",
        element: <ProtectedRoute requiredRole="admin"><EditarDelegado /></ProtectedRoute>,
      },

      {
        path: "medicos/",
        element: <ProtectedRoute><Medicos /></ProtectedRoute>
      },
      {
        path: "medicos/registar/",
        element: <ProtectedRoute requiredRole="admin"><RegistarMedico /></ProtectedRoute>,
      },
      {
        path: "medicos/:key",
        element: <ProtectedRoute><EditarMedico /></ProtectedRoute>,
      },

      {
        path: "farmacias/",
        element: <ProtectedRoute><Farmacias /></ProtectedRoute>
      },
      {
        path: "farmacias/registar/",
        element: <ProtectedRoute requiredRole="admin"><RegistarFarmacia /></ProtectedRoute>,
      },
      {
        path: "farmacias/:key",
        element: <ProtectedRoute><EditarFarmacia /></ProtectedRoute>,
      },
      
      {
        path: "visitas/",
        element: <ProtectedRoute requiredRole="user"><Visitas /></ProtectedRoute>
      },
    ],
  },
  {
    path: "/login/",
    element: <Login />,
  },
  {
    path: "/unauthorized/",
    element: <Unhautorized />,
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);