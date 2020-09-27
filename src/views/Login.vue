<template>
    <v-app id="inspire">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
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
                                <v-form>
                                    <v-text-field v-bind:label="$t('common.account')" v-model="LoginForm.username" prepend-icon="mdi-account" type="text"></v-text-field>
                                    <v-text-field id="password" v-model="LoginForm.password" v-bind:label="$t('common.password')" prepend-icon="mdi-lock" type="password"></v-text-field>
                                    <v-row>
                                        <v-col cols="6" md="6">
                                            <v-text-field id="captcha" v-model="LoginForm.captcha" v-bind:label="$t('common.captcha')" prepend-icon="fa-door-open" type="text"></v-text-field>
                                        </v-col>
                                        <v-col col="6" md="6">
                                            <v-img :src="captcha"></v-img>
                                        </v-col>
                                    </v-row>
                                    
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-row jus>
                                    <v-col col="12" md="6">
                                        <v-language></v-language>
                                    </v-col>
                                    <v-col col="12" md="6">
                                        <v-btn color="primary" v-on:click="this.login">{{$t('login-page.login')}}</v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
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
            this.$common.Captcha().then(data=>{
                this.captcha    =   data.img;
                this.LoginForm.captcha_key        =   data.key;
            });
        },
        methods:{
            login(){
                this.$axios.post('/api/v1/Login',this.LoginForm).then((res)=>{
                    if(res.data.status=='success'){
                        this.$common.SetToken(res.data.data.token);
                        this.$common.SetUuid(res.data.data.uuid);
                        this.$router.push('Admin');
                    }
                });
            }
        },
    }
</script>