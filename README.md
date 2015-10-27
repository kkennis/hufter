# Hufter: An Easier Stock API

Hufter is a wrapper for the YQL finance API. It has an easy-to-use, declarative style with RESTful routes and flexible options.

To use the API, simply add your desired stock ticker to the root path (e.g. http://[root]/GOOG). The base route will give you the price of the last trade for your requested stock, along with the resolution time of your request (included for all queries). Add query parameters to customize your request:

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
