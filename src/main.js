// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Axios from 'axios'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import Vuex from 'vuex'
// import Vuevalidator from 'vue-validator'



// Vue.use(Vuevalidator);
Vue.use(VueResource);
Vue.config.productionTip = false;
// Vue.prototype.$http = axios;
Vue.use(ElementUI);

Vue.use(Vuex)

const ADD_COUNT='ADD_COUNT'
const ADD_TOKEN='ADD_TOKEN'
const REMOVE_COUNT='REMOVE_COUNT'

var store=new Vuex.Store({
  state:{
    token:sessionStorage.getItem('token'),
    username:sessionStorage.getItem('username'),
    isLogin:false,
  },
  mutations:{
    [ADD_TOKEN](state,token){
      sessionStorage.setItem("token",token);
      state.token=token
    },
    [ADD_COUNT](state,username){
      sessionStorage.setItem("username",username);
      state.username=username
      state.isLogin=true
    },
    [REMOVE_COUNT](state){
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
    },
  },
})

router.beforeEach((to,from,next)=>{
  store.state.token=sessionStorage.getItem('token');
  store.state.username=sessionStorage.getItem('username');
  if(to.fullPath=='/admin'){
    if(sessionStorage.username=='admin'){
      next();
    }else{
      next({
        path:'/home'
      })
    }
  }
  if(to.meta.requireAuth){
    if(sessionStorage.getItem('token')){
      next();
    }else{
      next({
        path:'/',
        query:{redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
  if(to.fullPath=='/login'){
    if(sessionStorage.getItem('token')){
      next({
        path:from.fullPath
      });
    }else{
      next();
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
