<template>
    <v-app id="inspire">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>Login form</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn :href="source" icon large target="_blank" v-on="on">
                                            <v-icon>mdi-code-tags</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Source</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field label="Login" v-model="LoginForm.username" prepend-icon="mdi-account" type="text"></v-text-field>
                                    <v-text-field id="password" v-model="LoginForm.password" label="Password" prepend-icon="mdi-lock" type="password"></v-text-field>
                                    <v-text-field id="captcha" v-model="LoginForm.captcha" label="Captcha" prepend-icon="mdi-lock" type="text"></v-text-field>
                                    <v-img :src="captcha"></v-img>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" v-on:click="this.login">Login</v-btn>
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
                    }
                });
            }
        }
    }
</script>