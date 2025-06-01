import { useContext } from "react";
import { SellerProductContext } from "../context/SellerProductContext";

export const useSellerProduct = () => {
  const context = useContext(SellerProductContext);
  if (!context) {
    throw new Error(
      "useSellerProduct must be used within a SellerProductProvider"
    );
  }
  return context;
};
