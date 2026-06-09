import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({children, allowedRoles}) => {
    const {user,loading} = useAuth()

    if(loading) {
        return <h1>Loading......</h1>
    }

    if(!user) {
        return <Navigate to ="/login" /> 
    }

    if(!allowedRoles.includes(user.role)){
        return <Navigate to ="/" />
    }

    return children
}

export default ProtectedRoute