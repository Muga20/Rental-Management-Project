import React, { createContext, useReducer, useEffect, ReactNode } from "react";

// Define the type for the state
interface AuthState {
  user: any; // Change 'any' to the type of your user object
}

// Define the type for the action
type AuthAction = { type: "LOGIN"; payload: any } | { type: "LOGOUT" };

// Create an AuthContext for global state management
export const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> }>({
  state: { user: null },
  dispatch: () => null,
});

// Create a reducer function to update the state based on the action type
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      // If the action type is 'LOGIN', update the state with the payload (user data)
      return { user: action.payload };

    case "LOGOUT":
      // If the action type is 'LOGOUT', clear the "user" cookie
      document.cookie = "xx_tgk=; path=/; secure; samesite=strict; httponly"; // Add HttpOnly and Secure attributes
      return { user: null };

    default:
      // If the action type is not recognized, return the current state
      return state;
  }
};

// Define the type for AuthContextProvider props
interface AuthContextProviderProps {
  children: ReactNode;
}

// Create an AuthContextProvider component to wrap the application and provide authentication context
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  // Initialize the state and dispatch function using the authReducer
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    // Check if there's a user cookie and update the state if found
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("xx_tgkr=")) {
        const user = JSON.parse(cookie.substring("xx_tgk=".length, cookie.length));
        dispatch({ type: "LOGIN", payload: user });
        break; // Only handle the first "user" cookie
      }
    }
  }, []);

  return (
    // Provide the AuthContext with the current state and dispatch function to the wrapped components
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
