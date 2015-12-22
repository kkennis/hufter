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
  string data = "";
  cin >> data;

  Json::Value array;
  array.append("hello");
  array.append("world");

  Json::Value parsedData;
  Json::Reader reader;
  Json::StyledWriter writer;
  bool parsingSuccessful = reader.parse(data, parsedData);
  if (parsingSuccessful)
  {
    string output = writer.write(parsedData);
    cout << output << endl;
  }


  return 0;
}