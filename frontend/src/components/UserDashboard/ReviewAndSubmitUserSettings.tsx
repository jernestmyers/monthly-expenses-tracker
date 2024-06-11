import { TransactionCategory } from '../../data';
import { Payer } from './ConfigurePayers';
import { Button } from '@mui/material';
import { UserSettings } from './UserSettings';

type Props = {
  userCategories: TransactionCategory[];
  payers: Payer[];
  setIsEditMode: (isEditMode: boolean) => void;
  userId: number;
};

export function ReviewAndSubmitUserSettings({
  userCategories,
  payers,
  setIsEditMode,
  userId,
}: Props) {
  const handleSubmit = async () => {
    setIsEditMode(false);
    try {
      const token = localStorage.getItem('token');
      await fetch('/settings', {
        method: 'POST',
        body: JSON.stringify({ userCategories, payers }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }

    // if (isSubmissionValid(sortedData)) {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch(`/files/submit`, {
    //       method: 'POST',
    //       body: JSON.stringify(sortedData),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     const test = await response.json();
    //     console.log({ test });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // } else {
    //   alert(
    //     'Invalid submission. Ensure all transactions have been categorized.',
    //   );
    // }
  };

  return (
    <div className="flex flex-col items-center mb-4 gap-y-8">
      <UserSettings
        userId={userId}
        userCategories={userCategories}
        payers={payers}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ width: 300 }}
        color="success"
      >
        Submit changes
      </Button>
    </div>
  );
}
