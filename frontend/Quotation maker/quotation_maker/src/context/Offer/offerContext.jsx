// importing the context
import { createContext, useContext, useState } from "react";

import api from "../../axios/axios";
import { useAuth } from "../Auth/authContext";

const OfferContext = createContext(null);

export const OfferProvider = ({ children }) => {
  const [newoffer, setNewoffer] = useState(null);
  const [offer, setOffer] = useState(null);

 
  const { user } = useAuth();

  // create offer
  const createOffer = async (
    clientName,
    clientEmail,
    clientAddress,
    quoteNumber,
    quoteDate,
    items,
    subtotal,
    taxRate,
    taxAmount,
    notes
  ) => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        
        throw new Error("Please login or signup to create an offer");
      }

      const response = await api.post("/offer/create", {
        clientName,clientEmail,clientAddress,quoteNumber,quoteDate,items,subtotal,taxRate,taxAmount,notes,createdBy: user?.id,
      });

      setNewoffer(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <OfferContext.Provider
      value={{ createOffer, newoffer, setNewoffer, offer, setOffer }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export const useOffer = () => {
  return useContext(OfferContext);
};

