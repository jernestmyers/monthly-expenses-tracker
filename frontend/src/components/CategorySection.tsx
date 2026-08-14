import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import CalculateIcon from '@mui/icons-material/Calculate';
import { TABS, TRANSACTION_COLUMNS, TransactionCategory } from '../data';
import { SortedData } from './SortUploadedDataDialog';

type Props = {
  activeTab: number;
  id: number;
  category: TransactionCategory;
  expandedSections: number[];
  setExpandedSections: React.Dispatch<React.SetStateAction<number[]>>;
  sectionData: SortedData[];
};

export function CategorySection({
  activeTab,
  id,
  category,
  expandedSections,
  setExpandedSections,
  sectionData,
}: Props) {
  const finalCategoryColumns = category.subcategories
    ? TRANSACTION_COLUMNS.slice(0, 3)
        .concat('Subcategory')
        .concat(TRANSACTION_COLUMNS.slice(3))
    : TRANSACTION_COLUMNS;

  return (
    <div key={category.name}>
      <details
        open={expandedSections.includes(id)}
        onToggle={(e: React.SyntheticEvent<HTMLDetailsElement, Event>) => {
          const isOpen = (e.target as HTMLDetailsElement).open;
          if (isOpen) {
            setExpandedSections(expandedSections.concat(id));
          } else {
            setExpandedSections(expandedSections.filter((sec) => sec !== id));
          }
        }}
      >
        <summary>
          <h2 className="inline-block">{category.name}</h2>
          <Tooltip
            title={
              <div>
                <h3>{category.name} Transactions at a glance</h3>
                <ul>
                  <li>
                    {TABS[activeTab].name}&apos;s total: <span>$1000</span>
                  </li>
                  <li>
                    YTD total: <span>$5000</span>
                  </li>
                </ul>
              </div>
            }
          >
            <CalculateIcon />
          </Tooltip>
        </summary>
        {sectionData.length ? (
          <Table>
            <TableHead>
              <TableRow>
                {finalCategoryColumns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sectionData.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.memo}</TableCell>
                  {d.subcategory && <TableCell>{d.subcategory}</TableCell>}
                  <TableCell>${d.amount}</TableCell>
                  <TableCell>{d.paidBy ?? 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <EditIcon />
                      <MoveDownIcon />
                      <DeleteIcon />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="text-sm ml-4 mb-4 italic">No data</span>
        )}
      </details>
    </div>
  );
}
