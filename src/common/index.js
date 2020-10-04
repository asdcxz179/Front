
import Vue from 'vue'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueI18n from 'vue-i18n'



Vue.use(VueSweetalert2)

const common = {};

common.i18n = new VueI18n();

common.GetToken = function(){
  return localStorage.getItem('token');
}

common.SetToken = function($token){
  return localStorage.setItem('token',$token);
}

common.RemoveToken = function(){
  return localStorage.removeItem('token');
}

common.GetUuid = function(){
  return localStorage.getItem('uuid');
}

common.SetUuid = function($uuid){
  return localStorage.setItem('uuid',$uuid);
}

common.RemoveUuid = function(){
  return localStorage.removeItem('uuid');
}

common.CheckLogin = function(){
	return new Promise(function(resolve,reject){
		if(common.GetToken()==null){
			reject(false);
		}else{
			axios.get('/api/v1/Check').then((res)=>{
				if(res.data.status=='error'){
					common.RemoveToken();
					common.RemoveUuid();
					reject(false);
				}else{
					resolve(true);
				}
			});	
		}
	});
}

common.Captcha 	=	function(){
	return new Promise(function(resolve,reject){
		axios.get('/api/v1/Captcha').then((res)=>{
			if(res.data.status=='error'){
				reject(res.data);
			}else{
				resolve(res.data.message);
			}
		});	
	})
}

common.AxiosHandle = function (data){
	var swal_settings 	=	{
		heightAuto:false,
	};
	switch(data.status){
		case 200:
			swal_settings.title 	=	this.i18n.t('common').success;
			swal_settings.icon 		=	'success';
			swal_settings.html 		=	data.data.message;
		break;
		case 401:
			swal_settings.icon 		=	data.data.status;
			swal_settings.html 		=	data.data.message;
		break;
		case 422:
			swal_settings.title 	=	this.i18n.t('common').warning;
			swal_settings.icon 		=	'warning';
			swal_settings.html 		=	data.data.message;
		break;
		case 500:
			swal_settings.title 	=	this.i18n.t('common').error;
			swal_settings.icon 		=	'error';
			swal_settings.html 		=	this.i18n.t('common.system-error');
		break;
		default:
			swal_settings.title 	=	this.i18n.t('common').error;
			swal_settings.icon 		=	'error';
			swal_settings.html 		=	this.i18n.t('common.undefind-error')+':'+data.status;
		break;
	}
	Vue.swal(swal_settings);
}

common.DataNoHandle = function(datas,page,limit){
	var no = ((page-1)*limit)+1;
	for(var data in datas){
		datas[data]['no']	=	no;
		no++;
	}
	return datas;
}

common.SortHandle = function(options){
	let extend  = '';
    if(options.sortBy.length>0){
      let sort  = 'asc';
      if(options.sortDesc[0]){
        sort = 'desc';
      }
      extend+='&orderby='+options.sortBy[0]+'&sort='+sort;
    }
    return extend;
}

export default common