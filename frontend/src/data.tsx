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
  label: string;
  subCategories?: TransactionCategory[];
};

const RENTAL_CATEGORIES = [
  { label: 'Utilities' },
  { label: 'Repairs' },
  { label: 'Supplies' },
  { label: 'Cleaning & maintenance' },
  { label: 'Travel' },
  { label: 'Improvements' },
];

const COST_BASIS_CATEGORIES = [
  { label: 'Improvements' },
  { label: 'Maintenance' },
];

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { label: 'Income' },
  { label: 'Bills' },
  { label: 'Groceries' },
  { label: 'Dining/Going Out' },
  { label: 'Transportation' },
  { label: 'Rental 1', subCategories: RENTAL_CATEGORIES },
  { label: 'Rental 2', subCategories: RENTAL_CATEGORIES },
  { label: 'Rental 3', subCategories: RENTAL_CATEGORIES },
  { label: 'Home', subCategories: COST_BASIS_CATEGORIES },
  // { label: process.env.REACT_APP_RENTAL_ONE!, subCategories: RENTAL_CATEGORIES },
  // { label: process.env.REACT_APP_RENTAL_TWO!, subCategories: RENTAL_CATEGORIES },
  // { label: process.env.REACT_APP_RENTAL_TWO!, subCategories: RENTAL_CATEGORIES },
  // { label: process.env.REACT_APP_HOMESTEAD!, subCategories: COST_BASIS_CATEGORIES },
  { label: 'Miscellaneous' },
  { label: 'JM Personal' },
  { label: 'SM Personal' },
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
