#Naive Bayes
#coding=utf-8
import os,sys
import math
import MySQLdb
import time
import csv
import codecs
import numpy as np
import pandas as pd
from datetime import datetime
from scipy.stats import norm
from scipy.stats import multivariate_normal as mvn
from scipy.integrate import quad,dblquad,nquad

sql = "select * from data"




#读入训练数据
def get_data(limit=None,name=''):
    print("Reading in and transforming data...")
    filecp = codecs.open(name ,encoding = 'utf-8')
    df = pd.read_csv(filecp)
    data = df.as_matrix()#矩阵
    np.random.shuffle(data)#将data随机打乱顺序
    X = data[:, 1:] / 166.0 # data is from 0...166，产生一个0-1之间的值。相当于归一化。166个症状
    Y = data[:, 0]  #开头第一列是class
    if limit is not None:  #如果定义了获取元素个数
        X, Y = X[:limit], Y[:limit]  #获取指定个数的元素
        print Y
    print "读入数据成功"
    return X, Y


# 从数据库中得到测试数据

# def get_data_from_mysql():
#     # db = MySQLdb.connect("10.4.6.222", "root", "123456", "diagnose", charset='utf8')
#
#     # 使用cursor()方法获取操作游标
#     cursor = db.cursor()
#
#     # SQL查询语句
#     sql = "select * from data"
#
#     try:
#         cursor.execute(sql)
#         results = cursor.fetchall()
#         print results
#         symptom=[0]*166
#         uid=results[0][1]
#         print uid
#         symptom[0]=results[0][2]
#         if(uid==-1):
#             return symptom,uid
#         else:
#             for i in range(1,len(results)):
#                 if(results[i-1][1]==results[i][1]):
#                     print results[i][2]
#                     symptom[i]=results[i][2]
#             print symptom
#         return symptom,uid
#     except:
#         print "error"
#     # db.close()

def judge():
    db = MySQLdb.connect("10.4.6.222", "root", "123456", "diagnose", charset='utf8')
    cursor = db.cursor()
    sql="select count(*) from data"
    try:

        cursor.execute(sql)
        results = cursor.fetchall()
        # print results[0][0]
    except:
        print "查找失败！！！  error"
    return results[0][0]
    db.close()

def get_data_from_mysql():
    db = MySQLdb.connect("10.4.6.222", "root", "123456", "diagnose", charset='utf8')

    # 使用cursor()方法获取操作游标
    cursor = db.cursor()

    # SQL查询语句
    sql = "select * from data"

    try:
        cursor.execute(sql)
        results = cursor.fetchone()
        print "results.............",results
        symptom=[0]*166
        uid=results[1]
        str2=str(results[2])
        print uid
        print str2
        print len(str2)
        a=0
        for i in range(len(str2)):
            if(str2[i]!=','):
                a = a * 10 + int(str2[i])
            else:
                print a
                i += 1
                symptom[a - 1] = a
                a = 0
        symptom[a - 1] = a
        return symptom,uid
        # symptom[a - 1] = a
        # print results

        # return symptom,uid
    except:
        print "获取数据  error"
    db.close()



