import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tab, Tabs } from '@mui/material';
import { TABS, TRANSACTION_CATEGORIES, FISCAL_YEARS } from './data';
import { a11yProps } from './utils/a11yProps';
import { UploadCsvForm, ResponseObject } from './components/UploadCsvForm';
import { CategorySection } from './components/CategorySection';
import { SortUploadedDataDialog } from './components/SortUploadedDataDialog';
import { Header } from './components/Header';
import { NoData } from './components/NoData';

function App() {
  const [expandedSections, setExpandedSections] = useState([0]);
  const [uploadedData, setUploadedData] = useState<null | ResponseObject[]>(
    null,
  );
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!year || !month) {
      const currentYear = new Date().getFullYear().toString();
      navigate(`/${currentYear}/${formatMonth(new Date().getMonth())}`);
    }
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    navigate(`/${year}/${formatMonth(newValue)}`);
  };

  const handleYearChange = (year: number) => {
    navigate(`/${year.toString()}/01`);
  };

  const tabData = null;

  return (
    <div className="grid grid-cols-[150px_auto] grid-rows-[auto_1fr] h-screen">
      <Header />
      <aside className="bg-gray-200">
        <nav>
          <ul className="text-lg">
            <span className="text-xl">Select a year</span>
            {FISCAL_YEARS.map((yr) => (
              <li key={yr}>
                <div className="flex justify-center items-center">
                  <div
                    className={`w-2.5 h-2.5 ${yr.toString() === year ? 'bg-green-500 rounded-full' : ''}`}
                  ></div>
                  <Button
                    onClick={() => handleYearChange(yr)}
                    disabled={yr.toString() === year}
                    sx={{ fontSize: '16px' }}
                  >
                    {yr}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="overflow-auto">
        <div className="w-full">
          <p className="text-xl text-center">FY {year}</p>
          <UploadCsvForm setUploadedData={setUploadedData} />
          <Tabs
            value={Number(month) - 1}
            onChange={handleTabChange}
            aria-label="tabs for each fiscal year"
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((tab, i) => (
              <Tab label={tab.label} key={tab.label} {...a11yProps(i)} />
            ))}
          </Tabs>
          {tabData ? (
            <>
              <div className="flex gap-10">
                <button
                  onClick={() =>
                    setExpandedSections(
                      TRANSACTION_CATEGORIES.map((_, ind) => ind),
                    )
                  }
                >
                  expand all
                </button>
                <span>|</span>
                <button onClick={() => setExpandedSections([])}>
                  collapse all
                </button>
              </div>
              {month && (
                <div>
                  {TRANSACTION_CATEGORIES.map((cat, index) => (
                    <CategorySection
                      key={cat.label}
                      activeTab={Number(month) - 1}
                      id={index}
                      category={cat}
                      expandedSections={expandedSections}
                      setExpandedSections={setExpandedSections}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <NoData month={month} year={year} />
          )}
        </div>
      </main>
      {uploadedData && (
        <SortUploadedDataDialog
          open={uploadedData !== null}
          uploadedData={uploadedData}
          setUploadedData={setUploadedData}
        />
      )}
    </div>
  );
}

export default App;

function formatMonth(month: number) {
  return month + 1 > 9 ? (month + 1).toString() : `0${(month + 1).toString()}`;
}
