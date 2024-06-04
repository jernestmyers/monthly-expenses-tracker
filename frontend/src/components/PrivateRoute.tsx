import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

type Props = {
    children: JSX.Element;
}

export function PrivateRoute({ children }: Props) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/login" } }
    console.log(currentUser, !currentUser)

    
    useEffect(() => {
        if (!currentUser) {
            navigate("/login")
        };
    }, [currentUser])

    return children
}