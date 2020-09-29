<template>
	<v-select
		:items="items"
		v-model="Lang"
		prepend-icon="fa-language"
		outlined
		class="admin-language"
		id="admin-language"
	></v-select>
</template>
<style scoped>
	.admin-language >>> .v-input__control{
		flex-direction: unset;
		flex-grow: unset;
		flex-wrap: unset;
		width: unset;
	}
	.admin-language{
		flex:unset;
	}
	.admin-language >>> .v-input__slot{
		margin-bottom:unset;
	}
	
</style>
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
		computed:{
			Lang:{
				get(){
					return this.$store.state.language;
				},
				set(newLang){
					this.$store.commit('setLanguage',newLang);
					this.$root.loadLanguageAsync();
				}
			}
		}
	}
</script>