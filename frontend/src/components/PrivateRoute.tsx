import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';

type Props = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: Props) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser]);

  return <UserProvider>{children}</UserProvider>;
}
