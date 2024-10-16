import './App.css'
import Sidebar from './components/Sidebar'
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";

import Root from "./routes/root"
import ErrorPage from './pages/Error'

import Delegados from './pages/Delegados'

const router = createBrowserRouter([
  {
    path: "/",
    //element: <div>Hello, World!</div>
    element: <Root/>,
    errorElement: <ErrorPage />,
  },

  {
    path: "delegados/",
    element: <Delegados />
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);