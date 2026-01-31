import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../App";
import Createquotation from "../Quotation/Createquotation";
import ViewEditSearch from "../Quotation/ViewEditSearch";
import Login from "../Authorisation/Login";
import Signup from "../Authorisation/Signup";
import ProtectedRoute from "./ProtectedRoute";
const router = createBrowserRouter([
   {
        path: "/",
        element: <Home />,
      },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // 🔒 Protected routes
  {
    element: <ProtectedRoute />,
    children: [
     
      {
        path: "/quote_make",
        element: <Createquotation />,
      },
      {
        path: "/view_quote",
        element: <ViewEditSearch />,
      },
    ],
  },
]);


export default router;
