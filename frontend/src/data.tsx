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
  id: number;
  label: string;
  subcategories?: TransactionSubcategory[];
};

export type TransactionSubcategory = Omit<
  TransactionCategory,
  'subcategories'
> & {
  parentId: number;
};

const RENTAL_CATEGORIES = [
  { id: 1, label: 'Utilities' },
  { id: 2, label: 'Repairs' },
  { id: 3, label: 'Supplies' },
  { id: 4, label: 'Cleaning & maintenance' },
  { id: 5, label: 'Travel' },
  { id: 6, label: 'Improvements' },
];

const COST_BASIS_CATEGORIES = [
  { id: 1, label: 'Improvements' },
  { id: 2, label: 'Maintenance' },
];

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { id: 1, label: 'Income' },
  { id: 2, label: 'Bills' },
  { id: 3, label: 'Groceries' },
  { id: 4, label: 'Dining/Going Out' },
  { id: 5, label: 'Transportation' },
  {
    id: 6,
    label: 'Rental 1',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({ ...cat, parentId: 6 })),
  },
  {
    id: 7,
    label: 'Rental 2',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({ ...cat, parentId: 7 })),
  },
  {
    id: 8,
    label: 'Rental 3',
    subcategories: RENTAL_CATEGORIES.map((cat) => ({ ...cat, parentId: 8 })),
  },
  {
    id: 9,
    label: 'Home',
    subcategories: COST_BASIS_CATEGORIES.map((cat) => ({
      ...cat,
      parentId: 9,
    })),
  },
  { id: 10, label: 'Miscellaneous' },
  { id: 11, label: 'JM Personal' },
  { id: 12, label: 'SM Personal' },
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
