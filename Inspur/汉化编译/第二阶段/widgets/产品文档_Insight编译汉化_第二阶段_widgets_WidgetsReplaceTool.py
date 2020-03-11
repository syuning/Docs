#!/usr/bin/python
#coding=gbk
import xlrd
import os
import sys
reload(sys) 
sys.setdefaultencoding('utf8')

xlsurl = "widgets-ch.xlsx"

def replaceTxt(_url, sour, dest):
    url = _url
    f =  open(url,"r+")
    lines = f.readlines()
    #lines = f.read().decode('utf-8')
    destContext=""
    bHasReplace = False

    for line in lines:
        if sour in line:
            changeContext = line.replace(sour, dest)
            bHasReplace = True
        else:
            changeContext = line
        destContext += changeContext
        
    f.seek(0)     
    f.truncate() 
    f.write(destContext)
    f.close()
    return bHasReplace;
   


data = xlrd.open_workbook(xlsurl) 
table = data.sheets()[0]
nrows = table.nrows 
success = 0
fail = 0

for i in range(nrows): 
    if (i == 0 or table.row_values(i)[0]==''): 
        continue
    if not os.path.exists(table.row_values(i)[0]) :
        print("Warning:[" + table.row_values(i)[0] +"] does not exist")
        fail+=1
        continue
        
    #print(table.row_values(i)[:3]) # 取前十三列
    bRet = replaceTxt(table.row_values(i)[0], table.row_values(i)[1], table.row_values(i)[2]);
    if not bRet:
        print("Warning:[" + table.row_values(i)[0]+"] not find ["+ table.row_values(i)[1] +"]")
        fail+=1
    else:
        success+=1
        
   
print("success:%d, fail:%d" % (success, fail))
print("END");

os.system("pause") 
