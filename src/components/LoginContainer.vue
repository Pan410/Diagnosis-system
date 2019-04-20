<template>
    <div>
        <el-button type="text" v-show="!$store.state.token" @click="dialogFormVisible = true">登录/注册</el-button>
         <el-button type="text" v-show="$store.state.token" @click="logout">[退出]</el-button>
        <el-dialog title="登录/注册" :visible.sync="dialogFormVisible">


        <el-form >
            <el-form-item label="用户名" :label-width="formLabelWidth" >
                <el-input  v-model="userName" autocomplete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input  type="password" v-model.lazy="userPwd" autocomplete="off" placeholder="请输入密码"></el-input>
                <span class="err" v-if="userPwd">{{passwordValidate.errorText}}</span>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" v-if="show">
                <el-input  type="password" v-model.lazy="passwordConfirm" autocomplete="off" placeholder="请输入密码"></el-input>
                <span class="err" v-if="passwordConfirm">{{passwordCheckValidate.errorText}}</span>
            </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
            <a href="#" @click="show=!show" v-if="!show">没有账号？点击注册！</a>
            <a href="#" @click="show=!show" v-if="show">已有账号！返回登录！</a>
            <el-button @click="dialogFormVisible = false ">取 消</el-button>
            <el-button type="primary" @click="userLogin" v-if="!show ">登 录</el-button>
            <el-button type="primary" @click="userRegiste" v-if="show " >注册</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
export default{
    data(){
        return{
            userName:'',
            passwordConfirm:'',
            userPwd:'',
            show:false,
            dialogFormVisible: false,
            name:'',
            age:'',
            formLabelWidth: '120px',
            isLoginFlag:'',
            isActive:true,
        }
    },
    mounted:function(){
        if(this.getCookie('username')){
            // this.userName=this.getCookie('username')
            // this.userPwd=this.getCookie('password')
            this.isLoginFlag=true
        }else{
            this.isLoginFlag=false
        }
    },
    computed:{

    //    userNameValidate: function() {
    //         var errorText;
    //         if(this.userName=='') {
    //             errorText = '用户名不能为空'
    //         } else {
    //             errorText = ''
    //         }
    //         if(!this.passwordFlag) {
    //             errorText = ''
    //             this.passwordFlag = true

    //         }
    //         return {
    //             errorText
    //         }
    //     },


        passwordValidate: function() {
            var errorText;
            if(!/^[0-9A-Za-z]{6,15}$/.test(this.userPwd)) {
                errorText = '密码少于6位'
            } else {
                errorText = ''
            }
            if(!this.passwordFlag) {
                errorText = ''
                this.passwordFlag = true
            }
            return {
                errorText
            }
        },
        passwordCheckValidate: function() {
            var errorText;
            if(!/^[0-9A-Za-z]{6,15}$/.test(this.passwordConfirm)) {
                errorText = '密码少于6位'
            }else if(this.userPwd !==this.passwordConfirm ){
                errorText = '两次密码不匹配'
            }
            else {
                errorText = ''
            }
            
            if(!this.passwordFlag) {
                errorText = ''
                this.passwordFlag = true
            }
            return {
                errorText
            }
        }
    },
    methods:{
        userLogin(){
            if(this.userName&&this.userPwd){
                var userName=this.userName
                var userPwd=this.userPwd
                var token=sessionStorage.getItem('token')
                axios.post('/api/user/userLogin',{
                    userName:userName,
                    userPwd:userPwd,
                    token:token
                }).then((res)=>{
                    console.log(res.data);
                    if(!res.data.result){
                        alert("用户名或密码错误！！");
                        this.userName='';
                        this.userPwd='';
                    }else{
                        // alert("登录成功！！");
                        this.$message.success(userName+"欢迎登录");

                        console.log(res.data.result[0])
                        // this.$store.commit('ADD_COUNT',res.data.token)
                        this.$store.commit('ADD_TOKEN',res.data.token)
                        this.$store.commit('ADD_COUNT',res.data.username)
                        this.setCookie("username",res.data.result[0].username,1)
                        this.setCookie("password",res.data.result[0].password,1)
                        console.log(res.data.token)
                        this.dialogFormVisible=false
                        this.userName=this.getCookie('username');
                        this.userPwd=this.getCookie('password');
                        this.isLogin=true;
                        if(res.data.username=='admin')
                            this.$router.push('/admin')
                        window.location.reload();
                    }
                }).catch((err)=>{
                    console.log(err);
                })
                }
                if(!this.userName){
                    // alert("用户名不能为空！！");
                    // console.log(userName)
                    this.$message.error("用户名为空")
                }
                if(!this.userPwd){
                    // alert("密码不能为空");
                    // console.log(userPwd)
                    this.$message.error("密码为空");
                }
                
        },
        logout(){
            this.$store.state.isLogin=false;
            this.$store.commit('REMOVE_COUNT');
            window.location.reload();
            // this.clearCookie()
        },
        userRegiste(){
            var userName=this.userName
            var userPwd=this.userPwd
            axios.post('/api/user/userFind',{
                userName:userName,
            }).then((res)=>{
                console.log(res);
                if(!res.data[0]){
                    axios.post('/api/user/userRegiste',{
                        userName:userName,
                        userPwd:userPwd,
                    }).then((res)=>{
                        console.log(res);
                        this.$store.commit('ADD_TOKEN',res.data.token)
                        this.$store.commit('ADD_COUNT',res.data.username)
                        this.setCookie("username",res.data.result[0].username,1)
                        this.setCookie("password",res.data.result[0].password,1)
                        this.userName=this.getCookie('username');
                        this.userPwd=this.getCookie('password');

                    }).catch((err)=>{
                        console.log(err);
                    })
                }else{
                    alert("用户名已存在，请修改！！")
                }
            }).catch((err)=>{
                console.log(err);
            })
        },



        // cookie操作

        setCookie(cname,cvalue,exdays){
            var d=new Date();
            d.setTime(d.getTime()+(exdays));
            var expires="expires"+d.toUTCString();
            console.info(cname+"="+cvalue+";"+expires);
            document.cookie=cname+"="+cvalue+";"+expires;
            console.info(document.cookie);
        },
        getCookie(cname){
            var name=cname+"=";
            var ca =document.cookie.split(";");
            for(var i =0;i<ca.length;i++){
                var c=ca[i];
                while(c.charAt(0)=='')
                    c=c.substring(1);
                if(c.indexOf(name)!=-1)
                    return c.substring(name.length,c.length);
            }
            return "";
        },

        clearCookie(){
            this.setCookie("username","",-1)
            this.setCookie("password","",-1)
        }

    }
}
</script>
<style scoped>
 .err{
    color: red;
    font-size: 10px;
}
</style>
