import Vue from 'vue'
import Router from 'vue-router'
import AdminInterface from '@/components/AdminInterface'
import LoginContainer from '@/components/LoginContainer'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)


export default new Router({
  mode :'history',
  routes: [
    {
      path:'/',
      name:'LoginContainer',
      component:LoginContainer,
    },
    {
      path: '/admin',
      name: 'AdminInterface',
      component: AdminInterface,
      meta:{
        requireAuth:true,
      },
    },
    {
      path:'/home',
      name:'HelloWorld',
      component:HelloWorld,
    },
  ],
})

