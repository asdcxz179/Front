import Vue from 'vue'
import VueRouter from 'vue-router'
import common from '../common/index'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  },
  {
    path: '/Admin',
    name: 'Admin',
    component:() => import('../views/Admin.vue'),
    children:[
      {
        path: 'Dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name!=="Login" && common.GetToken() == null){
    next({name:'Login'});
  }else{
    console.log(common.CheckLogin());
    next();  
  }
})

export default router
