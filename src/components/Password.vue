<template>
	<div>
		<v-dialog v-model="password_dialog" persistent max-width="600px">
			<template #activator="{ on: dialog }">
				<v-tooltip bottom >
					<template #activator="{ on: tooltip }">
						<v-btn icon
							v-on="{ ...tooltip, ...dialog }"
						>
							<v-icon>fa-key</v-icon>
						</v-btn>
					</template>
					<span>{{$t('admin.change_password')}}</span>
				</v-tooltip>
			</template>
			<ValidationObserver ref="observer" >
				<v-form @submit="this.change" ref="password_form">
					<v-card>
						<v-card-title>
							<span class="headline">{{$t('admin.change_password')}}</span>
						</v-card-title>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password')" rules="required|min:6|max:12">
											<v-text-field 
												v-bind:label="$t('common.password')" 
												type="password" 
												required 
												v-model="PasswordForm.password"
												:error-messages="errors"
											></v-text-field>
										</ValidationProvider>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="password_dialog = false">{{$t('common.close')}}</v-btn>
							<v-btn color="blue darken-1" text type="submit">{{$t('common.confirm')}}</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>
			</ValidationObserver>
		</v-dialog>
	</div>
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
			password_dialog: false,
			PasswordForm:{
				password:""
			}
		}),
		methods:{
			change(){
				this.$refs.observer.validate().then(result => {
                    if(result){
                        this.$axios.put('/api/v1/ChangePassword/'+this.$common.GetUuid(),this.PasswordForm).then((res)=>{
							if(res.data.status=='success'){
								this.$common.AxiosHandle(res);
								this.password_dialog	=	false;
								this.$refs.password_form.reset()
							}
						});
                    }
                })
			}
		},
	}
</script>