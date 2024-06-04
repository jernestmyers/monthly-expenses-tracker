# household finance tracker (in progress)

## why?

my wife and i have been maintaining spreadsheets for years to track our household finances. we have always used the spreadsheets to determine who owes who and how much at the end of the month. over the years our finances have gotten more complicated by kids and rental properties, and this web app aims to streamline this process.

currently, we manually input each transaction into a category and use some spreadhseet equations to determine costs by category and the "square up" cost each month. this entails having our financial statement open in one browser or tab and tediously going back and forth to input every transaction. come tax season, we then use the spreadsheet to determine calculations related to tax filing, most notably IRS Schedule E transactions.

<strong>household finance tracker</strong> aims to simplify our bookkeeping by parsing and re-formatting uploaded CSVs of our financial statements. then, the user can categorize, edit, and delete each transaction accordingly, with categories being determined by user preferences. for our purposes, we also have subcategories for our rental properties so we can track the Schedule E categories (ie, cleaning and maintenance, repairs, utilities, etc). once an uploaded CSV has been categorized and edited accordingly, the user submits the data for the backend to do some magic and persist it to a postgres database.

in the UI, a tooltip will be rendered next to each category that displays the total spent on that category for the month and a running Year-To-Date calculation. also, there will be a button that will display a summary of the month's transactions, including the "square up" cost.

ultimately this web app is for personal use and its current trajectory is to suit our needs, but perhaps its future could be configured for a broader audience. as a bonus, this web app is an opportunity to deepen my full stack skills!

## live version

[https://monthly-expenses-tracker.adaptable.app](https://monthly-expenses-tracker.adaptable.app)

## stack

- frontend: react, typescript, tailwind, react-router-dom, material UI
- backend: node, express, postgres, raw SQL, multer, papaparse

## notes/todos

- wire up auth with postman and JWT
- configure postgres database
- enable transaction edits
- implement category tooltip summaries
- implement monthly summaries
- implement year-in-review summary? (this data may exist anyway in the monthly summaries if any YTD calcs are included)
- allow for user profiles that customize transaction categories and the payees? once created, can these customizations be edited? how will persisted data get updated, or should it no longer be editable?
