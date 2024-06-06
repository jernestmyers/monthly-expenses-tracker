import { useAuth } from '../context/AuthContext';
import { AccountMenu } from './AccountMenu';

type Props = {
  className: string;
};

export function Header({ className }: Props) {
  const { currentUser } = useAuth();

  return (
    <header className={className}>
      <h1 className="text-3xl">
        <a href="/">household finance tracker</a>
      </h1>
      {currentUser !== null && <AccountMenu username={currentUser.username} />}
    </header>
  );
}
