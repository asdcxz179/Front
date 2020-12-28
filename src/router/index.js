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
      },
      {
        path: 'Settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: 'Managers',
        name: 'Managers',
        component: () => import('../views/Managers.vue')
      },
      {
        path: 'ManagerGroup',
        name: 'ManagerGroup',
        component: () => import('../views/ManagerGroup.vue')
      },
      {
        path: 'ManagerRole',
        name: 'ManagerRole',
        component: () => import('../views/ManagerRole.vue')
      },
      {
        path: 'Experience',
        name: 'Experience',
        component: () => import('../views/Experience.vue')
      },
      {
        path: 'WebPage',
        name: 'WebPage',
        component: () => import('../views/WebPage.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  common.CheckLogin().then(()=>{
    if(to.name!=="Login"){
      next();  
    }else{
      next({path:'/'});
    }
  }).catch(()=>{
    if(to.name!=="Login"){
      next({path:'login'});
    }else{
      next();
    }
  });
})

export default router
