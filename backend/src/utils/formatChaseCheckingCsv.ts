import { ChaseCheckingJsonObject } from './getCsvOrigin';

export function formatChaseCheckingCsv(data: ChaseCheckingJsonObject[]) {
  return data
    .filter((d) => d['Posting Date'] != null)
    .map((d) => {
      return {
        id: d.id,
        date: d['Posting Date'],
        description: d['Description'],
        memo: '',
        amount: d['Amount'],
      };
    });
}
