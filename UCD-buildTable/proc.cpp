#include <iostream>
#include <sstream>
#include <string>
#include <cstdlib>
#include <vector>
#include <cmath>
using namespace std;


struct UniData {
    string uhex;
    string udec;
    string dscrp;
};
vector<UniData> UniDataSet;


string HexToDec(string& hex) 
{
    long ldec = 0;
    for(int i=hex.length()-1; i>=0; i--) 
    {
        int tmp = 0;
        if(isdigit(hex[i])) tmp = hex[i] - '0';
        else tmp = (hex[i] - 'A') + 10;
        ldec += pow(16, hex.length() - i - 1) * tmp;
    }
    return to_string(ldec);
}
void ProcLine(istringstream& is)
{
    string ele;
    UniData term;
    for(int i=0; getline(is, ele, ';'); i++)
    {
        if(ele.empty()) { continue; }
        if(i == 0) // u-code
        {
            term.uhex = ele;
            term.udec = HexToDec(ele);
        }
        else if(i == 1) // description
        {
            term.dscrp = ele;
        }
    }
    UniDataSet.push_back(term);
}
void input() 
{
    string line;
    while(getline(cin, line)) 
    {
        istringstream is(line);
        ProcLine(is);
    }
}

void output()
{
    cout << "[\n";
    for(int i=0; i<UniDataSet.size(); i++)
    {
        if(i!=0) { cout << ",\n"; }
        cout << "{";
        cout << "\"uc\": " << "\"" << UniDataSet[i].uhex << "\"" << ", ";
        cout << "\"dc\": " << "\"" << UniDataSet[i].udec << "\"" << ", ";
        cout << "\"des\": " << "\"" << UniDataSet[i].dscrp << "\"" << "}";
    }
    cout << "\n]\n";
}


int main(void) 
{
    freopen("ucd-table.txt", "r", stdin);
    freopen("ucd-table.json", "w", stdout);
    input();
    output();
    return 0;
}