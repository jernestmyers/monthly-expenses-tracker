import React, { useState } from 'react';
import { Button, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { TransactionCategory } from '../../data';
import { getUniqueId } from '../../utils/getUniqueId';

type ConfigureUserCategoriesProps = {
  userCategories: TransactionCategory[];
  setUserCategories: (userCategories: TransactionCategory[]) => void;
};

export function ConfigureUserCategories({
  userCategories,
  setUserCategories,
}: ConfigureUserCategoriesProps) {
  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCategories(
      userCategories.map((cat) => {
        if (cat.id === e.target.id) {
          return { ...cat, label: e.target.value };
        } else {
          return cat;
        }
      }),
    );
  };

  const onSubcategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subcatId: string,
    parentId: string,
  ) => {
    setUserCategories(
      userCategories.map((cat) => {
        if (cat.id === parentId) {
          return {
            ...cat,
            subcategories: cat.subcategories?.map((subcat) => {
              if (subcat.id === subcatId) {
                return { ...subcat, label: e.target.value };
              } else {
                return subcat;
              }
            }),
          };
        } else {
          return cat;
        }
      }),
    );
  };

  const handleCategoryDelete = (id: string) => {
    setUserCategories(userCategories.filter((cat) => cat.id !== id));
  };

  const handleSubcategoryDelete = (parentId: string, subcatId: string) => {
    setUserCategories(
      userCategories.map((cat) => {
        if (cat.id === parentId) {
          const subcategories = cat.subcategories;
          return subcategories && subcategories.length === 1
            ? {
                id: cat.id,
                label: cat.label,
              }
            : {
                ...cat,
                subcategories:
                  cat.subcategories?.filter(
                    (subcat) => subcat.id !== subcatId,
                  ) ?? [],
              };
        } else {
          return cat;
        }
      }),
    );
  };

  const handleAddSubcategory = (parentId: string) => {
    setUserCategories(
      userCategories.map((cat) => {
        if (cat.id === parentId) {
          const subcategoryLength = cat.subcategories?.length ?? 0;
          const newSubcategory = {
            parentId,
            label: '',
            id: getUniqueId(),
          };
          return {
            ...cat,
            subcategories: cat.subcategories?.length
              ? [...cat.subcategories, newSubcategory]
              : [newSubcategory],
          };
        } else {
          return cat;
        }
      }),
    );
  };

  const handleAddCategory = () => {
    setUserCategories(
      userCategories.concat([{ id: getUniqueId(), label: '' }]),
    );
  };

  return (
    <ul className="w-fit mt-3">
      {userCategories.map((cat) => (
        <li className="my-2" key={cat.id}>
          <div className="flex items-center">
            <Tooltip
              disableInteractive
              title={`Add ${cat.subcategories?.length ? 'another' : 'a'} subcategory to ${cat.label}`}
            >
              <Button
                onClick={() => handleAddSubcategory(cat.id)}
                sx={{ position: 'relative' }}
              >
                <SubdirectoryArrowRightIcon fontSize="medium" />
                <AddIcon
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 15,
                    fontSize: '1rem',
                  }}
                />
              </Button>
            </Tooltip>
            <TextField
              hiddenLabel
              size="small"
              id={cat.id.toString()}
              onChange={onCategoryChange}
              value={cat.label}
              placeholder="Enter a category label"
            />
            <Button
              sx={{ minWidth: 'auto' }}
              onClick={() => handleCategoryDelete(cat.id)}
            >
              <DeleteIcon />
            </Button>
          </div>
          {'subcategories' in cat && (
            <ul className="ml-16">
              {cat.subcategories?.map((subcat) => (
                <li className="flex items-center my-1">
                  <CircleIcon sx={{ fontSize: '0.75rem', margin: '0 1em' }} />
                  <TextField
                    hiddenLabel
                    size="small"
                    id={subcat.id.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onSubcategoryChange(e, subcat.id, subcat.parentId)
                    }
                    value={subcat.label}
                    placeholder="Enter a subcategory label"
                  />
                  <Button
                    sx={{ minWidth: 'auto' }}
                    onClick={() => handleSubcategoryDelete(cat.id, subcat.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      <Button
        onClick={handleAddCategory}
        variant="contained"
        sx={{ margin: '1em 0', width: '100%' }}
      >
        <AddIcon />
        Add another household category
      </Button>
    </ul>
  );
}
