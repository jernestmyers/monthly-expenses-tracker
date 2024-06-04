import { useState } from 'react';
import { Input } from '@mui/material';
import { Row } from '../data';

export type ResponseObject = Omit<Row, 'paidBy'>;

type Props = {
  setUploadedData: React.Dispatch<
    React.SetStateAction<null | ResponseObject[]>
  >;
};

export function UploadCsvForm({ setUploadedData }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      if (error) setError(null);
      const formData = new FormData();
      formData.append('csvfile', file);
      try {
        const response = await fetch(`/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setUploadedData(data as ResponseObject[]);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'unknown error',
        );
      }
    } else {
      setError('Invalid file type');
    }
  };

  return (
    <>
      <Input
        type="file"
        inputProps={{ accept: '.csv' }}
        onChange={handleUpload}
        name="csvfile"
      />
      {error && <>{error}</>}
    </>
  );
}
