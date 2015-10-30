# Hufter: An Easier Stock API

Hufter is a wrapper for the YQL finance API. It has an easy-to-use, declarative style with RESTful routes and flexible options.

To use the API, simply append your desired API to the root path, then your desired stock ticker (e.g. http://[root]/quote/GOOG). The base route will give you the price of the last trade for your requested stock, along with the resolution time of your request (included for all queries). Add query parameters to customize your request:

## Quote API (`/quote`): 

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

## Historical Data API (`/historicaldata`)

* startDate - provide a start date for historical data in YYYY-MM-DD format (goes back ~19 months). Defaults to one year before present.
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

