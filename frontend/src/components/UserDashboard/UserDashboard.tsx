import React, { useState } from 'react';
import { Button, Step, StepButton, Stepper } from '@mui/material';
import { TransactionCategory } from '../../data';
import { ConfigureUserCategories } from './ConfigureUserCategories';
import { ConfigurePayers } from './ConfigurePayers';
import { useAuth } from '../../context/AuthContext';

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
  'Household categories and subcategories',
  'Household payers/payees',
  'Review and submit',
];

export function UserDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const { currentUser } = useAuth();

  return (
    currentUser && (
      <div className="w-3/4 self-center flex flex-col">
        <h2 className="text-xl my-3">
          Configure and edit your household settings
        </h2>
        <Stepper nonLinear activeStep={activeStep} alternativeLabel>
          {STEPS.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && <ConfigureUserCategories />}
        {activeStep === 1 && <ConfigurePayers currentUser={currentUser} />}
        <div className="flex justify-center gap-x-12">
          <Button
            disabled={activeStep === 0}
            onClick={() =>
              setActiveStep((prevActiveStep) => prevActiveStep - 1)
            }
          >
            Back
          </Button>
          <Button
            disabled={activeStep === 2}
            onClick={() =>
              setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
          >
            Next
          </Button>
        </div>
      </div>
    )
  );
}
