<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<template>
  <div class="hello">
    
      <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <!-- 默认打开1和3状态 default-openeds="['1','3']"-->
        <el-menu :default-openeds="['1','2','3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>看病</template>
            <el-menu-item-group>
              <template slot="title">医案</template>
              <el-menu-item index="1-1" @click="flag='0' , isAddVisible=false, allList()">医案一览</el-menu-item>
              <el-menu-item index="1-2" @click="flag='0' , handleAddVisible=true ,deletePatient(),deleteByName(),add(),addPatient(),symptomList()">添加医案</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>维护</template>
            <el-menu-item-group>
              <template slot="title">症状</template>
              <el-menu-item index="2-1" @click="flag='1',allList()" >症状一览</el-menu-item>
              <el-menu-item index="2-2" @click="handleAddVisible=true, flag='1'">添加症状</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">药材</template>
              <el-menu-item index="2-3" @click="flag='2', allList()">药材一览</el-menu-item>
              <el-menu-item index="2-4"  @click="handleAddVisible=true, flag='2'">添加药材</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>管理员</template>
            <el-menu-item-group>
              <template slot="title">管理员</template>
              <el-menu-item index="3-1">管理员一览</el-menu-item>
              <el-menu-item index="3-2">添加管理员</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      

      <!-- 搜索  -->
      <el-container v-show="list">
        <el-header style="text-align: center; font-size: 24px;vertical-align:middle;display:inline-block;vertical-align:middle; ">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="">
            <el-input v-model="name" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchByName">搜索</el-button>
          </el-form-item>
        </el-form>
        </el-header>


        <!-- 查看表里的数据 -->
        <el-main>
          <el-table :data="list" v-show="list">
            <el-table-column prop="Id" label="Id" width="180" >
            </el-table-column>
            <el-table-column prop="date" label="日期" width="250" v-if="flag==='0'">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="200" v-if="flag==='0'">
            </el-table-column>
            <el-table-column prop="diagnose" label="诊断" width="200" v-if="flag==='0'">
            </el-table-column>
            <el-table-column prop="sname" label="症状" width="200" v-if="flag==='1'|flag==='0'">
            </el-table-column>
            <el-table-column prop="name" label="药材" width="200"  v-if="flag==='2'">
            </el-table-column>
            <el-table-column prop="remarks" label="备注">
            </el-table-column>
            <el-table-column fixed="right" label="操作"  width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" v-if="flag!=='0'">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>




    <!-- 修改窗口 -->
    <!-- <edit-container v-show="handleEditVisible" @click="handleEditVisible = true" ></edit-container> -->
    <el-dialog title="修改" :visible.sync="handleEditVisible">
        <el-form :model="form">
            <el-form-item label="症状" :label-width="formLabelWidth" v-if="flag==='1'">
                <el-input  v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药材" :label-width="formLabelWidth" v-if="flag==='2'">
                <el-input  v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item   label="备注" :label-width="formLabelWidth">
                <el-input style="resize: none;" type="textarea" :rows="10" placeholder="请输入内容" v-model="form.remarks"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateById">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加窗口 -->
    <el-dialog title="添加" :visible.sync="handleAddVisible">
        <el-form >
          <el-form-item label="姓名" :label-width="formLabelWidth" v-if="flag==='0'">
                <el-input  v-model="name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="年龄" :label-width="formLabelWidth" v-if="flag==='0'">
                <el-input  v-model="age" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" v-if="flag==='0'">
              <el-radio v-model="gender" label="男">男</el-radio>
              <el-radio v-model="gender" label="女">女</el-radio>
            </el-form-item> 
            <el-form-item label="症状" :label-width="formLabelWidth" v-if="flag==='0'">
                <el-select v-model="values" multiple placeholder="请选择" @remove-tag="delDisease">
                  <el-option
                    v-for="item in symptom"
                    :key="item.Id"
                    :label="item.sname"
                    :value="item.Id"
                    :sid="item.Id"
                    :disabled="item.disabled"
                    @click.native="sid=item.Id,addOrDeleteDisease()"
                    >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="诊断" :label-width="formLabelWidth" v-if="flag==='0'">
                <el-input  v-model="diagnose" autocomplete="off"></el-input>
            </el-form-item>      
            <el-form-item label="症状" :label-width="formLabelWidth" v-if="flag==='1'">
                <el-input  v-model="name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药材" :label-width="formLabelWidth"  v-if="flag==='2'">
                <el-input  v-model="name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item   label="备注" :label-width="formLabelWidth">
                <el-input  style="resize: none;" type="textarea" :rows="10" placeholder="请输入内容" v-model="remarks" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="deleteDisease(),deleteByName() ,deletePatient(), handleAddVisible=false ">取 消</el-button>
            <el-button type="primary" @click="addCase(),handleAddVisible=false" >添加</el-button>
        </div>
    </el-dialog>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
  </div>
  
</template>

