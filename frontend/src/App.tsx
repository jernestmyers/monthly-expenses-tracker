import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tab, Tabs } from '@mui/material';
import { TABS, FISCAL_YEARS } from './data';
import { a11yProps } from './utils/a11yProps';
import { UploadCsvForm, ResponseObject } from './components/UploadCsvForm';
import { CategorySection } from './components/CategorySection';
import {
  SortUploadedDataDialog,
  SortedData,
} from './components/SortUploadedDataDialog';
import { NoData } from './components/NoData';
import { useUserContext } from './context/UserContext';

function App() {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [uploadedData, setUploadedData] = useState<null | ResponseObject[]>(
    null,
  );
  const [tabData, setTabData] = useState(null);
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();
  const { userCategoriesSettings } = useUserContext();

  useEffect(() => {
    if (!year || !month) {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = formatMonth(new Date().getMonth());
      getTabData(currentYear, currentMonth);
      navigate(`/${currentYear}/${currentMonth}`);
    } else {
      getTabData(year, month);
    }
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    if (!year) return;
    const month = formatMonth(newValue);
    navigate(`/${year}/${month}`);
    getTabData(year, month);
  };

  const handleYearChange = (year: number) => {
    navigate(`/${year.toString()}/01`);
  };

  const getTabData = useCallback(
    async (year: string, month: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/transactions?year=${year}&month=${month}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const jsonTabData = await response.json();
      if (jsonTabData.length) {
        setTabData(jsonTabData);
      } else {
        setTabData(null);
      }
    },
    [setTabData],
  );

  return (
    <>
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
              <Tab label={tab.name} key={tab.name} {...a11yProps(i)} />
            ))}
          </Tabs>
          {tabData && userCategoriesSettings ? (
            <>
              <div className="flex gap-10">
                <button
                  onClick={() =>
                    setExpandedSections(
                      userCategoriesSettings.map((cat) => Number(cat.id)),
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
                  {userCategoriesSettings.map((cat) => {
                    // @ts-ignore
                    const sectionData: SortedData[] = tabData
                      // @ts-ignore
                      .filter((d) => {
                        if (d['parent_category_id']) {
                          return cat.id === d['parent_category_id'];
                        } else {
                          return cat.id === d['category_id'];
                        }
                      })
                      // @ts-ignore
                      .map((d) => ({
                        id: d.id,
                        date: d.date,
                        description: d.description,
                        memo: d.memo,
                        subcategory: d['parent_category_id']
                          ? d['category_name']
                          : null,
                        amount: d.amount,
                        paidBy: d['payer_name'],
                      }));
                    return (
                      <CategorySection
                        key={cat.name}
                        activeTab={Number(month) - 1}
                        id={Number(cat.id)}
                        category={cat}
                        expandedSections={expandedSections}
                        setExpandedSections={setExpandedSections}
                        sectionData={sectionData}
                      />
                    );
                  })}
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
    </>
  );
}

export default App;

function formatMonth(month: number) {
  return month + 1 > 9 ? (month + 1).toString() : `0${(month + 1).toString()}`;
}
