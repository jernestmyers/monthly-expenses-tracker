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

export const FISCAL_YEARS = [2023, 2024];
