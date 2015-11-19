### Data API Usage

First time:

1. Required dependencies: Node.js, MongoDB, nodemon
2. Navigate to root directory of hufter and run `npm install`

To run:

1. Make sure Mongo server is running (if not, run command `mongod`)
2. Spin up API by running `nodemon` from root directory (will run from port 3000)
3. Run script `run.js` to make requests to API every 30 seconds and save to MongoDB

Other:

1. To explicitly call the API to save data, go to `http://localhost:3000/quotes/save/` (will save currently tracked stocks). You shoul receive a confirmation response.
2. To view list of tracked stocks, view in Mongo shell (collection is named `tickers`)
3. To add a tracked stock to the list, go to  `http://localhost:3000/quotes/save/[SYM]` where [SYM] is the name of the symbol you would like to track (e.g. TWTR). You should receive a confirmation response.

API is best interacted with with Postman.

If you get a response to any request that says "Connected to database at...", hit the route again. Connecting to the database will preclude all other actions.

Also, timing does not work exactly yet (i.e. script does not stop/start according to trading hours), so for now you might have to do this yourself. If database does not disconnect properly (you will get errors when trying to re-connect), go to `http://localhost:3000/quotes/disconnect/`