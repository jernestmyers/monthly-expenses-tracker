import { TransactionCategory } from '../../data';
import { Payer } from './ConfigurePayers';
import { Button } from '@mui/material';
import { UserSettings } from './UserSettings';

type Props = {
  userCategories: TransactionCategory[];
  payers: Payer[];
  setIsEditMode: (isEditMode: boolean) => void;
};

export function ReviewAndSubmitUserSettings({
  userCategories,
  payers,
  setIsEditMode,
}: Props) {
  return (
    <div className="flex flex-col items-center mb-4 gap-y-8">
      <UserSettings userCategories={userCategories} payers={payers} />
      <Button
        variant="contained"
        onClick={() => setIsEditMode(false)}
        sx={{ width: 300 }}
      >
        Submit
      </Button>
    </div>
  );
}
