
import axios from 'axios'

const common = {};

common.GetToken = function(){
  return localStorage.getItem('token');
}

common.CheckLogin = function(){
	axios.get('/api/v1/Check').then(function(response){
		console.log(response);
	}).catch(function(error){
		console.log(error);
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
		case 422:
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
	// Vue.swal(swal_settings);
}

export default common