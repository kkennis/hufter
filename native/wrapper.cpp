#include <iostream>
// #include <algo.h>
// #include 'export-jsonifier'
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


  // Dynamically load compiled library,
  // pass data as argument to algo,
  // get return value and c back out

  // Contract: Return value must be two element array of map<integer, double>

  //JSONify it here

  cout << data << endl;

  return 0;
}