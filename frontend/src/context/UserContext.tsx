import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { Payer } from '../components/UserDashboard/ConfigurePayers';
import { jwtDecode } from 'jwt-decode';
import { TransactionCategory } from '../data';

export type UserData = {
  id: number;
  username: string;
  iat: number;
  exp: number;
  settings?: unknown;
};

export interface UserContextType {
  updatedPayers: () => Promise<Payer[]>;
  updatedCategories: () => Promise<TransactionCategory[]>;
  userPayersSettings: Payer[] | null;
  userCategoriesSettings: TransactionCategory[] | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [userPayersSettings, setUserPayersSettings] = useState(null);
  const [userCategoriesSettings, setUserCategoriesSettings] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const setUserSettings = async () => {
      const latestPayers = await updatedPayers();
      const latestCategories = await updatedCategories();
      setUserPayersSettings(latestPayers);
      setUserCategoriesSettings(latestCategories);
      localStorage.setItem('payers', JSON.stringify(latestPayers));
      localStorage.setItem('categories', JSON.stringify(latestCategories));
    };

    const payers = localStorage.getItem('payers');
    const categories = localStorage.getItem('categories');
    if (payers && categories) {
      try {
        setUserPayersSettings(JSON.parse(payers));
        setUserCategoriesSettings(JSON.parse(categories));
      } catch (err) {
        console.log('Error parsing userSettings from localStorage');
      }
    } else {
      setUserSettings();
    }
  }, []);

  const updatedPayers = async () => {
    const latestPayers = await fetch('/settings/payers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const payersResponse = await latestPayers.json();
    setUserPayersSettings(payersResponse);
    localStorage.setItem('payers', JSON.stringify(payersResponse));
    return payersResponse;
  };

  const updatedCategories = async () => {
    const latestCategories = await fetch('/settings/categories', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const latestCategoriesResponse = await latestCategories.json();
    setUserCategoriesSettings(latestCategoriesResponse);

    return latestCategoriesResponse;
  };

  const value = {
    updatedPayers,
    updatedCategories,
    userPayersSettings,
    userCategoriesSettings,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
