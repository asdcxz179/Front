<template>
	<v-row>
		<v-col >
			<v-select
				:items="items"
				v-model="Lang"
			></v-select>
		</v-col>
	</v-row>
</template>
<script>
	export default {
		data: () => ({
			items:[
				{
					text:'English',
					value:'en',
				},
				{
					text:'繁體中文',
					value:'zhHant',
				},
			],
		}),
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
				this.$store.commit('setLanguage',lang);
			}
        },
        mounted:function(){
			var lang = this.$cookies.get('lang');
			if(lang){
				this.$store.commit('setLanguage',lang);
			}
			this.loadLanguageAsync();
		},
		computed:{
			Lang:{
				get(){
					return this.$store.state.language;
				},
				set(newLang){
					this.$store.commit('setLanguage',newLang);
					this.loadLanguageAsync();
				}
			}
		}
	}
</script>