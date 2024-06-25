import React from 'react';
import { Button, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { TransactionCategory } from '../../data';
import { getUniqueStringId } from '../../utils/getUniqueId';

/** ----------- BEGIN HELPER CALLBACK FUNCTIONS ------------- */
const newSubcategorySetterCallback =
  (parentId: number | string) => (cat: TransactionCategory) => {
    if (cat.id === parentId) {
      const newSubcategory = {
        parentId,
        name: '',
        id: getUniqueStringId(),
      };
      return {
        ...cat,
        subcategories: Array.isArray(cat.subcategories)
          ? [...cat.subcategories, newSubcategory]
          : [newSubcategory],
      };
    } else {
      return cat;
    }
  };

const subcategoryDeleteSetterCallback =
  (parentId: number | string, subcatId: number | string) =>
  (cat: TransactionCategory) => {
    if (cat.id === parentId) {
      const subcategories = cat.subcategories;
      return subcategories && subcategories.length
        ? {
            ...cat,
            subcategories:
              cat.subcategories?.map((subcat) =>
                subcat.id !== subcatId
                  ? subcat
                  : { ...subcat, isDeleted: true },
              ) ?? [],
          }
        : cat;
    } else {
      return cat;
    }
  };

const categoryOnChangeSetterCallback =
  (id: number | string, value: string) => (cat: TransactionCategory) => {
    if (cat.id === id) {
      return { ...cat, isEdited: true, name: value };
    } else {
      return cat;
    }
  };

const subcategoryOnChangeSetterCallback =
  (parentId: string | number, subcatId: string | number, value: string) =>
  (cat: TransactionCategory) => {
    if (cat.id === parentId) {
      return {
        ...cat,
        subcategories: cat.subcategories?.map((subcat) => {
          if (subcat.id === subcatId) {
            return { ...subcat, isEdited: true, name: value };
          } else {
            return subcat;
          }
        }),
      };
    } else {
      return cat;
    }
  };
/** ----------- END HELPER CALLBACK FUNCTIONS ------------ */

type ConfigureUserCategoriesProps = {
  userCategories: TransactionCategory[];
  setUserCategories: (userCategories: TransactionCategory[]) => void;
  newUserCategories: TransactionCategory[];
  setNewUserCategories: (newUserCategories: TransactionCategory[]) => void;
};

export function ConfigureUserCategories({
  userCategories,
  setUserCategories,
  newUserCategories,
  setNewUserCategories,
}: ConfigureUserCategoriesProps) {
  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.id))) {
      // isNaN will be true, meaning our ID was a client-generated string to indicate a new category
      setNewUserCategories(
        newUserCategories.map(
          categoryOnChangeSetterCallback(e.target.id, e.target.value),
        ),
      );
    } else {
      setUserCategories(
        userCategories.map(
          categoryOnChangeSetterCallback(Number(e.target.id), e.target.value),
        ),
      );
    }
  };

  const onSubcategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subcatId: number | string,
    parentId: number | string,
  ) => {
    if (typeof parentId === 'number') {
      setUserCategories(
        userCategories.map(
          subcategoryOnChangeSetterCallback(parentId, subcatId, e.target.value),
        ),
      );
    } else {
      setNewUserCategories(
        newUserCategories.map(
          subcategoryOnChangeSetterCallback(parentId, subcatId, e.target.value),
        ),
      );
    }
  };

  const handleCategoryDelete = (id: number | string) => {
    if (typeof id === 'number') {
      setUserCategories(
        userCategories.map((cat) =>
          cat.id !== id ? cat : { ...cat, isDeleted: true },
        ),
      );
    }

    if (typeof id === 'string') {
      setNewUserCategories(
        newUserCategories.filter((newCat) => newCat.id !== id),
      );
    }
  };

  const handleSubcategoryDelete = (
    parentId: number | string,
    subcatId: number | string,
  ) => {
    if (typeof parentId === 'number') {
      setUserCategories(
        userCategories.map(subcategoryDeleteSetterCallback(parentId, subcatId)),
      );
    } else {
      setNewUserCategories(
        newUserCategories.map(
          subcategoryDeleteSetterCallback(parentId, subcatId),
        ),
      );
    }
  };

  const handleAddSubcategory = (parentId: number | string) => {
    if (typeof parentId === 'number') {
      setUserCategories(
        userCategories.map(newSubcategorySetterCallback(parentId as number)),
      );
    }

    if (typeof parentId === 'string') {
      setNewUserCategories(
        newUserCategories.map(newSubcategorySetterCallback(parentId as string)),
      );
    }
  };

  const handleAddCategory = () => {
    setNewUserCategories(
      newUserCategories.concat([{ id: getUniqueStringId(), name: '' }]),
    );
  };

  return (
    <ul className="w-fit mt-3">
      {userCategories
        .filter((cat) => !Boolean(cat.isDeleted))
        .map((cat) => (
          <CategoryListItem
            category={cat}
            handleAddSubcategory={handleAddSubcategory}
            onCategoryChange={onCategoryChange}
            handleCategoryDelete={handleCategoryDelete}
            onSubcategoryChange={onSubcategoryChange}
            handleSubcategoryDelete={handleSubcategoryDelete}
          />
        ))}
      {newUserCategories.map((newCat) => (
        <CategoryListItem
          category={newCat}
          handleAddSubcategory={handleAddSubcategory}
          onCategoryChange={onCategoryChange}
          handleCategoryDelete={handleCategoryDelete}
          onSubcategoryChange={onSubcategoryChange}
          handleSubcategoryDelete={handleSubcategoryDelete}
        />
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

type CategoryListItemProps = {
  category: TransactionCategory;
  handleAddSubcategory: (id: number | string) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryDelete: (id: number | string) => void;
  onSubcategoryChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string,
    parentId: number | string,
  ) => void;
  handleSubcategoryDelete: (
    parentId: number | string,
    id: number | string,
  ) => void;
};

function CategoryListItem({
  category,
  handleAddSubcategory,
  onCategoryChange,
  handleCategoryDelete,
  onSubcategoryChange,
  handleSubcategoryDelete,
}: CategoryListItemProps) {
  return (
    <li className="my-2" key={category.id}>
      <div className="flex items-center">
        <Tooltip
          disableInteractive
          title={`Add ${category.subcategories?.length ? 'another' : 'a'} subcategory to ${category.name}`}
        >
          <Button
            onClick={() => handleAddSubcategory(category.id)}
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
          id={category.id.toString()}
          onChange={onCategoryChange}
          value={category.name}
          placeholder="Enter a category name"
        />
        <Button
          sx={{ minWidth: 'auto' }}
          onClick={() => handleCategoryDelete(category.id)}
        >
          <DeleteIcon />
        </Button>
      </div>
      {'subcategories' in category && (
        <ul className="ml-16">
          {category.subcategories
            ?.filter((subcat) => !Boolean(subcat.isDeleted))
            .map((subcat) => (
              <li className="flex items-center my-1">
                <CircleIcon sx={{ fontSize: '0.75rem', margin: '0 1em' }} />
                <TextField
                  hiddenLabel
                  size="small"
                  id={subcat.id.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onSubcategoryChange(e, subcat.id, subcat.parentId)
                  }
                  value={subcat.name}
                  placeholder="Enter a subcategory name"
                />
                <Button
                  sx={{ minWidth: 'auto' }}
                  onClick={() =>
                    handleSubcategoryDelete(category.id, subcat.id)
                  }
                >
                  <DeleteIcon />
                </Button>
              </li>
            ))}
        </ul>
      )}
    </li>
  );
}
