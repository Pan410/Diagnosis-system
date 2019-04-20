/**
 * Created by xiaoze on 2017/12/5.
 */
// node 后端服务器

const userApi = require('./api/userApi')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const jwt= require('jsonwebtoken')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// 后端api路由

app.use('/api/user', userApi)


var secretkey='pxp';
app.use(function(req,res,next){
    if(req.url!='/api/user/userLogin'||req.url!='/api/user/userRegiste'){
        let token =req.body.token;
        jwt.verify(token,secretkey,function(err,decode){
            if(err){
                res.json({
                    message:'token过期，请重新登录',
                    resultCode:'403'
                })
            }else{
                next();
            }
        })
    }else{
        next();
    }
})


// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')
