import { ChaseCreditJsonObject } from './getCsvOrigin';

export function formatChaseCreditCardCsv(data: ChaseCreditJsonObject[]) {
  return data
    .filter((d) => d['Transaction Date'].length && d['Type'] !== 'Payment')
    .map((d) => ({
      id: d.id,
      date: d['Transaction Date'],
      description: d['Description'],
      memo: d['Memo'],
      amount: Number(d['Amount']),
    }));
}
