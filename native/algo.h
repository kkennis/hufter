struct Quote {
  std::string timestamp;
  double price;
};

std::vector<std::vector<Quote>> runAlgo(std::vector<Quote> stockData);