import React, { useState, useCallback, useEffect } from 'react';
import { Button, Link, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!username || !password) return;
      try {
        await login(username, password);
        navigate('/');
      } catch (err) {
        console.log(err);
        alert('login failure');
      }
    },
    [username, password],
  );

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col gap-y-2 p-4 h-screen w-screen items-center">
      <h1 className="text-xl mb-2">Sign in</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 w-fit">
        <TextField
          required
          label="Username"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => setUsername(e.target.value)}
          value={username}
        />
        <TextField
          required
          type="password"
          label="Password"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          disabled={!username || !password}
          type="submit"
          className="shrink"
          variant="contained"
        >
          Sign in
        </Button>
      </form>
      <div>
        <Link href="/register">Create account</Link>
      </div>
    </div>
  );
}
