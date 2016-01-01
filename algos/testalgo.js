function test2(array){
  var buy = [];
  var buyCopy = []
  var sell = [];
  array.forEach(function(dayData,index){
    price = dayData["Close"];
    time = dayData["Date"];
    if(index == array.length - 1){ return }

    if(price < array[index+1]["Close"]){
      buy.push([time,price]);
    }
    buy.forEach(function(buyDayData,index2){
      buyPrice = buyDayData[1];

      if( buyPrice < price ){
        sell.push( [time,price] );
        buyCopy.push(buy[index2]);
        buy[index2] = undefined;
      }
    });
    //cleaing up buy array
    buy = buy.filter(function(dayData){
      return dayData != undefined;
    });
  });
  return {
    buy: buyCopy,
    sell: sell
  }
}

module.exports = test2;