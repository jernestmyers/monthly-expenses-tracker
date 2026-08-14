import { useState, useEffect } from 'react';
import { Button, Step, StepButton, Stepper } from '@mui/material';
import { TransactionCategory } from '../../data';
import { ConfigureUserCategories } from './ConfigureUserCategories';
import { ConfigurePayers, Payer, NewPayer } from './ConfigurePayers';
import { ReviewAndSubmitUserSettings } from './ReviewAndSubmitUserSettings';
import { UserSettings } from './UserSettings';
import { useUserContext } from '../../context/UserContext';

const STEPS = [
  'Household categories and subcategories',
  'Household payers/payees',
  'Review and submit',
];

export function UserDashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const { userPayersSettings, userCategoriesSettings } = useUserContext();

  const [userCategories, setUserCategories] = useState<TransactionCategory[]>(
    userCategoriesSettings ?? [],
  );

  const [newUserCategories, setNewUserCategories] = useState<
    TransactionCategory[]
  >([]);

  const [payers, setPayers] = useState<Payer[]>(userPayersSettings ?? []);
  const [newPayers, setNewPayers] = useState<NewPayer[]>([]);

  useEffect(() => {
    if (userPayersSettings) {
      setPayers(userPayersSettings);
    }
    if (userCategoriesSettings) {
      setUserCategories(userCategoriesSettings);
    }
  }, [userPayersSettings, userCategoriesSettings]);

  if (!userPayersSettings || !userCategoriesSettings) return <>Loading...</>;

  return (
    <>
      {payers && isEditMode && (
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
            {STEPS.map((name, index) => (
              <Step key={name}>
                <StepButton onClick={() => setActiveStep(index)}>
                  {name}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <ConfigureUserCategories
              userCategories={userCategories}
              setUserCategories={setUserCategories}
              newUserCategories={newUserCategories}
              setNewUserCategories={setNewUserCategories}
            />
          )}
          {activeStep === 1 && (
            <ConfigurePayers
              payers={payers}
              setPayers={setPayers}
              newPayers={newPayers}
              setNewPayers={setNewPayers}
            />
          )}
          {activeStep === 2 && (
            <ReviewAndSubmitUserSettings
              userCategories={userCategories}
              setUserCategories={setUserCategories}
              newUserCategories={newUserCategories}
              setNewUserCategories={setNewUserCategories}
              payers={payers}
              setPayers={setPayers}
              newPayers={newPayers}
              setNewPayers={setNewPayers}
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
          <div className="mt-4 self-center">
            <Button
              onClick={() => setIsEditMode(false)}
              variant="contained"
              color="error"
            >
              Cancel changes
            </Button>
          </div>
        </div>
      )}
      {payers && !isEditMode && (
        <div className="mt-4 flex flex-col items-center w-3/4 self-center gap-y-4">
          <UserSettings
            userCategories={userCategories}
            newUserCategories={newUserCategories}
            payers={payers}
            newPayers={newPayers}
          />
          <Button variant="contained" onClick={() => setIsEditMode(true)}>
            Edit settings
          </Button>
        </div>
      )}
    </>
  );
}
