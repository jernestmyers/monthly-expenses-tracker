import React from 'react';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getUniqueId } from '../../utils/getUniqueId';

export type Payer = {
  id: number;
  name: string;
  isEdited?: boolean;
  isDeleted?: boolean;
};

export type NewPayer = {
  tempId: string;
  name: string;
};

type ConfigurePayersProps = {
  payers: Payer[];
  setPayers: (payers: Payer[]) => void;
  newPayers: NewPayer[];
  setNewPayers: (payers: NewPayer[]) => void;
};

export function ConfigurePayers({
  payers,
  setPayers,
  newPayers,
  setNewPayers,
}: ConfigurePayersProps) {
  const onPayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayers(
      payers.map((payer) =>
        payer.id === Number(e.target.id)
          ? { ...payer, name: e.target.value, isEdited: true }
          : payer,
      ),
    );
  };

  const handleDeletePayer = (id: number | string) => {
    setPayers(
      payers.map((payer) =>
        payer.id !== id ? payer : { ...payer, isDeleted: true },
      ),
    );
  };

  const handleAddNewPayer = () => {
    setNewPayers(newPayers.concat([{ tempId: getUniqueId(), name: '' }]));
  };

  const onNewPayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayers(
      newPayers.map((newPayer) =>
        newPayer.tempId === e.target.id
          ? { ...newPayer, name: e.target.value }
          : newPayer,
      ),
    );
  };

  const handleDeleteNewPayer = (id: string) => {
    setNewPayers(newPayers.filter((newPayer) => newPayer.tempId !== id));
  };

  return (
    <div className="w-fit self-center mt-4 flex flex-col items-center">
      <h4>
        Enter a short nickname or initials for each payer, including yourself.
      </h4>
      {payers
        .filter((payer) => !payer.isDeleted)
        .map((payer) => (
          <div className="flex items-center my-1" key={payer.id}>
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
            >
              <DeleteIcon />
            </Button>
          </div>
        ))}
      {newPayers.map((newPayer) => (
        <div className="flex items-center my-1" key={newPayer.tempId}>
          <TextField
            hiddenLabel
            size="small"
            id={newPayer.tempId}
            onChange={onNewPayerChange}
            value={newPayer.name}
            placeholder="Enter a nickname or initials"
          />
          <Button
            sx={{ minWidth: 'auto' }}
            onClick={() => handleDeleteNewPayer(newPayer.tempId)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ))}
      <Button
        onClick={handleAddNewPayer}
        variant="contained"
        sx={{ marginBottom: '2em', marginTop: '1em' }}
      >
        <AddIcon />
        Add another household payer
      </Button>
    </div>
  );
}
