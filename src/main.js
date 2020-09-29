import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import common from './common/index'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Language from './components/Language.vue';
import Password from './components/Password.vue';
import VueCookies from 'vue-cookies'
import VueI18n from 'vue-i18n'

const i18n = new VueI18n();

Vue.use(VueCookies);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false
Vue.prototype.$common = common;
Vue.prototype.$axios = axios;

axios.interceptors.request.use(function(config){
  config.headers.authorization = "Bearer "+common.GetToken();
  return config;
})

axios.interceptors.response.use(response=>{ 
	return response
},error=>{
	common.AxiosHandle(error.response)
	return error.response
});

Vue.component('v-language',Language);
Vue.component('v-password',Password);

new Vue({
  vuetify,
  router,
  store,
  axios,
  i18n,
  render: h => h(App),
  methods:{
    setLang(lang){
      this.$store.commit('setLanguage',lang);
      this.loadLanguageAsync();
    },
    loadLanguageAsync:function(){
      return import(`./lang/${this.$store.state.language}.json`).then(msgs => {
        this.$i18n.setLocaleMessage(this.$store.state.language, msgs.default);
        this.$common.i18n.setLocaleMessage(this.$store.state.language, msgs.default);
        return this.setI18nLanguage();
      });
    },
    setI18nLanguage:function(){
      this.$i18n.locale = this.$store.state.language;
      this.$common.i18n.locale = this.$store.state.language;
      this.$vuetify.lang  = {t: (key, ...params) => this.$i18n.t(key, params)};
      this.$cookies.set('lang',this.$i18n.locale);
      document.querySelector('html').setAttribute('lang', this.$i18n.locale);
      return this.$i18n.locale;
    }
  },
  created:function(){
    var lang = this.$cookies.get('lang');
    if(lang){
      this.$store.commit('setLanguage',lang);
    }
      },
      mounted:function(){
    var lang = this.$cookies.get('lang');
    if(lang){
      this.$store.commit('setLanguage',lang);
    }
    this.loadLanguageAsync();
  }
}).$mount('#app')
