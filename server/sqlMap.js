/**
 * Created by xiaoze on 2017/12/5.
 */
// sql语句
var sqlMap = {
  // 用户
  symptom: {
    add: 'insert into symptom( name, remarks) values ( ?, ?)',
    select:'select Id,name as sname ,remarks  from symptom order by Id',
    delete:'delete FROM symptom where Id=?',
    update:'update symptom set name=? , remarks=? where Id= ? ',
    search:'select * from symptom where name like ?'//问好里面放'%?%',问号为查询的内容
  },
  user:{
    add:'insert into user( name, roles) values ( ?, ?)',
    select:'select * from user order by Id=?',
    delete:'delete from user where Id=?',
    update:'update user set name=? ,remarks=? where Id= ? ',
    search:'select * from user where name like ?'
  },
  medicine:{
    add:'insert into medicine( name ,  remarks) values (?, ?)',
    select :'select * from medicine order by Id',
    delete:'delete from medicine where Id=?',
    update:'update medicine set name=? , remarks=? where Id= ? ',
    search:'select * from medicine where name like ?'
  },
  cases:{
    add:"insert into cases(date,diagnose) values(CURDATE(), 'temp' )",
    update:"update cases set diagnose=?,remarks=?,pid=? where diagnose= 'temp' ",
    del:"delete from cases where diagnose = 'temp'",
    select :'select cases.Id,patient.name,cases.date,cases.diagnose,cases.remarks,symptom.name as sname  from patient,cases,symptom,disease where patient.Id=cases.pid and disease.sid=symptom.id and disease.cid=cases.Id order by cases.Id',//select patient.name,cases.date,cases.diagnose,cases.remarks from patient,cases where patient.Id=cases.pid;
    delete:'delete from cases where Id=?',
    search:'select patient.name,cases.date,cases.diagnose,cases.remarks from patient,cases where patient.Id=cases.pid and name like ?',
    find:"select * from cases where diagnose='temp'"
  },
  disease:{
    add:"insert into disease(cid,sid) values((select Id from cases where diagnose= 'temp'),?)",
    del:"delete from disease where sid=? and cid=(select Id from cases where diagnose= 'temp')",
    delete :"delete from disease where cid=(select Id from cases where diagnose= 'temp')",
    find:"select * from disease where cid=(select Id from cases where diagnose= 'temp') and sid=?",
    
  },
  patient:{
    add:"insert into patient(name) values('temp')",
    update:"update patient set name=?,age=?,sex=? where name='temp'",
    del:"delete from patient where name='temp'",
    find:"select Id from patient where name='temp' ",
  },
  users:{
    add:"insert into users(username,password) values(?,?)",
    search:"select * from users where username=?",
    delete:"delete from users where username=?",
    find:"select * from users where username=? and password=?",
  }
}
module.exports = sqlMap