<script>
import axios from 'axios';
  export default {
    name: 'hello',
    data () {
      return {
        isAdd:false,
        values:[],
        symptom:'',
        gender:'男',
        diagnose:'',
        symptom:'',
        age:'',
        flag:'1',
        msg: '',
        name: '',
        sid:'',
        id:'',
        pid:'',
        list:'',
        handleEditVisible:false,
        handleAddVisible:false,
        remarks:'',
        formLabelWidth: '120px',
        form: {
          id:'',
          name: '',
          remarks:''
        },
      }
    },
    methods: {
      //添加
      add() {
        var name = this.name;
        var remarks = this.remarks;
        var flag=this.flag;
        var self=this;
        axios.post('/api/user/add',{
            name:name,
            remarks:remarks,
            flag:flag,
        }).then((res)=>{
          console.log(res.data);
          self.msg="提交成功！！"
          // alert(self.msg);
          this.allList();
          this.name=this.remarks='';
        }).catch((err)=>{
          console.log(err);
        })
      },
      //修改表的信息
      updateById(){
        this.handleEditVisible = false
        var name=this.form.name;
        var remarks=this.form.remarks;
        var id=this.form.id;
        var flag=this.flag;
        axios.post('/api/user/updateById',{
          id:id,
          name:name,
          remarks:remarks,
          flag:flag,
        }).then((res)=>{
          console.log(res.data);
          id='';
          this.allList()
        }).catch((err)=>{
          console.log(err);
        })
      },

      //查看
      allList(){
        var flag=this.flag;
        console.log(flag);
        axios.post('/api/user/allList',{
          flag:flag,
        }).then((res)=>{
          console.log(res);
          this.list = res.data;
          console.log(this.list);
        }).catch((err)=>{
          console.log(err);
        })
      },
      //修改按钮
      handleEdit(index, row) {
        this.handleEditVisible=true;
        this.form.id=row.Id;
        this.form.name=row.name;
        this.form.remarks=row.remarks;
        console.log(this.handleEditVisible);
        console.log(index, row);
      },


      //删除
      handleDelete(index, row) {
        console.log(index, row);
        console.log(row.Id);
        var id=row.Id;
        var flag=this.flag;
        axios.post('/api/user/handleDelete',{
          id:id,
          flag:flag
        }).then((res)=>{
          console.log(res.data);
          id='';
          this.allList();
        }).catch((err)=>{
          console.log(err);
        })
      },
      deleteByName(){
        axios.post('/api/user/deleteByName',{
        }).then((res)=>{
          console.log(res.data);
          this.allList()
        }).catch((err)=>{
          console.log(err);
        })
      },
      //查找
      searchByName(){
        var flag=this.flag;
        var name='%'+this.name+'%';
        console.log(flag);
        axios.post('/api/user/searchByName',{
          flag:flag,
          name:name,
        }).then((res)=>{
          console.log(res);
          this.list = res.data;
          this.name='';
          console.log(this.list);
        }).catch((err)=>{
          console.log(err);
        })       
      },

      addPatient(){
        axios.post('/api/user/addPatient',{
        }).then((res)=>{
          console.log(res.data);
          this.pid=res.data[0].Id;
          console.log(this.pid);
        }).catch((err)=>{
          console.log(err);
        })
      },
      deletePatient(){
        axios.post('/api/user/deletePatient',{
        }).then((res)=>{
          console.log(res.data);
        }).catch((err)=>{
          console.log(err);
        })
      },
      addCase(){
        var name = this.name;
        var age=this.age;
        var gender=this.gender;
        var pid=this.pid;
        var remarks = this.remarks;
        var diagnose=this.diagnose;
        axios.post('/api/user/addCase',{
            name:name,
            age:age,
            gender:gender,
            pid:pid,
            remarks:remarks,
            diagnose:diagnose,
        }).then((res)=>{
          console.log(res.data);
          this.name=this.age=this.pid=this.remarks=this.diagnose='';
          this.msg='提交成功';
          alert(this.msg);
        }).catch((err)=>{
          console.log(err);
        })
      },
      delDisease(){
        var id=this.sid;
        axios.post('api/user/delDiease',{
          id:id,
        }).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      },

      deleteDisease(){
        axios.post('api/user/deleteDisease',{
        }).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      },
      symptomList(){
        axios.post('api/user/symptomList',{

        }).then((res)=>{
          console.log(res);
          this.symptom=res.data;
          console.log(this.symptom);
        }).catch((err)=>{
          console.log(err);
        })
      },
      addDisease(){
         var sid=this.sid;
         axios.post('/api/user/addDisease',{
           sid:sid,
         }).then((res)=>{
           console.log(res);
         }).catch((err)=>{
           console.log(err);
         })
      },
      addOrDeleteDisease(){
           var sid=this.sid;
          console.log(sid);
          axios.post('api/user/addOrDeleteDisease',{
            sid:sid,
          }).then((res)=>{
            console.log(res.data);
            if(res.data==""){
              this.addDisease();
            }
            else{
              this.delDisease();
            }
          }).catch((err)=>{
            console.log(err);
          })
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.el-textarea__inner{
  resize: none !important;
}
  .el-header{
    background: #fff !important
  }

.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
