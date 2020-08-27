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
  common.CheckLogin().then(()=>{
    console.log('reslove')
    next();
  }).catch(()=>{
    console.log('reject')
    if(to.name!=="Login"){
      next({path:'login'});
    }else{
      next();
    }
  });
})

export default router
