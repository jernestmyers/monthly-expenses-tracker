import { CapitalOneCreditJsonObject } from './getCsvOrigin';

export function formatCapitalOneCreditCardCsv(
  data: CapitalOneCreditJsonObject[],
) {
  return data
    .filter((d) => d['Transaction Date'].length)
    .map((d) => ({
      id: d.id,
      date: formatDate(d['Transaction Date']),
      description: d['Description'],
      memo: '',
      amount: d['Debit'] ? Number(d['Debit']) * -1 : Number(d['Credit']),
    }));
}

function formatDate(date: string) {
  // CapitalOne dates are YYYY-MM-DD and we want to convert to MM/DD/YYYY
  const parts = date.split('-');
  return parts[1] + '/' + parts[2] + '/' + parts[0];
}
