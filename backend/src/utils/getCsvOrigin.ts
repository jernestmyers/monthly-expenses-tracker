import { isEqual } from 'lodash';

const SCHWAB_FIELDS = [
    'Date',
    'Status',
    'Type',
    'CheckNumber',
    'Description',
    'Withdrawal',
    'Deposit',
    'RunningBalance'
];

export type SchwabJsonObject = {
    id: string;
    'Date': string;
    'Status': string;
    'Type': string;
    'CheckNumber': string;
    'Description': string;
    'Withdrawal': string;
    'Deposit': string;
    'RunningBalance': string;
}

const CHASE_CC_FIELDS = [
    'Transaction Date',
    'Post Date',
    'Description',
    'Category',
    'Type',
    'Amount',
    'Memo'
]

export type ChaseCreditJsonObject = {
    id: string;
    'Transaction Date': string;
    'Post Date': string;
    'Description': string;
    'Category': string;
    'Type': string;
    'Amount': string;
    'Memo': string;
}

export function getCsvOrigin(fields: string[] | undefined) {
    if (isEqual(fields, SCHWAB_FIELDS)) {
        return 'schwab'
    } else if (isEqual(fields, CHASE_CC_FIELDS)) {
        return 'chase_credit_card'
    } else {
        return
    }
}