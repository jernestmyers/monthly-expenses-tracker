import { TransactionCategory } from '../../data';
import { NewPayer, Payer } from './ConfigurePayers';

type Props = {
  userCategories: TransactionCategory[];
  payers: Payer[];
  newPayers: NewPayer[];
};

export function UserSettings({ userCategories, payers, newPayers }: Props) {
  return (
    <div className="flex gap-x-16">
      <ul>
        <h3 className="text-xl font-bold underline mb-1">
          Your household categories
        </h3>
        {userCategories.map((cat) => (
          <>
            <li className="text-lg font-medium" key={cat.id}>
              {cat.label}
            </li>
            {cat.subcategories && (
              <ul className="ml-4">
                {cat.subcategories.map((subcat) => (
                  <li>{subcat.label}</li>
                ))}
              </ul>
            )}
          </>
        ))}
      </ul>
      <ul>
        <h3 className="text-xl font-bold underline mb-1">
          Your household payers
        </h3>
        {payers
          .filter((payer) => !payer.isDeleted)
          .map((payer) => (
            <li className="text-lg font-medium" key={payer.id}>
              {payer.name}
            </li>
          ))}
        {newPayers.map((payer) => (
          <li className="text-lg font-medium" key={payer.tempId}>
            {payer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
