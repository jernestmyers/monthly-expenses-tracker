import { CapitalOneCreditJsonObject } from './getCsvOrigin';

export function formatCapitalOneCreditCardCsv(
  data: CapitalOneCreditJsonObject[],
) {
  return data
    .filter((d) => d['Transaction Date'].length)
    .map((d) => ({
      id: d.id,
      date: d['Transaction Date'],
      description: d['Description'],
      memo: '',
      amount: d['Debit'] ? Number(d['Debit']) * -1 : Number(d['Credit']),
    }));
}
