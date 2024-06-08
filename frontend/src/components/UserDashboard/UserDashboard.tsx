import React, { useState } from 'react';
import { Button, Step, StepButton, Stepper } from '@mui/material';
import { TransactionCategory } from '../../data';
import { ConfigureUserCategories } from './ConfigureUserCategories';
import { ConfigurePayers } from './ConfigurePayers';
import { ReviewAndSubmitUserSettings } from './ReviewAndSubmitUserSettings';
import { useAuth } from '../../context/AuthContext';
import { getUniqueId } from '../../utils/getUniqueId';
import { UserSettings } from './UserSettings';

const DEFAULT_CATEGORIES: TransactionCategory[] = [
  { id: getUniqueId(), label: 'Income' },
  { id: getUniqueId(), label: 'Bills' },
  { id: getUniqueId(), label: 'Groceries' },
  { id: getUniqueId(), label: 'Entertainment' },
  { id: getUniqueId(), label: 'Transportation' },
  { id: getUniqueId(), label: 'Memberships' },
  { id: getUniqueId(), label: 'Services' },
  { id: getUniqueId(), label: 'Miscellaneous' },
];

const STEPS = [
  'Household categories and subcategories',
  'Household payers/payees',
  'Review and submit',
];

export function UserDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const { currentUser } = useAuth();

  const [userCategories, setUserCategories] =
    useState<TransactionCategory[]>(DEFAULT_CATEGORIES);

  const [payers, setPayers] = useState([
    { isUser: true, displayName: currentUser?.username ?? '' },
  ]);

  return (
    <>
      {currentUser && isEditMode && (
        <div className="w-3/4 self-center flex flex-col">
          <h2 className="text-xl my-3">
            Configure and edit your household settings
          </h2>
          <Stepper
            sx={{ marginTop: '1em', marginBottom: '1.5em' }}
            nonLinear
            activeStep={activeStep}
            alternativeLabel
          >
            {STEPS.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => setActiveStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <ConfigureUserCategories
              userCategories={userCategories}
              setUserCategories={setUserCategories}
            />
          )}
          {activeStep === 1 && (
            <ConfigurePayers payers={payers} setPayers={setPayers} />
          )}
          {activeStep === 2 && (
            <ReviewAndSubmitUserSettings
              userCategories={userCategories}
              payers={payers}
              setIsEditMode={setIsEditMode}
            />
          )}
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
      )}
      {currentUser && !isEditMode && (
        <div className="mt-4 flex flex-col items-center w-3/4 self-center gap-y-4">
          <UserSettings userCategories={userCategories} payers={payers} />
          <Button variant="contained" onClick={() => setIsEditMode(true)}>
            Edit settings
          </Button>
        </div>
      )}
    </>
  );
}
