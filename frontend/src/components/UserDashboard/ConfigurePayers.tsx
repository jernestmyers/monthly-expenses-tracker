import React from 'react';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getUniqueId } from '../../utils/getUniqueId';

export type Payer = {
  id: number;
  name: string;
};

export type NewPayer = {
  id?: number;
  tempId?: string;
  name?: string;
  isDeleted?: boolean;
};

type ConfigurePayersProps = {
  payers: Payer[];
  setPayers: (payers: Payer[]) => void;
  newOrEditedPayers: NewPayer[];
  setNewOrEditedPayers: (payers: NewPayer[]) => void;
  userId: number;
};

export function ConfigurePayers({
  userId,
  payers,
  setPayers,
  newOrEditedPayers,
  setNewOrEditedPayers,
}: ConfigurePayersProps) {
  // the list of payers will be populated with payers and newOrEditedPayers

  const onPayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayers(
      payers.map((payer) =>
        payer.id === Number(e.target.id)
          ? { ...payer, name: e.target.value }
          : payer,
      ),
    );
  };

  const handleAddPayer = () => {
    setNewOrEditedPayers(
      newOrEditedPayers.concat([{ tempId: getUniqueId(), name: '' }]),
    );
  };

  const handleDeletePayer = (id: number | string) => {
    // if we delete a payer, we must determine if the payer already existed in the database (in the payers array, numerical id)
    // it's possible the payer to be deleted was recently added and never persisted
    // in the above case, the payer would only exist on newOrEditedPayers array with a tempId attribute
    if (typeof id === 'number') {
      setPayers(payers.filter((payer) => payer.id !== id));
    }

    if (typeof id === 'string') {
    }
    //
    // if (newOrEditedPayers.find(p => p.id))
    // setNewOrEditedPayers(newOrEditedPayers.)
  };

  return (
    <div className="w-fit self-center mt-4 flex flex-col items-center">
      <h4>
        Enter a short nickname or initials for each payer, including yourself.
      </h4>
      {payers.map((payer) => (
        <div className="flex items-center my-4" key={payer.id}>
          <span className="w-[40px] font-bold">
            {payer.id === userId ? 'You' : ''}
          </span>
          <TextField
            hiddenLabel
            size="small"
            id={payer.id.toString()}
            onChange={onPayerChange}
            value={payer.name}
            placeholder="Enter a nickname or initials"
          />
          <Button
            sx={{ minWidth: 'auto' }}
            onClick={() => handleDeletePayer(payer.id)}
            disabled={payer.id === userId}
          >
            <DeleteIcon />
          </Button>
        </div>
      ))}
      <Button
        onClick={handleAddPayer}
        variant="contained"
        sx={{ marginBottom: '2em' }}
      >
        <AddIcon />
        Add another household payer
      </Button>
    </div>
  );
}
