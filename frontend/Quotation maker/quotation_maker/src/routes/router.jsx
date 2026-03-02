import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../App";
import Createquotation from "../Quotation/Createquotation";
import ViewEditSearch from "../Quotation/ViewEditSearch";
import Login from "../Authorisation/Login";
import Signup from "../Authorisation/Signup";
import ProtectedRoute from "./ProtectedRoute";
import PreviewQuotation from "../component/PreviewQuotation";
import MyProfile from "../profile/MyProfile";
import TaxInvoice from "../component/TaxInvoice";
import CreateEditInvoice from "../Invoice/CreateEditInvoice";
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
      {
        path: "/preview_quote",
        element: <PreviewQuotation />,
      },
      {
        path:"/profile",
        element:<MyProfile/>
      },
      {
path:"/preview_invoice",
        element:<TaxInvoice/>
      },
      {
        path:"/create_invoice",
        element:<CreateEditInvoice/>
      }
    ],
  },
]);

export default router;
