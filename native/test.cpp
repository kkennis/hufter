#include <iostream>
#include "json/json-forwards.h"
#include "json/json.h"
#include "jsoncpp.cpp"
#include <fstream>

// #include <algo.h>
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

struct quote {
  int timestamp;
  double price;
};

int main(int argc, char* argv[]) {
  Json::Value stockData;
  std::string errs;
  Json::CharReaderBuilder rbuilder;
  rbuilder["collectComments"] = false;
  bool ok = Json::parseFromStream(rbuilder, cin, &stockData, &errs);

  if (!ok) {
    cout << "Failed to parse JSON" << endl;
    return 1;
  }

  Json::StreamWriterBuilder wbuilder;
  wbuilder["indentation"] = "\t";
  std::string document = Json::writeString(wbuilder, stockData);




  ofstream fout("results.txt");
  // cout << "Running";
  fout<<document<<endl;
  // fout<<stockData.asString()<< endl;
  fout.close();

  cout << document << endl;

  // Dynamically load compiled library,
  // pass data as argument to algo,
  // get return value and c back out

  // Contract: Return value must be two element array of map<integer, double>

  //JSONify it here
  // cout << data << endl;
  // cout << stockData << endl;
  // cout << stockData.asString() << endl;

  return 0;
}