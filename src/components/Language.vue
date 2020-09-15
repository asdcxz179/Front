<template>
	<v-select
		:items="items"
		v-model="selLang"
	></v-select>
</template>
<script>
	export default {
		data: () => ({
			items:['en','zhHant'],
			selLang: 'en',
		}),
		watch: {
			selLang: function (lang) {
				this.setLang(lang);
			}
		},
		methods:{
			setLang(lang){
				this.$store.commit('setLanguage',lang);
				this.loadLanguageAsync();
			},
			loadLanguageAsync:function(){
				return import(`../lang/${this.$store.state.language}.json`).then(msgs => {
					this.$i18n.setLocaleMessage(this.$store.state.language, msgs.default);
					this.$common.i18n.setLocaleMessage(this.$store.state.language, msgs.default);
					return this.setI18nLanguage();
				});
			},
			setI18nLanguage:function(){
				this.$i18n.locale = this.$store.state.language;
				this.$common.i18n.locale = this.$store.state.language;
				this.$vuetify.lang 	=	{t: (key, ...params) => this.$i18n.t(key, params)};
				this.$cookies.set('lang',this.$i18n.locale);
				document.querySelector('html').setAttribute('lang', this.$i18n.locale);
				return this.$i18n.locale;
			}
		},
		created:function(){
            var lang = this.$cookies.get('lang');
			if(lang){
				this.selLang 	=	lang;
			}
        },
        mounted:function(){
			var lang = this.$cookies.get('lang');
			if(lang){
				this.selLang 	=	lang;
			}
			this.loadLanguageAsync();
		},
	}
</script>