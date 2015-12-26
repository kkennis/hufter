#include <iostream>
#include <vector>
using namespace std;

struct Quote {
  string timestamp;
  double price;
};

vector<vector<Quote>> runAlgo(vector<Quote> stockData) {
  vector<Quote> buy;
  vector<Quote> buyCopy;
  vector<Quote> sell;
  vector<vector<Quote>> results;

  for (vector<Quote>::iterator it = stockData.begin(); it != stockData.end(); ++it) {
    string timestamp = (*it).timestamp;
    double price = (*it).price;

    if (it + 1 == stockData.end()){
      break;
    }

    if (price < (*(it+1)).price) {
      Quote buySignal;
      buySignal.price = price;
      buySignal.timestamp = timestamp;
      buy.push_back(buySignal);
    }

    for (vector<Quote>::iterator it2 = buy.begin(); it2 != buy.end(); ++it2) {
      double buyPrice = (*it2).price;

      if (buyPrice < price) {
        Quote sellSignal;
        sellSignal.price = price;
        sellSignal.timestamp = timestamp;
        sell.push_back(sellSignal);
        buyCopy.push_back(*it2);
      }
    }
  }
  results.push_back(buyCopy);
  results.push_back(sell);
  return results;
}