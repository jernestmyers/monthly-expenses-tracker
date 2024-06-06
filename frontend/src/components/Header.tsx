import { useAuth } from '../context/AuthContext';
import { AccountMenu } from './AccountMenu';

type Props = {
  additionalClassNames?: string;
};

const BASE_CLASSNAMES = 'w-full flex justify-between';

export function Header({ additionalClassNames }: Props) {
  const { currentUser } = useAuth();
  const finalClassNames = additionalClassNames
    ? BASE_CLASSNAMES.concat(' ' + additionalClassNames)
    : BASE_CLASSNAMES;

  return (
    <header className={finalClassNames}>
      <h1 className="text-3xl">
        <a href="/">household finance tracker</a>
      </h1>
      {currentUser !== null && <AccountMenu username={currentUser.username} />}
    </header>
  );
}
