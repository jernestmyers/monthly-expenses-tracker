import { TransactionCategory } from '../../data';
import { NewPayer, Payer } from './ConfigurePayers';
import { Button } from '@mui/material';
import { UserSettings } from './UserSettings';
import { useUserContext } from '../../context/UserContext';

type Props = {
  userCategories: TransactionCategory[];
  payers: Payer[];
  setPayers: (payers: Payer[]) => void;
  newPayers: NewPayer[];
  setNewPayers: (newPayers: NewPayer[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
};

export function ReviewAndSubmitUserSettings({
  userCategories,
  payers,
  setPayers,
  newPayers,
  setNewPayers,
  setIsEditMode,
}: Props) {
  const { updatedPayers } = useUserContext();
  const handleSubmit = async () => {
    setIsEditMode(false);
    try {
      const token = localStorage.getItem('token');

      Promise.all([
        newPayers.length
          ? await fetch('/settings/payers', {
              method: 'POST',
              body: JSON.stringify({
                payerNames: newPayers.map((p) => p.name),
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
        payers.some((p) => Boolean(p.isEdited))
          ? await fetch('/settings/payers', {
              method: 'PATCH',
              body: JSON.stringify({
                payers: payers.filter((p) => p.isEdited),
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
        payers.some((p) => Boolean(p.isDeleted))
          ? await fetch('/settings/payers', {
              method: 'DELETE',
              body: JSON.stringify({
                ids: payers.filter((p) => p.isDeleted).map((p) => p.id),
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
      ]).finally(async () => {
        const fetchedPayers = await updatedPayers();
        setPayers(fetchedPayers);
      });

      setNewPayers([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 gap-y-8">
      <UserSettings
        userCategories={userCategories}
        payers={payers}
        newPayers={newPayers}
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
