import { Navigate } from "react-router-dom";


export const ProtectRoute = ({ children }) => {
    if (!localStorage.getItem('user')) {
        return <Navigate to='/login' replace></Navigate>;
    }
    return children;
}

export const ProtectRoute2 = ({ children }) => {
    if (localStorage.getItem('user')) {
        return <Navigate to='/home' replace></Navigate>;
    }
    return children;
}