# Exchange4Students

Exchange4Students is a browser-based student marketplace for buying and selling textbooks, dorm essentials, electronics, and class supplies.

## Features

- Browse active listings in a responsive marketplace feed
- Search by keyword and filter by category, condition, price range, and availability
- Post new listings with seller details, pickup preferences, and item descriptions
- Save favorite items for quick access
- Add items to an interest cart for follow-up with sellers
- Mark your own listings as sold
- Persist listings and user actions with sqlite database

## Project Structure

- `index.html` contains the application layout
- `styles.css` contains the visual design and responsive styling
- `script.js` contains marketplace data, rendering logic, filtering, and user interactions
- `server.js` contains the server that accepts HTTP requests to interact with sqlite database
- `sql.js` contains the wrapper functions for server to interact with database

## How To Run

1. Run `npm start` to start the server instance
2. Open `index.html` in a browser.
3. Use the filters to browse listings or submit the form to create a new one.

## Notes

- Data is stored locally in the browser for demo purposes.
- Use the "Dark/Light Mode" button to change UI appearance.
- Database file is not stored on github
