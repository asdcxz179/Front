<template>
    <v-app id="inspire">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <ValidationObserver ref="observer" >
                            <v-form 
                                @submit="this.login"
                            >
                                <v-card class="elevation-12">
                                    <v-toolbar
                                        color="primary"
                                        dark
                                        flat
                                        align="center"
                                    >
                                        <v-toolbar-title>{{$t('login-page.login-form-title')}}</v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text>
                                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.account')" rules="required|min:6|max:12">
                                            <v-text-field 
                                                v-bind:label="$t('common.account')" 
                                                v-model="LoginForm.username" 
                                                prepend-icon="mdi-account" 
                                                type="text"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password')" rules="required|min:6|max:12">
                                            <v-text-field 
                                                id="password" 
                                                v-model="LoginForm.password" 
                                                v-bind:label="$t('common.password')" 
                                                prepend-icon="mdi-lock" 
                                                type="password"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </ValidationProvider>
                                            <v-row>
                                                <v-col cols="6" md="6">
                                                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.captcha')" rules="required|alpha_num">
                                                        <v-text-field 
                                                        id="captcha" 
                                                        v-model="LoginForm.captcha" 
                                                        v-bind:label="$t('common.captcha')" 
                                                        prepend-icon="fa-door-open" 
                                                        type="text"
                                                        :error-messages="errors"
                                                    ></v-text-field>
                                                    </ValidationProvider>
                                                </v-col>
                                                <v-col col="6" md="6">
                                                    <v-img class="captcha" :src="captcha" v-on:click="this.GetCaptcha"></v-img>
                                                </v-col>
                                            </v-row>
                                        
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-row jus>
                                            <v-col col="12" md="6">
                                                <v-language></v-language>
                                            </v-col>
                                            <v-col col="12" md="6">
                                                <v-btn color="primary" type="submit" >{{$t('login-page.login')}}</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </ValidationObserver>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<style scoped>
    .captcha{
        cursor: pointer;
    }
</style>
<script>
    export default {
        data () {
            return {
                alert: true,
                source:"#",
                captcha:"",
                LoginForm:{
                    username:"",
                    password:"",
                    captcha:"",
                    captcha_key:"",
                }
            }
        },
        created:function(){
            this.GetCaptcha();
        },
        methods:{
            login(){
                this.$refs.observer.validate().then(result => {
                    if(result){
                        this.$axios.post('/api/v1/Login',this.LoginForm).then((res)=>{
                            if(res.data.status=='success'){
                                this.$common.SetToken(res.data.data.token);
                                this.$common.SetUuid(res.data.data.uuid);
                                this.$router.push('Admin');
                            }
                        });    
                    }
                })
            },
            GetCaptcha(){
                this.$common.Captcha().then(data=>{
                    this.captcha    =   data.img;
                    this.LoginForm.captcha_key        =   data.key;
                });
            }
        },
    }
</script>