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
import { localize } from 'vee-validate';
import { required, email, max, min, alpha,alpha_num } from 'vee-validate/dist/rules'
import { extend,ValidationObserver, ValidationProvider } from 'vee-validate'
import Editor from '@tinymce/tinymce-vue';


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
Vue.component('ValidationProvider',ValidationProvider);
Vue.component('ValidationObserver',ValidationObserver);
Vue.component('Editor',Editor);

extend('required',required);
extend('email',email);
extend('max',max);
extend('min',min);
extend('alpha',alpha);
extend('alpha_num',alpha_num);

new Vue({
  vuetify,
  router,
  store,
  axios,
  i18n,
  render: h => h(App),
  data(){
    return {
      i18n_trans:{
        'zhHant':'zh_TW',
        'zhHans':'zh_CN'
      },
      tinymce_i18n_trans:{
        'zhHant':'zh_TW',
        'zhHans':'zh_CN',
      },
      tinymce_key:"c8tg740vi4cs0fpjbo68sh5dpbg35j9u33sthxo6ks8kyv0n",
      editorOption:{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap',
                        'searchreplace visualblocks code fullscreen',
                        'print preview anchor insertdatetime media',
                        'paste code help wordcount table'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic | \
                        alignleft aligncenter alignright | \
                        bullist numlist outdent indent image | help',
                      language: "en",
                      file_picker_callback: function (cb) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = function () {
                          var file = this.files[0];
                          var reader = new FileReader();
                          reader.onload = function () {
                            var id = 'blobid' + (new Date()).getTime();
                            var blobCache =  window.tinymce.activeEditor.editorUpload.blobCache;
                            var base64 = reader.result.split(',')[1];
                            var blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);

                            cb(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };

                        input.click();
                      },
                    }
    }
    
  },
  methods:{
    setLang(lang){
      this.$store.commit('setLanguage',lang);
      this.loadLanguageAsync();
    },
    loadLanguageAsync:function(){
      
      return import(`./lang/${this.$store.state.language}.json`).then(msgs => {
        this.$i18n.setLocaleMessage(this.$store.state.language, msgs.default);
        this.$common.i18n.setLocaleMessage(this.$store.state.language, msgs.default);
        this.setI18nLanguage();
        this.loadVeeLanguage();
        this.loadTinyMceLanguage();
        return true;
      });
    },
    loadVeeLanguage:function(){
      var lang  = this.i18n_trans[this.$store.state.language];
      if(lang===undefined){
        lang =  this.$store.state.language;
      }
      return import(`vee-validate/dist/locale/${lang}.json`).then(msgs => {
        localize(this.$store.state.language,msgs.default);
      })
    },
    loadTinyMceLanguage:function(){
      var lang  = this.tinymce_i18n_trans[this.$store.state.language];
      if(typeof(this.tinymce_i18n_trans[this.$store.state.language])=='undefined'){
        lang  = this.$store.state.language;
      }
      this.editorOption.language = lang;
      if(typeof(window.tinymce)!='undefined'){
        console.log(window.tinymce)
      }
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
