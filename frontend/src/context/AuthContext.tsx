import React, { createContext, useState, useContext, ReactNode } from 'react'
// import jwt_decode from 'jwt-decode';

interface AuthContextType {
    currentUser: any;
    login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

type Props = {
    children: ReactNode;
}

type UserData = {
    username: string;
    token: string;
}

export function AuthProvider({ children }: Props) {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);

    const login = async (username: string, password: string) => {
        const response = await fetch('auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'content-type': 'application/json'
            }
        })

        if (!response.ok) throw new Error('Login failed')
        const data = await response.json();
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        setCurrentUser({username: data.username, token: data.token})
    }

    const value = {
        currentUser,
        login,
    }

    return (
        <AuthContext.Provider
            value={value}
        >
            { children }
        </AuthContext.Provider>
    )
}

