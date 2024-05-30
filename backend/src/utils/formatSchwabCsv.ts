import { SchwabJsonObject } from "./getCsvOrigin";

export function formatSchwabCsv(data: SchwabJsonObject[]) {
    return data.filter(d => d["Date"].length).map(d => {
        const amount = d['Withdrawal'].length ?
            Number(d['Withdrawal'].replace('$', '').replace(',', '')) * -1 :
            Number(d['Deposit'].replace('$', '').replace(',', ''));
        return {
            id: d.id,
            date: d['Date'],
            description: d['Description'],
            memo: '',
            amount,
        }
    })
}