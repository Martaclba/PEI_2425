import { createContext, useContext, useReducer } from "react";
import { Navigate, Outlet } from "react-router-dom";

/*
This authentication context will hold 
information about whether a user is logged in, 
and based on this you can decide if they are 
allowed to see specific pages
*/

const AuthContext = createContext(null);

// Reducer function that determines how the authentication state should change in response to different actions.
// State -> current state
const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return { 
            ...state, 
            isAuthenticated: true,
            userID: action.userID,
            isAdmin: action.isAdmin,
            token: action.token 
        };
      case "LOGOUT":
        return { 
            ...state, 
            isAuthenticated: false,
            userID: null,
            isAdmin: null,            
            token: null 
        };
      default:
        // Return the current state
        return state;
    }
};
   
const AuthProvider = ({ children }) => {
    // It takes two arguments, the "authReducer" to be called by, in this cases, "dispatch" and the inital authentication state
    const [state, dispatch] = useReducer(authReducer, { isAuthenticated: false, userID: null, isAdmin: null, token: null });
   
    const login = (userID, isAdmin, token) => dispatch({ type: "LOGIN", userID, isAdmin, token });
    const logout = () => dispatch({ type: "LOGOUT" });
   
    return (
      <AuthContext.Provider value={{ state, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

// Create a hook for using the context within React components
const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const ProtectedRoute = ({ isAdmin, children }) => {
    const { state } = useAuth();
  
    // If the user is not authenticated, redirect it to the login page
    if (!state.isAuthenticated) {
        return <Navigate to="/login" replace/>
    }
  
    // The user doesnt have access to a certain page
    if (isAdmin !== undefined && isAdmin !== state.isAdmin) {
        return <Navigate to="/unauthorized" replace/>
    }
  
    return children || <Outlet />;
};

export { AuthProvider, useAuth, ProtectedRoute };