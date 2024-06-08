import React from 'react';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export type Payer = {
  isUser: boolean;
  displayName: string;
};

type ConfigurePayersProps = {
  payers: Payer[];
  setPayers: (payers: Payer[]) => void;
};

export function ConfigurePayers({ payers, setPayers }: ConfigurePayersProps) {
  const onPayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayers(
      payers.map((payer, index) =>
        index === Number(e.target.id)
          ? { ...payer, displayName: e.target.value }
          : payer,
      ),
    );
  };

  const handleAddPayer = () => {
    setPayers(payers.concat([{ isUser: false, displayName: '' }]));
  };

  const handleDeletePayer = (id: number) => {
    setPayers(payers.filter((payer, index) => Number(id) !== index));
  };

  return (
    <div className="w-fit self-center mt-4 flex flex-col items-center">
      <h4>
        Enter a short nickname or initials for each payer, including yourself.
      </h4>
      {payers.map((payer, index) => (
        <div className="flex items-center my-4" key={index}>
          <span className="w-[40px] font-bold">
            {payer.isUser ? 'You' : ''}
          </span>
          <TextField
            hiddenLabel
            size="small"
            id={index.toString()}
            onChange={onPayerChange}
            value={payer.displayName}
            placeholder="Enter a nickname or initials"
          />
          <Button
            sx={{ minWidth: 'auto' }}
            onClick={() => handleDeletePayer(index)}
            disabled={payer.isUser}
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
