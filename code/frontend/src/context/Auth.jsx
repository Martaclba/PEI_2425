import { createContext, useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/*
This authentication context will hold 
information about whether a user is logged in, 
and based on this you can decide if they are 
allowed to see specific pages
*/

const AuthContext = createContext(null);

// Create the Authentication Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const navigate = useNavigate();

    // Login function to authenticate and set user role
    const login = (email, password, role) => setUser({ email, password, role });
    
    // Logout function to clear user and navigate to login
    const logout = () => setUser(null);

    // Helper functions for role checking
    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a hook for using the context within React components
export const useAuth = () => useContext(AuthContext)

export const ProtectedRoute = ({ requiredRole, children }) => {
    const { user } = useAuth();
  
    // console.log("AAAAAAA ", user, requiredRole)

    if (!user) {
        return <Navigate to="/login" replace/>
    }
  
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace/>
    }
  
    return children || <Outlet />;
};
