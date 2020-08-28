
import Vue from 'vue'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2)

const common = {};

common.GetToken = function(){
  return localStorage.getItem('token');
}

common.SetToken = function($token){
  return localStorage.setItem('token',$token);
}

common.RemoveToken = function(){
  return localStorage.removeItem('token');
}

common.CheckLogin = function(){
	return new Promise(function(resolve,reject){
		if(common.GetToken()==null){
			reject(false);
		}else{
			axios.get('/api/v1/Check').then((res)=>{
				if(res.data.status=='error'){
					common.RemoveToken();
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
			// swal_settings.title 	=	i18n.t('common').success;
			swal_settings.icon 		=	'success';
			swal_settings.html 		=	data.data.message;
		break;
		case 401:
			swal_settings.icon 		=	data.data.status;
			swal_settings.html 		=	data.data.message;
		break;
		case 422:
			console.log(422);
			// swal_settings.title 	=	i18n.t('common').warning;
			swal_settings.icon 		=	'warning';
			swal_settings.html 		=	data.data.message;
		break;
		case 500:
			// swal_settings.title 	=	i18n.t('common').error;
			swal_settings.icon 		=	'error';
			// swal_settings.html 		=	i18n.t('common.system-error');
		break;
		default:
			// swal_settings.title 	=	i18n.t('common').error;
			swal_settings.icon 		=	'error';
			// swal_settings.html 		=	i18n.t('common.undefind-error')+':'+data.status;
		break;
	}
	Vue.swal(swal_settings);
}

export default common