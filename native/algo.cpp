#include <iostream>
#include <vector>
using namespace std;
// Stack vs heap...no idea

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

    for (vector<Quote>::iterator it2 = buy.begin(); it3 != buy.end(); ++it) {
      double buyPrice = (*it2).price;

      if (buyPrice < price) {
        Quote sellSignal;
        sellSignal.price = price;
        sellSignal.timestamp = timestamp;
        buyCopy.push(*it2);
        *it2 = NULL;
      }
    }

    vector<Quote> filteredBuy;
    for (vector<Quote>::iterator it3 = buy.begin(); it3 != buy.end(); ++it) {
      if (*it3 != NULL){
        filteredBuy.push_back(*it3);
      }
    }
    buy = filteredBuy;
  }
  results.push_back(buyCopy);
  results.push_back(sell);
  return results;
}