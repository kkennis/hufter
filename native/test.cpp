#include <iostream>
#include <string>
#include <vector>
#include "json/json-forwards.h"
#include "json/json.h"
#include "jsoncpp.cpp"
#include "algo.cpp"
using namespace std;

// Algo contract:
// Input: vector of struct with int timestamp and double price
// Output: two-element array (buy and sell signals) of
// vector of structs (i.e. timestamp, price)

// What we do:
// Turn string passed into cin into vector of structs
// Call algo with vector as arg, get return value as array
// Turn array output into stringified JSON
// Cout JSON string

int main(int argc, char* argv[]) {
  string data = "";
  cin >> data;

  Json::Value parsedData;
  Json::Reader reader;
  Json::StyledWriter writer;
  bool parsingSuccessful = reader.parse(data, parsedData);
  if (parsingSuccessful)
  {
    // Go to Results
    // For each key of results (i.e stock)
    // Create vector of quotes (our struct)
    // For each day in stock, create struct with close and data

    Json::Value output;
    Json::Value results = parsedData["results"];
    vector<string> symbols = results.getMemberNames();

    for (auto symbol: symbols) {

      Json::Value quoteData = results[symbol];
      vector<Quote> stockData;
      for (Json::Value::iterator it = quoteData.begin(); it != quoteData.end(); ++it) {
        Quote dayData;
        dayData.price = stod((*it)["Close"].asString());
        dayData.timestamp = (*it)["Date"].asString();
        stockData.push_back(dayData);
      }

      vector<vector<Quote>> signals = runAlgo(stockData);

      Json::Value symbolResults;
      Json::Value resultSignals;
      symbolResults["signals"] = resultSignals;
      Json::Value buys;
      Json::Value sells;
      symbolResults["signals"]["buy"] = buys;
      symbolResults["signals"]["sell"] = sells;

      output[symbol] = symbolResults;

      for (vector<Quote>::iterator it = signals[0].begin(); it != signals[0].end(); ++it) {
        Json::Value buySignal;
        buySignal.append((*it).timestamp);
        buySignal.append((*it).price);
        output[symbol]["signals"]["buy"].append(buySignal);
      }

      for (vector<Quote>::iterator it = signals[1].begin(); it != signals[1].end(); ++it) {
        Json::Value sellSignal;
        sellSignal.append((*it).timestamp);
        sellSignal.append((*it).price);
        output[symbol]["signals"]["sell"].append(sellSignal);
      }


    }
    string finalOutput = writer.write(output);
    cout << finalOutput << endl;
  }

  return 0;
}