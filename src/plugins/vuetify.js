import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueI18n from 'vue-i18n'

Vue.use(Vuetify);
Vue.use(VueI18n);

const i18n = new VueI18n()

export default new Vuetify({
	lang: {
		t: (key, ...params) => i18n.t(key, params),
	},
});