# 朴素贝叶斯
class NaiveBayes(object):
    def fit(self, X, Y, smoothing=1e-10):#处理数据，计算所有的均值和协方差
        print "开始fit——————————————"
        self.gaussians = dict()#建立一个字典
        self.priors = dict()
        labels = set(Y)#使用Y建立一个可变集合
        # print "label——————————————" ,labels
        for c in labels:
            #print("==============>{}".format(c)) #每个class出现一次
            current_x = X[Y == c]  #使用条件，将X中所有class为c的数据提出来,行数不知道，列数为
            #下面这个是字典的字典，注意结构
            #其实是对所有同类的图片的784个像素分别做均值和方差
            self.gaussians[c] = {
                'mean': current_x.mean(axis=0),  #按行计算均值,axis=1则按列计算均值。这里每一行一个图片。计算结果为784个均值
                'var': current_x.var(axis=0) + smoothing,  #864个方差
            }
            self.priors[c] = float(len(Y[Y == c])) / len(Y)  #计算先验P(c)
        print "fit结束————————————"

    def predict(self, X):  # 预测
        # N, D = X.shape  # N=846  *   D=166
        K = len(self.gaussians) + 1  # K=71,因为有71个class
        print "K(((((((((((((((()))))))))))))):", K
        P = [np.inf]*K  # N行K列。846行测试数据，每个都要计算每个class的概率
        # print len(self.priors)
        for c, g in self.gaussians.items():  # 字典的迭代，上网查查相关知识
            mean, var = g['mean'], g['var']
            # print "mean", mean
            # print "var", var
            # 847条166种症状，根据不同的c对应的均值和方差计算概率。存到对应行的对应列中。
            # print mvn.logpdf(X, mean=mean, cov=var) + np.log(self.priors[c])
            P[c] = mvn.logpdf(X, mean=mean, cov=var) + np.log(self.priors[c])  # （ln(p(x|c)+ln p(c))）
            # print "概率吧！！！！！！！！", np.log(np.max(P[:, c]))
            # print "hahahahaha",np.log(mvn.logpdf(X,mean=mean,cov=var)+np.log(self.priors[c]))
            # print "诶"
            # print mvn.pdf(X[c], mean=mean, cov=var)
        # print(P[0:3, :])  # 头三行
        # print(np.argmax(P, axis=1))  # 观察前面的三个class，与头三行对比
        argsort_a = np.argsort(P[1:])
        # print "看看吧输出几个！！！！！！！！！！", argsort_a[::-1]
        # print P[1:]
        # print np.argsort(P)
        return np.argsort(P)

    def score(self, symptom, uid):
        result=self.predict(symptom)
        print "结果出现了！！！！",result
        # argsort_a = np.argsort(result[1:])
        # result=argsort_a
        str1='"'
        for i in range(55,69):
            print i
            db = MySQLdb.connect("10.4.6.222", "root", "123456", "diagnose", charset='utf8')
            cursor = db.cursor()
            sql = "select name from medicine where id=%d"%(result[i])
            cursor.execute(sql)
            str2= cursor.fetchone()
            # print "str2_______",str2[0]
            if i<68:
                str1=str1+str2[0]+","
            if i==68:
                str1 = str1 + str2[0]
            # print "str1##########",str1

        str1=str1+'"'
        print str1
        # print uid
        print len(str1)
        # db = MySQLdb.connect("10.4.6.222", "root", "123456", "diagnose", charset='utf8')
        cursor = db.cursor()
        uid='"'+uid+'"'
        sql="insert into result(uid,mids) values(%s,%s)"%(uid,str1)
        delsql="delete from data where uid=%s"%(uid)
        print sql
        try:
            # 执行sql语句
            cursor.execute(sql)
            # 提交到数据库执行
            db.commit()
            print "插入成功！！！"
            cursor.execute(delsql)
            db.commit()
            print"等待数据. . ."
        except:
            # 发生错误时回滚
            db.rollback()
            print "看什么看失败了！！！"
        # cursor.execute(delsql)
        # db.commit()
        # print"删除成功"
        # 关闭数据库连接
        # db.close()


if __name__ == '__main__':
    X, Y = get_data(850, 'train1.csv')
    Ntrain = len(Y)
    Xtrain, Ytrain = X[:Ntrain], Y[:Ntrain]
    model = NaiveBayes()
    model.fit(Xtrain, Ytrain)
    symptom = [0] * 166
    while True:
        result=judge()
        if result!=0:
            symptom, uid = get_data_from_mysql()
            model.score(symptom, uid)
            print uid
        if result==0:
            result=judge()

    # print"一个测试数据的值：：：：", len(symptom)
    # print "Uid______",uid
    # print "symptoms",symptom
    # while True:
    #     while judge()!=0:
    #     # print"result", result
    #         symptom, uid = get_data_from_mysql()
    #         model.score(symptom, uid)
    #     time.sleep(10)
        # else:
        #     time.sleep(60)
        #     result = judge()
        #     print "等待数据"

