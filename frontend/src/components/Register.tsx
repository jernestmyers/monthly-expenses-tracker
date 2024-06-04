import React, { useState, useCallback, useEffect } from 'react'
import {
    Button,
    TextField,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [username, setUsername] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const [confirmedPassword, setConfirmedPassword] = useState<string | null>(null)
    const [ error, setError] = useState<string | null>(null)
    const { currentUser, register } = useAuth();
    const navigate = useNavigate();

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!username || !password || !confirmedPassword) return;
            if (password !== confirmedPassword) {
                setError('Passwords do not match. Try again.')
                return;
            }
            try {
                await register(username, password)
                navigate("/")
            } catch (err) {
                console.log(err)
            }
        },
        [username, password, confirmedPassword]
    )

    useEffect(() => {
        if (currentUser) {
            navigate('/')
        }
    }, [currentUser])
    
    return (
        <div className="flex flex-col gap-y-2 p-4 h-screen w-screen items-center">
            <h1 className="text-xl mb-2">Create account</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-fit">
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
                    <TextField
                        required
                        type="password"
                        label="Confirm password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setConfirmedPassword(e.target.value)}
                        value={confirmedPassword}
                    />
                {error && <span>{error}</span>}
                <Button disabled={!username || !password || !confirmedPassword} type="submit" className="shrink" variant="contained">Create account</Button>
            </form>
        </div>
    )
}