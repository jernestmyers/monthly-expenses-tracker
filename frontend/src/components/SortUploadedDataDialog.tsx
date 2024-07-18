import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { TRANSACTION_COLUMNS, Row, TransactionCategory } from '../data';
import { ResponseObject } from './UploadCsvForm';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserContext } from '../context/UserContext';

type Props = {
  open: boolean;
  uploadedData: ResponseObject[];
  setUploadedData: React.Dispatch<
    React.SetStateAction<ResponseObject[] | null>
  >;
  setTabData: React.Dispatch<React.SetStateAction<null | unknown>>;
};

export interface SortedData extends Row {
  category?: string;
  subcategory?: string;
}

const SORT_DATA_COLUMNS = TRANSACTION_COLUMNS.map((col) =>
  col === 'Paid by' ? 'Who paid?' : col,
)
  .concat('Which category?')
  .concat('Which subcategory?');

export function SortUploadedDataDialog({
  open,
  uploadedData,
  setUploadedData,
  setTabData,
}: Props) {
  const [sortedData, setSortedData] = useState<SortedData[]>([]);
  const [statementOwner, setStatementOwner] = useState<string | null>(null);

  const { userPayersSettings, userCategoriesSettings } = useUserContext();

  const handleCategorySelection = (
    category: string,
    data: ResponseObject,
    key: 'category' | 'subcategory',
  ) => {
    const existingTransaction = findTransaction(data, sortedData);
    if (existingTransaction) {
      const updatedTransaction = {
        ...existingTransaction,
        [key]: category,
      };
      setSortedData(
        sortedData.map((d) => (d.id === data.id ? updatedTransaction : d)),
      );
    }
  };

  const handleStatementOwnerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedStatementOwner = (e.target as HTMLInputElement).value;
    setStatementOwner(selectedStatementOwner);
    setSortedData(
      uploadedData.map((d) => ({
        ...d,
        paidBy: d.amount > 0 ? null : selectedStatementOwner,
      })),
    );
  };

  const handleSubmit = async () => {
    if (!userCategoriesSettings) return;
    if (isSubmissionValid(sortedData, userCategoriesSettings)) {
      const sortedDataWithoutClientId = sortedData.map((d) => {
        const { id, ...remainingData } = d;
        return remainingData;
      });
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/files/submit`, {
          method: 'POST',
          body: JSON.stringify(sortedDataWithoutClientId),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setUploadedData(null);
        const tabData = await response.json();
        setTabData(tabData);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert(
        'Invalid submission. Ensure all transactions have been categorized.',
      );
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xl"
      onClose={() => null}
      scroll="paper"
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title">
        Categorize and Edit Uploaded Transactions
      </DialogTitle>
      <DialogContent dividers sx={{ paddingTop: 0 }}>
        {!statementOwner && userPayersSettings && (
          <div>
            <p className="m-4 mb-2">Whose statment was uploaded?</p>
            <div className="ml-10">
              <FormControl>
                <RadioGroup
                  value={statementOwner}
                  onChange={handleStatementOwnerChange}
                >
                  {userPayersSettings.map((p) => (
                    <FormControlLabel
                      value={p.id}
                      control={<Radio />}
                      label={p.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        )}
        {statementOwner &&
          sortedData &&
          userCategoriesSettings &&
          userPayersSettings && (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {SORT_DATA_COLUMNS.map((col) => (
                    <TableCell>{col}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((d) => (
                  <TableRow>
                    <TableCell>{d.date}</TableCell>
                    <TableCell>{d.description}</TableCell>
                    <TableCell>{d.memo}</TableCell>
                    <TableCell>{d.amount}</TableCell>
                    <TableCell>
                      {d.amount > 0 ? (
                        'N/A'
                      ) : (
                        <FormControl>
                          <RadioGroup value={statementOwner}>
                            {userPayersSettings.map((p) => (
                              <FormControlLabel
                                value={p.id}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      '& .MuiSvgIcon-root': {
                                        fontSize: 16,
                                      },
                                      padding: '3px',
                                    }}
                                    disabled={statementOwner != null}
                                  />
                                }
                                label={p.name}
                                sx={{
                                  '.MuiFormControlLabel-label': {
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>
                      <FormControl
                        variant="standard"
                        sx={{ minWidth: 120 }}
                        size="small"
                      >
                        <InputLabel id="category-selector">Category</InputLabel>
                        <Select
                          labelId="category-selector"
                          id="category-select"
                          onChange={(e) =>
                            handleCategorySelection(
                              e.target.value as string,
                              d,
                              'category',
                            )
                          }
                          value={getValue(d, sortedData, 'category')}
                        >
                          {userCategoriesSettings.map((cat) => (
                            <MenuItem value={cat.id}>{cat.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {showSubcategoryContent(d, sortedData) && (
                        <SubcategoriesContent
                          tableData={d}
                          sortedData={sortedData}
                          onChange={handleCategorySelection}
                          userCategoriesSettings={userCategoriesSettings}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          setSortedData(
                            sortedData.filter((data) => data.id !== d.id),
                          )
                        }
                      >
                        <DeleteIcon sx={{ color: '#c1121f' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={() => setUploadedData(null)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function findTransaction(data: ResponseObject, sortedData: SortedData[]) {
  return sortedData.find((d) => d.id === data.id);
}

function getValue(
  tableData: ResponseObject,
  sortedData: SortedData[],
  key: keyof SortedData,
) {
  const transaction = findTransaction(tableData, sortedData);
  return transaction ? transaction[key] : undefined;
}

function SubcategoriesContent({
  tableData,
  sortedData,
  onChange,
  userCategoriesSettings,
}: {
  tableData: ResponseObject;
  sortedData: SortedData[];
  onChange: (
    selected: string,
    data: ResponseObject,
    key: 'category' | 'subcategory',
  ) => void;
  userCategoriesSettings: TransactionCategory[];
}) {
  const transaction = findTransaction(tableData, sortedData);
  if (transaction && 'category' in transaction) {
    const category = userCategoriesSettings.find(
      (cat) => cat.id === transaction.category,
    );
    if (category?.subcategories) {
      return (
        <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
          <InputLabel id="subcategory-selector">Subcategory</InputLabel>
          <Select
            labelId="subcategory-selector"
            id="subcategory-select"
            onChange={(e) =>
              onChange(e.target.value as string, tableData, 'subcategory')
            }
            value={getValue(tableData, sortedData, 'subcategory')}
          >
            {category.subcategories.map((cat) => (
              <MenuItem value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      return <>N/A</>;
    }
  }
  return null;
}

function showSubcategoryContent(
  tableData: ResponseObject,
  sortedData: SortedData[],
) {
  const transaction = findTransaction(tableData, sortedData);
  return transaction && 'category' in transaction;
}

function isSubmissionValid(
  sortedData: SortedData[],
  userCategoriesSettings: TransactionCategory[],
) {
  return sortedData.every((d) => {
    if ('category' in d) {
      const categoryObject = userCategoriesSettings.find(
        (cat) => cat.name === d.category,
      );
      if (categoryObject && 'subcategories' in categoryObject) {
        return 'subcategories' in d;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });
}
