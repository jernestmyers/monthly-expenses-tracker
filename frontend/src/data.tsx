import { getUniqueNumericalId } from './utils/getUniqueId';

export type Tab = {
  name: string;
  content: React.ReactNode;
};

export const TABS: Tab[] = [
  {
    name: 'Jan',
    content: <>Stuff</>,
  },
  {
    name: 'Feb',
    content: <>Stuff</>,
  },
  {
    name: 'Mar',
    content: <>Stuff</>,
  },
  {
    name: 'Apr',
    content: <>Stuff</>,
  },
  {
    name: 'May',
    content: <>Stuff</>,
  },
  {
    name: 'Jun',
    content: <>Stuff</>,
  },
  {
    name: 'Jul',
    content: <>Stuff</>,
  },
  {
    name: 'Aug',
    content: <>Stuff</>,
  },
  {
    name: 'Sep',
    content: <>Stuff</>,
  },
  {
    name: 'Oct',
    content: <>Stuff</>,
  },
  {
    name: 'Nov',
    content: <>Stuff</>,
  },
  {
    name: 'Dec',
    content: <>Stuff</>,
  },
];

export type TransactionCategory = {
  id: number | string;
  name: string;
  subcategories?: TransactionSubcategory[];
  isEdited?: boolean;
  isDeleted?: boolean;
};

export type TransactionSubcategory = Omit<
  TransactionCategory,
  'subcategories'
> & {
  parentId: number | string;
};

const RENTAL_CATEGORIES = [
  { id: getUniqueNumericalId(), name: 'Utilities' },
  { id: getUniqueNumericalId(), name: 'Repairs' },
  { id: getUniqueNumericalId(), name: 'Supplies' },
  { id: getUniqueNumericalId(), name: 'Cleaning & maintenance' },
  { id: getUniqueNumericalId(), name: 'Travel' },
  { id: getUniqueNumericalId(), name: 'Improvements' },
];

const COST_BASIS_CATEGORIES = [
  { id: getUniqueNumericalId(), name: 'Improvements' },
  { id: getUniqueNumericalId(), name: 'Maintenance' },
];

const rentalOneId = getUniqueNumericalId();
const rentalTwoId = getUniqueNumericalId();
const rentalThreeId = getUniqueNumericalId();
const homeId = getUniqueNumericalId();

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { id: getUniqueNumericalId(), name: 'Income' },
  { id: getUniqueNumericalId(), name: 'Bills' },
  { id: getUniqueNumericalId(), name: 'Groceries' },
  { id: getUniqueNumericalId(), name: 'Dining/Going Out' },
  { id: getUniqueNumericalId(), name: 'Transportation' },
  {
    id: rentalOneId,
    name: 'Rental 1',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalOneId,
    })),
  },
  {
    id: rentalTwoId,
    name: 'Rental 2',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalTwoId,
    })),
  },
  {
    id: rentalThreeId,
    name: 'Rental 3',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalThreeId,
    })),
  },
  {
    id: homeId,
    name: 'Home',
    subcategories: COST_BASIS_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: homeId,
    })),
  },
  { id: getUniqueNumericalId(), name: 'Miscellaneous' },
  { id: getUniqueNumericalId(), name: 'JM Personal' },
  { id: getUniqueNumericalId(), name: 'SM Personal' },
];

export const TRANSACTION_COLUMNS = [
  'Date',
  'Description',
  'Memo',
  'Amount',
  'Paid by',
];

export type Row = {
  id: string;
  date: string;
  description: string;
  memo: string;
  amount: number;
  paidBy?: string | null;
};

export const data: Row[] = [];

export const FISCAL_YEARS = [2023, 2024];

export const PAYEES = ['SM', 'JM'];
