import { useAuth } from '../context/AuthContext';
import { AccountMenu } from './AccountMenu';

export function Header() {
  const { currentUser } = useAuth();

  return (
    <header className={'flex justify-between col-span-2'}>
      <h1 className="text-3xl">
        <a href="/">household finance tracker</a>
      </h1>
      {currentUser !== null && <AccountMenu username={currentUser.username} />}
    </header>
  );
}
