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
    // console.log({parentId, subcatId})
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
    console.log({ subcatId, parentId });
    if (typeof parentId === 'number') {
      setUserCategories(
        userCategories.map(
          // (cat) => {
          // if (cat.id === parentId) {
          //   return {
          //     ...cat,
          //     subcategories: cat.subcategories?.map((subcat) => {
          //       if (subcat.id === subcatId) {
          //         return { ...subcat, isEdited: true, name: e.target.value };
          //       } else {
          //         return subcat;
          //       }
          //     }),
          //   };
          // } else {
          //   return cat;
          // }
          // }
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

/**
 * userCategories initially are set from backend with numerical ids
 *  - onChange: set isEdited to true
 *  - onDelete: set isDeleted to true
 *
 * userSubcategories within the userCategories array are also set from backend w/ numerical ids
 *  - onChange: set isEdited to true
 *  - onDelete: set isDeleted to true
 *
 * What about adding a new subcategory to an existing userCategory?
 *  - parentId will be numerical
 *  - id will be string
 *  - condition handling based on string vs numerical id attribute
 *
 * newUserCategories are created with handleAddCategory and have string ids
 *
 * category onChange handler can differentiate between numerical and string IDs in order
 * to apply changes to the userCategories vs newUserCategories array
 *
 * editing and deleting subcategories:
 * - if the parentId is a number and subcat id is a number, then we're amending the userCategories array first generated by server data
 * - if the parentId is a number and subcat id is a string, then we're amending the userCategories array but with a new subcat
 * - if the parentId is a string, then we're amending newUserCategories array
 */

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
