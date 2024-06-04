import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom'

export function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const onClick = useCallback(
        async () => {
            try {
                logout();
                navigate('/login')
            } catch (err) {
                console.error(err)
            }
        },
        [logout]
    ) 

    return (
        <header className={"flex justify-between col-span-2"}>
            <h1 className="text-3xl">household finance tracker</h1>
            { currentUser !== null && (
                <div className="flex gap-x-4 items-center">
                    Hello, {currentUser.username}!
                    <Button variant="contained" onClick={onClick}>Sign out</Button>
                </div>
            )}
        </header>
    )
}