import { getUniqueId } from './utils/getUniqueId';

export type Tab = {
  label: string;
  content: React.ReactNode;
};

export const TABS: Tab[] = [
  {
    label: 'Jan',
    content: <>Stuff</>,
  },
  {
    label: 'Feb',
    content: <>Stuff</>,
  },
  {
    label: 'Mar',
    content: <>Stuff</>,
  },
  {
    label: 'Apr',
    content: <>Stuff</>,
  },
  {
    label: 'May',
    content: <>Stuff</>,
  },
  {
    label: 'Jun',
    content: <>Stuff</>,
  },
  {
    label: 'Jul',
    content: <>Stuff</>,
  },
  {
    label: 'Aug',
    content: <>Stuff</>,
  },
  {
    label: 'Sep',
    content: <>Stuff</>,
  },
  {
    label: 'Oct',
    content: <>Stuff</>,
  },
  {
    label: 'Nov',
    content: <>Stuff</>,
  },
  {
    label: 'Dec',
    content: <>Stuff</>,
  },
];

export type TransactionCategory = {
  id: string;
  label: string;
  subcategories?: TransactionSubcategory[];
};

export type TransactionSubcategory = Omit<
  TransactionCategory,
  'subcategories'
> & {
  parentId: string;
};

const RENTAL_CATEGORIES = [
  { id: getUniqueId(), label: 'Utilities' },
  { id: getUniqueId(), label: 'Repairs' },
  { id: getUniqueId(), label: 'Supplies' },
  { id: getUniqueId(), label: 'Cleaning & maintenance' },
  { id: getUniqueId(), label: 'Travel' },
  { id: getUniqueId(), label: 'Improvements' },
];

const COST_BASIS_CATEGORIES = [
  { id: getUniqueId(), label: 'Improvements' },
  { id: getUniqueId(), label: 'Maintenance' },
];

const rentalOneId = getUniqueId();
const rentalTwoId = getUniqueId();
const rentalThreeId = getUniqueId();
const homeId = getUniqueId();

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { id: getUniqueId(), label: 'Income' },
  { id: getUniqueId(), label: 'Bills' },
  { id: getUniqueId(), label: 'Groceries' },
  { id: getUniqueId(), label: 'Dining/Going Out' },
  { id: getUniqueId(), label: 'Transportation' },
  {
    id: rentalOneId,
    label: 'Rental 1',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalOneId,
    })),
  },
  {
    id: rentalTwoId,
    label: 'Rental 2',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalTwoId,
    })),
  },
  {
    id: rentalThreeId,
    label: 'Rental 3',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: rentalThreeId,
    })),
  },
  {
    id: homeId,
    label: 'Home',
    subcategories: COST_BASIS_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: homeId,
    })),
  },
  { id: getUniqueId(), label: 'Miscellaneous' },
  { id: getUniqueId(), label: 'JM Personal' },
  { id: getUniqueId(), label: 'SM Personal' },
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
