import { CartContext } from "../context/CartContext";
import { useContext } from "react";

export const UseCartContext = () => {
  // Use the useContext hook to get the value of CartContext.
  const context = useContext(CartContext);

  // Check if the context is available. If not, throw an error.
  if (!context) {
    throw new Error("useCartContext must be used inside a CartContextProvider ");
  }

  // Return the context, which contains the values provided by CartContext.
  return context;
};
