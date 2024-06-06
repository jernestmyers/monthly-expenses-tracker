import React, { useState } from 'react';
import { Button, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserData } from '../../context/AuthContext';

type Payers = {
  isUser: boolean;
  displayName: string;
};

type ConfigurePayersProps = {
  payers?: Payers[];
  currentUser: UserData;
};

export function ConfigurePayers({ payers, currentUser }: ConfigurePayersProps) {
  const [payersState, setPayersState] = useState(
    payers ?? [{ isUser: true, displayName: currentUser.username }],
  );

  const onPayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayersState(
      payersState.map((payer, index) =>
        index === Number(e.target.id)
          ? { ...payer, displayName: e.target.value }
          : payer,
      ),
    );
  };

  const handleAddPayer = () => {
    setPayersState(payersState.concat([{ isUser: false, displayName: '' }]));
  };

  const handleDeletePayer = (id: number) => {
    setPayersState(payersState.filter((payer, index) => Number(id) !== index));
  };

  return (
    <div className="w-fit self-center mt-4">
      <h4>
        Enter a short nickname or initials for each payer, including yourself.
      </h4>
      {payersState.map((payer, index) => (
        <div className="flex items-center my-4" key={index}>
          <span className="w-[40px]">{payer.isUser ? 'You' : ''}</span>
          <TextField
            hiddenLabel
            size="small"
            id={index.toString()}
            onChange={onPayerChange}
            value={payer.displayName}
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
