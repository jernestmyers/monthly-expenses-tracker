import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Step,
  StepButton,
  Stepper,
  TextField,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { TransactionCategory } from '../data';

const DEFAULT_CATEGORIES: TransactionCategory[] = [
  { id: 1, label: 'Income' },
  { id: 2, label: 'Bills' },
  { id: 3, label: 'Groceries' },
  { id: 4, label: 'Entertainment' },
  { id: 5, label: 'Transportation' },
  { id: 6, label: 'Memberships' },
  { id: 7, label: 'Services' },
  { id: 8, label: 'Miscellaneous' },
];

const STEPS = [
  'Configure your household categories and subcategories',
  'Configure your household payers/payees',
  'Review and submit',
];

export function UserDashboard() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div>
      <h2>Configure and edit your household settings</h2>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {STEPS.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => setActiveStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && <ConfigureCategories />}
      <div className="flex justify-center gap-x-12">
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
        >
          Back
        </Button>
        <Button
          disabled={activeStep === 2}
          onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

type ConfigureCategoriesProps = {
  userCategories?: TransactionCategory[];
};

function ConfigureCategories({ userCategories }: ConfigureCategoriesProps) {
  const [categories, setCategories] = useState<TransactionCategory[]>(
    userCategories?.length ? userCategories : DEFAULT_CATEGORIES,
  );

  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === Number(e.target.id)) {
          return { ...cat, label: e.target.value };
        } else {
          return cat;
        }
      }),
    );
  };

  const onSubcategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subcatId: number,
    parentId: number,
  ) => {
    setCategories(
      categories.map((cat) => {
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

  const handleCategoryDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleSubcategoryDelete = (parentId: number, subcatId: number) => {
    setCategories(
      categories.map((cat) => {
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

  const handleAddSubcategory = (parentId: number) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === parentId) {
          const subcategoryLength = cat.subcategories?.length ?? 0;
          const newSubcategory = {
            parentId,
            label: '',
            id: subcategoryLength + 1,
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

  console.log(categories);

  return (
    <ul>
      {categories.map((cat) => (
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
    </ul>
  );
}
