import React, { useState, useCallback} from 'react'
import {
    Button,
    TextField,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: {pathname: "/"}}

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!username || !password) return;
            try {
                await login(username, password)
                navigate(from)
            } catch (err) {
                console.log(err)
                alert("login failure")
            }
        },
        [username, password]
    )
    
    return (
        <div className="flex flex-col gap-y-2 p-4 h-screen w-screen">
            <h1 className="text-xl mb-2">Sign in</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-fit">
                <div className="flex gap-4 flex-wrap">
                    <TextField
                        required
                        label="Username"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUsername(e.target.value)}
                        value={username}
                    />
                    <TextField
                        required
                        type="password"
                        label="Password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <Button disabled={!username || !password} type="submit" className="shrink" variant="contained">Sign in</Button>
            </form>
        </div>
    )
}