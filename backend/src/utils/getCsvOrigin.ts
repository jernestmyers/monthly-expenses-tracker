import { isEqual } from 'lodash';

const SCHWAB_FIELDS = [
  'Date',
  'Status',
  'Type',
  'CheckNumber',
  'Description',
  'Withdrawal',
  'Deposit',
  'RunningBalance',
];

export type SchwabJsonObject = {
  id: string;
  Date: string;
  Status: string;
  Type: string;
  CheckNumber: string;
  Description: string;
  Withdrawal: string;
  Deposit: string;
  RunningBalance: string;
};

const CAPITAL_ONE_CC_FIELDS = [
  'Transaction Date',
  'Posted Date',
  'Card No.',
  'Description',
  'Category',
  'Debit',
  'Credit',
];

export type CapitalOneCreditJsonObject = {
  id: string;
  'Transaction Date': string;
  'Posted Date': string;
  'Card No.': string;
  Description: string;
  Category: string;
  Type: string;
  Debit: string;
  Credit: string;
};

const CHASE_CC_FIELDS = [
  'Transaction Date',
  'Post Date',
  'Description',
  'Category',
  'Type',
  'Amount',
  'Memo',
];

export type ChaseCreditJsonObject = {
  id: string;
  'Transaction Date': string;
  'Post Date': string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
};

const CHASE_CHECKING_FIELDS = [
  'Details',
  'Posting Date',
  'Description',
  'Amount',
  'Type',
  'Balance',
  'Check or Slip #',
];

export type ChaseCheckingJsonObject = {
  id: string;
  Details: string;
  'Posting Date': string;
  Description: string;
  Amount: string;
  Type: string;
  Balance: string;
  'Check or Slip #': string;
};

export function getCsvOrigin(fields: string[] | undefined) {
  if (isEqual(fields, SCHWAB_FIELDS)) {
    return 'schwab';
  } else if (isEqual(fields, CHASE_CC_FIELDS)) {
    return 'chase_credit_card';
  } else if (isEqual(fields, CHASE_CHECKING_FIELDS)) {
    return 'chase_checking';
  } else if (isEqual(fields, CAPITAL_ONE_CC_FIELDS)) {
    return 'capital_one_credit_card';
  } else {
    return;
  }
}
