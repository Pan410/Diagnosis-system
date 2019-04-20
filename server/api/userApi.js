var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var md5 = require('blueimp-md5');
var jwt =require('jsonwebtoken');

// 连接数据库(连接池)
var conn = mysql.createPool(models.mysql);

// conn.connect();
var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败',
    });
  } else {
    res.json(ret);
  }
};

// 增加症状接口
router.post('/add', (req, res) => {
  
  var params = req.body;
  if(params.flag==='0')
    var sql=$sql.cases.add;
  if(params.flag==='1')
    var sql = $sql.symptom.add;
  if(params.flag==='2')
    var sql = $sql.medicine.add;
  conn.query(sql, [params.name, params.remarks], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
})


//查询

router.post('/allList',(req,res)=>{
  
  var params=req.body;
  if(params.flag==='0')
    var sql=$sql.cases.select;
  if(params.flag==='1')
    var sql =$sql.symptom.select;
  if(params.flag==='2')
    var sql =$sql.medicine.select;
  conn.query(sql,function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      console.log(result)
      jsonWrite(res,result);
      return result;
    }
  })
})






//修改
router.post('/updateById',(req,res)=>{

  const params=req.body;
  console.log(params);

  if(params.flag==='0')
    var sql=$sqsl.cases.update;
  if(params.flag==='1')
    var sql=$sql.symptom.update;
  if(params.flag==='2')
    var sql=$sql.medicine.update;
  conn.query(sql,[params.name,params.remarks,params.id],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})


//根据名称查询
router.post('/searchByName',(req,res)=>{
  console.log(req);
  var params=req.body;
  console.log(params);
  if(params.flag==='0')
    var sql=$sql.cases.search;
  if(params.flag==='1')
    var sql=$sql.symptom.search;
  if(params.flag==='2')
    var sql=$sql.medicine.search;
  conn.query(sql,[params.name],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})



router.post('/addMedicine', (req, res) => {
  var sql = $sql.medicine.add;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.mname, params.from,params.remarks], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
})

router.post('/addPatient', (req, res) => {
  var sql = $sql.patient.add;
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      // jsonWrite(res, result);
    }
  })
  conn.query($sql.patient.find, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
})


router.post('/addCase', (req, res) => {
  var params=req.body;
  conn.query($sql.patient.update,[params.name,params.age,params.gender] ,function(err, result) {
    if (err) {
      console.log(err);
    }
  })
  conn.query($sql.disease.add,[params.pid] ,function(err, result) {
    if (err) {
      console.log(err);
    }
  })
  conn.query($sql.cases.update,[params.diagnose,params.remarks,params.pid] ,function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
})

router.post('/deletePatient', (req, res) => {
  var sql = $sql.patient.del;
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
})

router.post('/symptomList',(req,res)=>{
  var sql=$sql.symptom.select;
  conn.query(sql,function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})

router.post('/delDiease',(req,res)=>{
  var params=req.body;
  var sql=$sql.disease.del;
  conn.query(sql,[params.id],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})


router.post('/addOrDeleteDisease',(req,res)=>{
  var params=req.body;
  var sql=$sql.disease.find;
  conn.query(sql,[params.sid],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})

router.post('/handleDelete',(req,res)=>{
  console.log(req.body)
  var params=req.body;
  // console.log(params.id);
  if(params.flag==='0')
    var sql=$sql.cases.delete;
  if(params.flag==='1')
  var sql=$sql.symptom.delete;
  if(params.flag==='2')
  var sql=$sql.medicine.delete;
  conn.query(sql , [params.id] , function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})


router.post('/addDisease',(req,res)=>{
  var sql=$sql.disease.add;
  var params=req.body;  
  conn.query(sql,[params.sid], function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})

router.post('/deleteDisease',(req,res)=>{
  var sql=$sql.disease.delete;
  conn.query(sql, function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})

router.post('/deleteByName',(req,res)=>{
  var sql=$sql.cases.del;
  conn.query(sql, function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})


//登录/注册//

router.post('/userLogin',(req,res)=>{
  var sql=$sql.users.find;
  var params=req.body;
  var secretkey='pxp'
  console.log(params.userPwd.length)
  if(params.userPwd.length==6)
      params.userPwd=md5(md5(params.userPwd));
  conn.query(sql,[params.userName,params.userPwd],function(err,result){
    if(err){
      console.log(err);
    }
    if(result[0]){
      console.log(result[0])
      var token=jwt.sign({username:params.userName},secretkey,{expiresIn:60*30});//expiresIn授权时效30分钟
      var username=result[0].username
      // jsonWrite(res,result);

      res.json({
        result,
        token,
        username,
        msg:'登录成功',
        isLogin:true,
      })
    }else{
      res.json({
        msg:'用户名或密码错误',
      })
    }
  })
})

router.post('/userFind',(req,res)=>{
  var params=req.body;
  conn.query($sql.users.search,[params.userName],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})


router.post('/userRegiste',(req,res)=>{
  var params=req.body;
  params.userPwd=md5(md5(params.userPwd));
  conn.query($sql.users.add,[params.userName,params.userPwd],function(err,result){
    if(err){
      console.log(err);
    }
    if(result){
      jsonWrite(res,result);
    }
  })
})
module.exports = router;
