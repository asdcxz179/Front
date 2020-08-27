import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import firebase from './firebase'
import common from './common/index'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$common = common;

axios.interceptors.response.use(response=>{
	console.log(response)
	return response
},error=>{
	common.AxiosHandle(error.response)
	return error.response
});

new Vue({
  vuetify,
  router,
  store,
  firebase,
  axios,
  render: h => h(App)
}).$mount('#app')
