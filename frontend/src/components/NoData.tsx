import { TABS } from '../data';

type Props = {
    month?: string,
    year?: string,
}

export function NoData({ month, year }: Props) {
    return (
        <div className="h-screen w-screen italic mx-8 my-4">
                <h3 className="text-xl mb-4">No data</h3>
                <p>Upload a CSV with data for {month ? TABS[Number(month) - 1].label : month} {year} or navigate to a different month/year.</p>
        </div>
    )
}