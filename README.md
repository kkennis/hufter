# Hufter: An Easier Stock API

Hufter is a tool for gathering, querying, and backtesting stock quote data. Utilizing the Yahoo Finance API, it  has an easy-to-use, declarative style with RESTful routes and flexible options. There are four main utilities in Hufter: real-time quotes, daily historical data, algorithm backtesting, and persistent quote data gathering through MongoDB.

### Backtesting Engine (`/backtest`) 
_Very much in progress_

POST a JavaScript algorithm as text (x-www-form-encoded), a stringified array of quotes, and `startDate` and `endDate` params. Outputs JSON containing buy/sell signals for the algorithm along with other pertinent stats.

### Quote Data (`/quote`): 

Provides real-time price information from Yahoo Finance along with a variety of metrics.

* symbols - provide a URL-encoded, comma-delimited list of ticker symbols
* volume - set to "true" to recieve current volume in addition to last price
* alldata - set to "true" to receieve all of the quote data associated with the stock (82 metrics)
* metrics - provide a (URI-encoded) comma-delimited list of the metrics you want to recieve. Possible metrics: 
  * symbol
  * Ask
  * AverageDailyVolume
  * Bid
  * AskRealtime
  * BidRealtime
  * BookValue
  * Change_PercentChange
  * Change
  * Commission
  * Currency
  * ChangeRealtime
  * AfterHoursChangeRealtime
  * DividendShare
  * LastTradeDate
  * TradeDate
  * EarningsShare
  * ErrorIndicationreturnedforsymbolchangedinvalid
  * EPSEstimateCurrentYear
  * EPSEstimateNextYear
  * EPSEstimateNextQuarter
  * DaysLow
  * DaysHigh
  * YearLow
  * YearHigh
  * HoldingsGainPercent
  * AnnualizedGain
  * HoldingsGain
  * HoldingsGainPercentRealtime
  * HoldingsGainRealtime
  * MoreInfo
  * OrderBookRealtime
  * MarketCapitalization
  * MarketCapRealtime
  * EBITDA
  * ChangeFromYearLow
  * PercentChangeFromYearLow
  * LastTradeRealtimeWithTime
  * ChangePercentRealtime
  * ChangeFromYearHigh
  * PercebtChangeFromYearHigh
  * LastTradeWithTime
  * LastTradePriceOnly
  * HighLimit
  * LowLimit
  * DaysRange
  * DaysRangeRealtime
  * FiftydayMovingAverage
  * TwoHundreddayMovingAverage
  * ChangeFromTwoHundreddayMovingAverage
  * PercentChangeFromTwoHundreddayMovingAverage
  * ChangeFromFiftydayMovingAverage
  * PercentChangeFromFiftydayMovingAverage
  * Name
  * Notes
  * Open
  * PreviousClose
  * PricePaid
  * ChangeinPercent
  * PriceSales
  * PriceBook
  * ExDividendDate
  * PERatio
  * DividendPayDate
  * PERatioRealtime
  * PEGRatio
  * PriceEPSEstimateCurrentYear
  * PriceEPSEstimateNextYear
  * Symbol
  * SharesOwned
  * ShortRatio
  * LastTradeTime
  * TickerTrend
  * OneyrTargetPrice
  * Volume
  * HoldingsValue
  * HoldingsValueRealtime
  * YearRange
  * DaysValueChange
  * DaysValueChangeRealtime
  * StockExchange
  * DividendYield
  * PercentChange

Usage:

```
GET /quotes?symbols=SPY%2CAAPL%2CMSFT&metrics=LastTradePriceOnly%2CPercentChange%2CVolume
```
Returns:
```
[
  {
    "LastTradePriceOnly": "210.04",
    "Symbol": "SPY",
    "Volume": "110471473",
    "PercentChange": "-0.05%"
  },
  {
    "LastTradePriceOnly": "121.06",
    "Symbol": "AAPL",
    "Volume": "33042283",
    "PercentChange": "+0.12%"
  },
  {
    "LastTradePriceOnly": "54.92",
    "Symbol": "MSFT",
    "Volume": "32851204",
    "PercentChange": "+0.99%"
  }
]
```

### Persistent Quote Gathering (`/quote/save/`)

Required dependencies: Node.js, MongoDB, npm, nodemon

First time:
Navigate to root directory of hufter and run `npm install`

To run:

1. Make sure Mongo server is running (if not, run command `mongod`)
2. Spin up API by running `nodemon` from root directory (will run from port 3000). Process also logs useful console output.

Run example script `run.js` to make requests to API every 30 seconds and save to MongoDB

Other:

* To explicitly call the API to save data, go to http://localhost:3000/quotes/save/ (will save currently tracked stocks). You shoul receive a confirmation response.
* To view list of tracked stocks, view in Mongo shell (collection is named tickers)
* To add a tracked stock to the list, go to http://localhost:3000/quotes/save/[SYM] where [SYM] is the name of the symbol you would like to track (e.g. TWTR). You should receive a confirmation response.
* To disconnect from database, go to http://localhost:3000/quotes/disconnect/

API is best interacted with with Postman.

If you get a response to any request that says "Connected to database at...", hit the route again. Connecting to the database will preclude all other actions.

### Historical Data API (`/historicaldata`)

Provides daily historical data information back to 1996/04/12.

* symbols - provide a URI-encoded, comma-delimited list of ticker symbols
* startDate - provide a start date for historical data in YYYY-MM-DD format. Defaults to one year before present.
* endDate - provide an end date for historical data in YYYY-MM-DD format. Defaults to current day.
* metrics - provide a (URI-encoded) comma-delimited list of the metrics you want to recieve. Possible metrics:
  * Symbol
  * Date
  * Open
  * High
  * Low
  * Close
  * Volume
  * Adj_Close
  
Usage:

```
GET /historicaldata?symbols=AAPL%2CMSFT&metrics=Open%2CClose&startDate=2015-01-01
```
Returns:
```

{
  "results": [
    {
      "Symbol": "AAPL",
      "Open": "119.199997",
      "Close": "119.300003",
      "Date": "2015-11-20"
    },
    {
      "Symbol": "AAPL",
      "Open": "117.639999",
      "Close": "118.779999",
      "Date": "2015-11-19"
    },
    ...
        {
      "Symbol": "MSFT",
      "Open": "46.369999",
      "Close": "46.330002",
      "Date": "2015-01-05"
    },
    {
      "Symbol": "MSFT",
      "Open": "46.66",
      "Close": "46.759998",
      "Date": "2015-01-02"
    }
  ],
  "ResolutionTime": "928"
}
    
```
  






