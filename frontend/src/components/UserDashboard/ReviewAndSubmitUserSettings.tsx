import { TransactionCategory } from '../../data';
import { NewPayer, Payer } from './ConfigurePayers';
import { Button } from '@mui/material';
import { UserSettings } from './UserSettings';
import { useUserContext } from '../../context/UserContext';

type Props = {
  userCategories: TransactionCategory[];
  setUserCategories: (categories: TransactionCategory[]) => void;
  newUserCategories: TransactionCategory[];
  setNewUserCategories: (categories: TransactionCategory[]) => void;
  payers: Payer[];
  setPayers: (payers: Payer[]) => void;
  newPayers: NewPayer[];
  setNewPayers: (newPayers: NewPayer[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
};

type CategoryRequest = {
  id?: number | string;
  name: string;
  parentId?: number | string;
};

export function ReviewAndSubmitUserSettings({
  userCategories,
  setUserCategories,
  newUserCategories,
  setNewUserCategories,
  payers,
  setPayers,
  newPayers,
  setNewPayers,
  setIsEditMode,
}: Props) {
  const { updatedPayers, updatedCategories } = useUserContext();
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

      // for existing user categories with new subcategories, we already have the database parentId for the POST
      // but for new categories, send the ID to the backend so that the subcategories can be mapped to the parent
      // what if we instead send the new category with subcats, if they exist, so that we can persist the new cat more easily,
      // receive back the new category's id, then use that id for the subcats' parentId attribute?
      const newCategories: (TransactionCategory | CategoryRequest)[] =
        newUserCategories.filter((cat) => !Boolean(cat.isDeleted));
      userCategories.forEach((cat) => {
        if ('subcategories' in cat) {
          cat.subcategories
            ?.filter((subcat) => !Boolean(subcat.isDeleted))
            .forEach((subcat) => {
              if (typeof subcat.id === 'string') {
                newCategories.push({
                  name: subcat.name,
                  parentId: subcat.parentId,
                });
              }
            });
        }
      });

      const patchedCategories: CategoryRequest[] = [];
      userCategories.forEach((cat) => {
        if ('isEdited' in cat && Boolean(cat.isEdited)) {
          patchedCategories.push({ id: cat.id, name: cat.name });
        }
        if ('subcategories' in cat) {
          cat.subcategories?.forEach((subcat) => {
            if (typeof subcat.id !== 'string' && Boolean(subcat.isEdited)) {
              patchedCategories.push({ id: subcat.id, name: subcat.name });
            }
          });
        }
      });

      const deletedCategories: CategoryRequest['id'][] = [];
      userCategories.forEach((cat) => {
        if ('isDeleted' in cat && Boolean(cat.isDeleted)) {
          deletedCategories.push(cat.id);
        }
        if ('subcategories' in cat) {
          cat.subcategories?.forEach((subcat) => {
            if (typeof subcat.id !== 'string' && Boolean(subcat.isDeleted)) {
              deletedCategories.push(subcat.id);
            }
          });
        }
      });

      Promise.all([
        newCategories.length
          ? await fetch('/settings/categories', {
              method: 'POST',
              body: JSON.stringify({
                newCategories,
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
        patchedCategories.length
          ? await fetch('/settings/categories', {
              method: 'PATCH',
              body: JSON.stringify({ patchedCategories }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
        deletedCategories.length
          ? await fetch('/settings/categories', {
              method: 'DELETE',
              body: JSON.stringify({ ids: deletedCategories }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            })
          : null,
      ]).finally(async () => {
        const fetchedCategories = await updatedCategories();
        setUserCategories(fetchedCategories);
      });

      setNewPayers([]);
      setNewUserCategories([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 gap-y-8">
      <UserSettings
        userCategories={userCategories}
        newUserCategories={newUserCategories}
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
