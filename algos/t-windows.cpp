#include <iostream>
#include <windows.h>
#include <math.h>
#include <conio.h>
#include <stdlib.h>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <sstream>
#include <iomanip>
using namespace std;

void entropy(double pU, double pN, double& ent){
  ent = -1*pU*log(pU) + -1*pN*log(pN);
}

struct data{
  int month;
  int day;
  int year;
  int hour;
  int min;
  double open;
  double high;
  double low;
  double close;
  double volume;
};

struct info{
  int min;
  double close;
  int hour;
  int min_act;
};
int main(){
  int i,j,k,a,b,n,end,hour1,hour2,count;
   double awesome; double EnMax = 0.301029995664; double netcash;
  string filename; string temp0;   int pcount,ncount;
  vector<int> boughtstocks; vector<double> boughtprice; vector<double> sellprice; char window[101]; double Pprob,Nprob;
  char fileNAME[20]; char buffer_a [33];
  cout << "Input file name: ";
  cin >> fileNAME;
//Date,Time,Open,High,Low,Close,Volume
  ifstream myReadfile0;
  myReadfile0.open(fileNAME);
  //if(fileNAME == 'OIH.txt'){end = 1129221;}
  end = 1129221;
  data stock; vector < vector <info> > history;
  info daily;
 i = 0; j = 0;
 history.push_back(vector <info> () );
  if(myReadfile0.is_open()){

      while(i<end+1){
                                 // 08/15/2014/15:36/53.48/53.505/53.48/53.5/6435

          hour1=stock.hour;                                                                                                //Date,Time,Open,High,Low,Close,Volume
        //getline(myReadfile0,temp0);sscanf(temp0.c_str(),"%d/%d/%d/%d:%d/%f/%f/%f/%f/%d",&stock.month,&stock.day,&stock.year,&stock.hour,&stock.min,&stock.open,&stock.high,&stock.low,&stock.close,&stock.volume);
        myReadfile0>>stock.month>>stock.day>>stock.year>>stock.hour>>stock.min>>stock.open>>stock.high>>stock.low>>stock.close>>stock.volume;
        //cout<<stock.month<<" "<<stock.day<<" "<<stock.year<<" "<<stock.hour<<" "<<stock.min<<"  "<<stock.open<<"  "<<stock.high<<endl;//cout<<temp0<<endl;
            hour2 =stock.hour;
        daily.min = (stock.hour - 9)*60 + stock.min; daily.close = stock.close; daily.hour = stock.hour; daily.min_act = stock.min;
        if(stock.year>2012){stock.close = stock.close*0.333333333;}
        if(stock.year == 2012 && stock.month>2){stock.close = stock.close*0.333333333;}
        if(stock.year == 2012 && stock.month == 2 && stock.day >= 14){stock.close*0.333333333;}

        history[j].push_back(daily);

        if(hour1 == 15 && hour2 == 9){
          //cout<<hour1 <<" "<<hour2<<endl;
          history.push_back( vector<info> () );
          j++;
          //cout<<j-1<<"  day and  "<<history[j-1].size()<<" minutes "<<endl;
          //cin>>hour1;
        }
        if(hour1 == 14 && hour2 == 9){
          //cout<<hour1 <<" "<<hour2<<endl;
          history.push_back( vector<info> () );
          j++;
          //cout<<j-1<<"  day and  "<<history[j-1].size()<<" minutes "<<endl;
          //cin>>hour1;
        }

        i++;

      }
  }
//  cout<<history.size()<<endl;
ofstream fout("results.txt"); string ent = "entropy "; string cash = "cash "; string fullname1; string fullname2; string txt = ".txt";
 for(a=3;a<=100;a++){        itoa(a,buffer_a,10); ///a-forloop

 k = b =  0; n=-1;
 netcash = 50000;
  fullname2 = cash+buffer_a+txt;
  char * cstr2 = new char [fullname2.length()+1]; strcpy(cstr2, fullname2.c_str() );
  ofstream fout2(cstr2);


  for(i=0;i<history.size();i++){   //start of each day - index i
   fullname1 = ent+buffer_a+txt; //fullname2 = cash+buffer_a+txt;
  char * cstr1 = new char [fullname1.length()+1]; strcpy(cstr1, fullname1.c_str() );
  //char * cstr2 = new char [fullname2.length()+1]; strcpy(cstr2, fullname2.c_str() );
      n = -1;
   //cout<<history[i].size()<<endl;
   //cin>>hour1;
    //ofstream fout1(cstr1);
    //ofstream fout2(cstr2);
  for(j=1;j<history[i].size();j++ ){
    //cout<<"check "<<i<<" "<<j<<endl;
    if(j>=a){
      b = 0;
      for(k=j-a;k<j;k++){

      if(history[i][k].close>history[i][j-1].close){
        window[b]='P';
      }
      if(history[i][k].close<history[i][j-1].close){
        window[b]='N';
      }
      b++;
       } pcount = ncount = 0;
       //cout<<"check 1 "<<endl;
       for(k=0;k<a;k++){
        if(window[k]=='P'){
          pcount++;
          }
        if(window[k]=='N'){
          ncount++;
          }

       }  Nprob = ncount/(1.0*a); Pprob = pcount/(1.0*a);
       entropy(Pprob,Nprob,awesome);

       //cout<<"check 2"<<endl;

       if( (1-pow( (awesome/EnMax),2.0 ) ) > 0.9 && ncount > pcount && ncount > 0.642857*a && history[i][j].min <(14-9)*60 + 30 && floor((netcash*0.9)/history[i][j].close ) >= 1.0 ){
                        n++;

                        boughtstocks.push_back( floor( (netcash*0.9)/history[i][j].close ));
                        //cout<<netcash<<" - "<<boughtstocks[n]<<"*"<<history[i][j].close<<"  =  ";
                        netcash = (netcash - boughtstocks[n]*history[i][j].close) ; //cout<<netcash<<endl;//cout<<" n = "<<n<<endl;
                        boughtprice.push_back(history[i][j].close);
                       // cin>>hour1;

          }
          //cout<<"check 3"<<endl;
          if(boughtprice.size()>0){
           double sum3 = 0;
             for(b=0;b<boughtprice.size();b++){
                if( history[i][j].close*1.0 - boughtprice[b]*1.0 > 0.001  && boughtstocks[b] > 0 && boughtprice[b] > 0.0){
                                sellprice.push_back(history[i][j].close);
                                //cout<<boughtstocks[b]<<"*"<<history[i][j].close<<" = "<<boughtstocks[b]*history[i][j].close;
                                netcash = netcash + boughtstocks[b]*history[i][j].close; boughtstocks[b] = 0;
                                      //cin>>hour1;
                }
                //sum3 = 0;
                if(history[i][j].min >=(14-9)*60 + 30 || j == history[i].size()-1){

          sellprice.push_back(history[i][j].close);
          if(boughtstocks[b]>0){ //cout<<boughtstocks[b]<<"*"<<history[i][j].close<<" = "<<sum3<<endl;;
             sum3 = sum3 + boughtstocks[b]*history[i][j].close; boughtstocks[b] = 0;

           }


        }
             } //cout<<netcash<<" + "<<sum3;
       netcash = netcash + sum3; //cout<<" = "<<netcash<<endl;
          }

           if(j>25){
            //cout<<i<<"  "<<j<<" "<<netcash<<endl;
           // cin>>hour1;
           }
     }//if j>a loop



    /*double sum = 0;
     for(b=0;b<=n;b++){
      if(boughtstocks[b]>0 && boughtstocks[b]<1000000){
      //cout<<boughtprice[b]<<"*"<<boughtstocks[b]<<" = ";
          sum = boughtprice[b]*boughtstocks[b] + sum; //cout<<sum<<endl;
      }
    }*/
      //cout<<"  "<<i<<"  "<<j<<"  netcash = "<<netcash+sum<<endl;
        //cin>>hour1;

      //fout2<<j<<" "<<netcash<<endl;
    //fout1<<j<<" "<<setprecision(10)<<history[i][j].close<<" "<<awesome<<endl;
  }//end j-loop
   //fout1.close();//fout2.close();
   double sum = 0;
     for(b=0;b<=n;b++){
      if(boughtstocks[b]>0 && boughtstocks[b]<1000000){
      //cout<<boughtprice[b]<<"*"<<boughtstocks[b]<<" = ";
          sum = boughtprice[b]*boughtstocks[b] + sum; //cout<<sum<<endl;
      }
    }
    cout<<"sum = "<<sum<<endl;
    //cin>>hour1;
   fout2<<i<<"  "<<netcash<<endl;
   cout<<"T-window "<<a<<"  day  "<<i<<"  "<<netcash<<endl;//<<"  size of boughtstocks = "<<boughtstocks.size()<<endl;
  boughtstocks.clear(); sellprice.clear(); boughtprice.clear();
  }//end i-loop //end of all days
  cin>>hour1;
  fout2.close(); //cin>>hour1;
 cout<<"T-window "<<a<<"  "<<netcash<<endl;
 fout<<a<<" "<<netcash<<endl;
  boughtstocks.clear(); sellprice.clear(); boughtprice.clear();
 }//end a-loop
fout.close();
}