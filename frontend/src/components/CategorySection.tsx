import React, { useState } from 'react';
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
import { TABS, TRANSACTION_COLUMNS, data, TransactionCategory } from '../data';

type Props = {
  activeTab: number;
  id: number;
  category: TransactionCategory;
  expandedSections: number[];
  setExpandedSections: React.Dispatch<React.SetStateAction<number[]>>;
};

export function CategorySection({
  activeTab,
  id,
  category,
  expandedSections,
  setExpandedSections,
}: Props) {
  const finalCategoryColumns = category.subCategories
    ? TRANSACTION_COLUMNS.slice(0, 3)
        .concat('Subcategory')
        .concat(TRANSACTION_COLUMNS.slice(3))
    : TRANSACTION_COLUMNS;

  return (
    <div key={category.label}>
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
          <h2 className="inline-block">{category.label}</h2>
          <Tooltip
            title={
              <div>
                <h3>{category.label} Transactions at a glance</h3>
                <ul>
                  <li>
                    {TABS[activeTab].label}'s total: <span>$1000</span>
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
            {activeTab === 0 &&
              data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.memo}</TableCell>
                  {category.subCategories && <TableCell>testing</TableCell>}
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
      </details>
    </div>
  );
}
