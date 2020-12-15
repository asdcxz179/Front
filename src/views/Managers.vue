<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        col="8"
        md="8"
      >
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1"
          :loading="loading" 
          v-bind:loading-text="$t('common.loading')"
          :server-items-length="total"
          :options.sync="options"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>{{$t('managers-page.table-name')}}</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="add_dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >{{$t('managers-page.add-manger')}}</v-btn>
                </template>
                <ValidationObserver ref="RegisterForm" >
                  <v-form @submit="AddManager" ref="add_form">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{$t('managers-page.add-manger')}}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.account')" rules="required|min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.account')" 
                                  type="text" 
                                  required 
                                  v-model="RegisterForm.username"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password')" rules="required|min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.password')" 
                                  type="password" 
                                  required 
                                  v-model="RegisterForm.password"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password_confirmation')" rules="required|min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.password_confirmation')" 
                                  type="password" 
                                  required 
                                  v-model="RegisterForm.password_confirmation"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.name')" rules="required|min:3|max:20">
                                <v-text-field 
                                  v-bind:label="$t('common.name')" 
                                  type="text" 
                                  required 
                                  v-model="RegisterForm.name"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.email')" rules="required|email">
                                <v-text-field 
                                  v-bind:label="$t('common.email')" 
                                  type="text" 
                                  required 
                                  v-model="RegisterForm.email"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.group')" rules="required">
                                <v-select 
                                  v-bind:label="$t('common.group')" 
                                  required 
                                  v-model="RegisterForm.group"
                                  :error-messages="errors"
                                  :items="GroupItems"
                                ></v-select>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.role')" rules="required">
                                <v-select 
                                  v-bind:label="$t('common.role')" 
                                  required 
                                  v-model="RegisterForm.role"
                                  :error-messages="errors"
                                  :items="RoleItems"
                                ></v-select>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="add_dialog=false">{{$t('common.cancel')}}</v-btn>
                        <v-btn color="blue darken-1" text type="submit">{{$t('common.insert')}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </ValidationObserver>
              </v-dialog>
              <v-dialog v-model="edit_dialog" max-width="500px" :retain-focus="false">
                <ValidationObserver ref="EditForm" >
                  <v-form @submit="EditManager" ref="edit_form">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{$t('managers-page.edit-manger')}}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.account')" rules="min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.account')" 
                                  type="text" 
                                  :error-messages="errors"
                                  v-model="EditForm.username"
                                  :disabled="true"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password')" rules="min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.password')" 
                                  type="password" 
                                  v-model="EditForm.password"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.password_confirmation')" rules="min:6|max:12">
                                <v-text-field 
                                  v-bind:label="$t('common.password_confirmation')" 
                                  type="password" 
                                  v-model="EditForm.password_confirmation"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.name')" rules="required|min:3|max:20">
                                <v-text-field 
                                  v-bind:label="$t('common.name')" 
                                  type="text" 
                                  required 
                                  v-model="EditForm.name"
                                  :error-messages="errors"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.email')" rules="email">
                                <v-text-field 
                                  v-bind:label="$t('common.email')" 
                                  type="text" 
                                  required 
                                  v-model="EditForm.email"
                                  :error-messages="errors"
                                  :disabled="true"
                                ></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.group')" rules="required">
                                <v-select 
                                  v-bind:label="$t('common.group')" 
                                  required 
                                  v-model="EditForm.group"
                                  :error-messages="errors"
                                  :items="GroupItems"
                                ></v-select>
                              </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.role')" rules="required">
                                <v-select 
                                  v-bind:label="$t('common.role')" 
                                  required 
                                  v-model="EditForm.role"
                                  :error-messages="errors"
                                  :items="RoleItems"
                                ></v-select>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="edit_dialog=false">{{$t('common.cancel')}}</v-btn>
                        <v-btn color="blue darken-1" text type="submit">{{$t('common.update')}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </ValidationObserver>
              </v-dialog>
              <v-dialog v-model="disable_dialog" max-width="500px" :retain-focus="false">
                <v-card>
                  <v-card-title 
                    class="headline"
                    v-if="DisableStatus==0"
                  >
                    {{$t('managers-page.disable-manger')}}
                  </v-card-title>
                   <v-card-title 
                    class="headline"
                    v-else
                  >
                    {{$t('managers-page.enable-manger')}}
                  </v-card-title>
                  <v-card-text
                    v-if="DisableStatus==0"
                  >
                    {{$t('common.are-you-disable')}}
                  </v-card-text>
                  <v-card-text
                    v-else
                  >
                    {{$t('common.are-you-enable')}}
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="disable_dialog= false"
                    >
                      {{$t('common.cancel')}}
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="DisableManager()"
                    >
                      {{$t('common.confirm')}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.uuid="{ item }">
            <v-tooltip bottom >
              <template #activator="{ on: tooltip }">
                <v-icon
                  small
                  class="mr-2"
                  @click="GetManagerDetail(item.uuid)"
                  v-on="{ ...tooltip}"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>{{$t('managers-page.edit-manger')}}</span>
            </v-tooltip>
            <v-tooltip bottom >
              <template #activator="{ on: tooltip }">
                <v-icon
                  small
                  class="mr-2"
                  v-on="{ ...tooltip}"
                  @click="DisableItem(item)"
                  v-if="item.status==1"
                >
                  mdi-block-helper
                </v-icon>
                <v-icon
                  small
                  class="mr-2"
                  @click="DisableItem(item)"
                  v-on="{ ...tooltip}"
                  v-else
                >
                  mdi-check
                </v-icon>
              </template>
              <span
                v-if="item.status==1"
              >
                {{$t('managers-page.disable-manger')}}
              </span>
              <span
                v-else
              >
                {{$t('managers-page.enable-manger')}}
              </span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        add_dialog:false,
        edit_dialog:false,
        disable_dialog:false,
        loading:true,
        GroupItems:[],
        RoleItems:[],
        EditUUid:"",
        DisableUUid:"",
        DisableStatus:1,
        options: {
          page: 1,
          itemsPerPage:10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        },
        RegisterForm:{
          username:"",
          password:"",
          name:"",
          email:"",
          group:"",
          password_confirmation:"",
          role:"",
        },
        EditForm:{
          password:"",
          name:"",
          email:"",
          group:"",
          password_confirmation:"",
          role:"",
          username:"",
        },
        headers: [
          {
            text: this.$i18n.t('common.no'),
            align: 'start',
            sortable: false,
            value: 'no',
          },
          { text: this.$i18n.t('common.account'), value: 'username' },
          { text: this.$i18n.t('common.name'), value: 'name' },
          { text: this.$i18n.t('common.email'), value: 'email' },
          { text: this.$i18n.t('common.created_at'), value: 'created_at' },
          { text: this.$i18n.t('common.operate'), value: 'uuid',sortable: false, },
        ],
        desserts: [
        ],
        total:0,
      }
    },
    created:function(){
      this.GetManager();
      this.GetManagerGroup();
      this.GetManagerRole();
    },
    watch: {
      options: {
        handler () {
          this.GetManager();
        },
        deep: true,
      },
      add_dialog(){
        if(typeof(this.$refs.add_form)!=='undefined'){
          this.$refs.add_form.reset();
          this.$refs.RegisterForm.reset();
        }
      }
    },
    methods:{
      GetManager(){
        let extend  = this.$common.SortHandle(this.options);
        this.$axios.get('/api/v1/Managers?page='+this.options.page+'&limit='+this.options.itemsPerPage+extend).then((res)=>{
          if(res.data.status=='success'){
            this.desserts   = this.$common.DataNoHandle(res.data.data.data,this.options.page,this.options.itemsPerPage);
            this.total  = res.data.data.total;
          }
          this.loading  = false;
        });
      },
      GetManagerGroup(){
        this.$axios.get('/api/v1/ManagerGroup?limit=-1').then((res)=>{
          if(res.data.status=='success'){
            this.GroupItems = res.data.data.data.map(function(item){
              return {
                text:item.name,
                value:item.id,
              };
            })
          }
          this.loading  = false;
        });
      },
      GetManagerRole(){
        this.$axios.get('/api/v1/ManagerRole?limit=-1').then((res)=>{
          if(res.data.status=='success'){
            this.RoleItems = res.data.data.data.map(function(item){
              return {
                text:item.name,
                value:item.id,
              };
            })
          }
          this.loading  = false;
        });
      },
      GetManagerDetail(uuid){
        this.EditUUid   = uuid;
        if(typeof(this.$refs.edit_form)!=='undefined'){
          this.$refs.edit_form.reset();
          this.$refs.EditForm.reset();  
        }
        this.$axios.get('/api/v1/Managers/'+this.EditUUid).then((res)=>{
            if(res.data.status=='success'){
              var tmp   = this.EditForm;
              tmp.username =  res.data.data.username;
              tmp.name =  res.data.data.name;
              tmp.email =  res.data.data.email;
              tmp.group =  res.data.data.info.group;
              res.data.data.info.map(function(item){
                tmp[item.key]  = Number(item.value);
              })
              this.EditForm   = tmp;
              this.edit_dialog=true;
            }
        });    
      },
      AddManager(){
        this.$refs.RegisterForm.validate().then(result => {
          if(result){
            this.$axios.post('/api/v1/Register',this.RegisterForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.add_dialog=false;
                  this.GetManager();
                }
            });    
          }
        })
      },
      EditManager(){
        this.$refs.EditForm.validate().then(result => {
          if(result){
            this.$axios.put('/api/v1/Managers/'+this.EditUUid,this.EditForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.edit_dialog=false;
                  this.GetManager();
                }
            });    
          }
        })
      },
      DisableItem(item){
        this.disable_dialog = true;
        this.DisableUUid  = item.uuid;
        this.DisableStatus   = (item.status)?0:1;
      },
      DisableManager(){
        this.$axios.put('/api/v1/DisableManager/'+this.DisableUUid,{status:this.DisableStatus}).then((res)=>{
          if(res.data.status=='success'){
            this.$common.AxiosHandle(res);
            this.disable_dialog=false;
            this.GetManager();
          }
        }); 
      }
    }
  }
</script>