import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const UseAuthContext = () => {
  // Use the useContext hook to get the value of AuthContext.
  const context = useContext(AuthContext);

  if (!context) {
    // Check if the context is available. If not, throw an error.
    throw new Error("useAuthContext must be used inside an AuthContextProvider ");
  }
  // Return the context, which contains the values provided by AuthContext.
  return context;
};
