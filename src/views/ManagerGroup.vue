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
              <v-toolbar-title>{{$t('manager-group-page.table-name')}}</v-toolbar-title>
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
                  >{{$t('manager-group-page.add-manger-group')}}</v-btn>
                </template>
                <ValidationObserver ref="ManagerGroupForm" >
                  <v-form @submit="AddManagerGroup" ref="add_form">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{$t('manager-group-page.add-manger-group')}}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.name')" rules="required|min:3|max:20">
                                <v-text-field 
                                  v-bind:label="$t('common.name')" 
                                  type="text" 
                                  required 
                                  v-model="ManagerGroupForm.name"
                                  :error-messages="errors"
                                ></v-text-field>
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
            </v-toolbar>
            <v-dialog v-model="edit_dialog" max-width="500px" :retain-focus="false">
                <ValidationObserver ref="EditForm" >
                  <v-form @submit="EditManagerGroup" ref="edit_form">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{$t('manager-group-page.edit-manger-group')}}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
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
              <v-dialog v-model="edit_permission_dailog" max-width="500px" :retain-focus="false">
                <v-form @submit="EditManagerGroupPermission" ref="edit_permission_form">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{$t('manager-group-page.edit-manger-group')}}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <template>
                          <v-treeview
                            ref="permission"
                            selectable
                            :items="PermissionItems"
                            :active="PermissionActive"
                            v-model="PermissionActive"
                          >
                            <template v-slot:prepend="{ item }">
                              <v-icon>
                                {{ item.icon }}
                              </v-icon>
                            </template>
                            <template v-slot:label="{ item }">
                              {{ $t(`menu.${item.name}`) }}
                            </template>
                          </v-treeview>
                        </template>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="edit_permission_dailog=false">{{$t('common.cancel')}}</v-btn>
                      <v-btn color="blue darken-1" text type="submit">{{$t('common.update')}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
          </template>
          <template v-slot:item.id="{ item }">
            <v-tooltip bottom >
              <template #activator="{ on: tooltip }">
                <v-icon
                  small
                  class="mr-2"
                  @click="GetManagerGroupDetail(item.id)"
                  v-on="{ ...tooltip}"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>{{$t('manager-group-page.edit-manger-group')}}</span>
            </v-tooltip>
            <v-tooltip bottom >
              <template #activator="{ on: tooltip }">
                <v-icon
                  small
                  class="mr-2"
                  @click="GetManagerGroupPermissionDetail(item.id)"
                  v-on="{ ...tooltip}"
                >
                  mdi-account-settings
                </v-icon>
              </template>
              <span>{{$t('manager-group-page.edit-manger-group-permission')}}</span>
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
        edit_permission_dailog:false,
        loading:true,
        Editid:"",
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
        ManagerGroupForm:{
          name:"",
        },
        EditForm:{
          name:"",
        },
        headers: [
          {
            text: this.$i18n.t('common.no'),
            align: 'start',
            sortable: false,
            value: 'no',
          },
          { text: this.$i18n.t('common.name'), value: 'name' },
          { text: this.$i18n.t('common.created_at'), value: 'created_at' },
          { text: this.$i18n.t('common.operate'), value: 'id',sortable: false, },
        ],
        desserts: [
        ],
        total:0,
        PermissionItems: [
          
        ],
        PermissionActive:[
          1
        ],
      }
    },
    created:function(){
      this.GetManagerGroup();
      this.GetManagerPermission();
    },
    watch: {
      options: {
        handler () {
          this.GetManagerGroup();
        },
        deep: true,
      },
      PermissionItems:function(){
        if(typeof(this.$refs.permission)!=='undefined'){
          this.$refs.permission.updateAll(true);
        }
      }
    },
    methods:{
      GetManagerGroup(){
        let extend  = this.$common.SortHandle(this.options);
        this.$axios.get('/api/v1/Group?page='+this.options.page+'&limit='+this.options.itemsPerPage+extend).then((res)=>{
          if(res.data.status=='success'){
            this.desserts   = this.$common.DataNoHandle(res.data.data.data,this.options.page,this.options.itemsPerPage);
            this.total  = res.data.data.total;
          }
          this.loading  = false;
        });
      },
      AddManagerGroup(){
        this.$refs.ManagerGroupForm.validate().then(result => {
          if(result){
            this.$axios.post('/api/v1/Group',this.ManagerGroupForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.add_dialog=false;
                  this.GetManagerGroup();
                }
            });    
          }
        })
      },
      GetManagerGroupDetail(id){
        this.Editid   = id;
        if(typeof(this.$refs.edit_form)!=='undefined'){
          this.$refs.edit_form.reset();
          this.$refs.EditForm.reset();  
        }
        this.$axios.get('/api/v1/Group/'+this.Editid).then((res)=>{
            if(res.data.status=='success'){
              var tmp   = this.EditForm;
              tmp.name =  res.data.data.name;
              this.EditForm   = tmp;
              this.edit_dialog=true;
            }
        });    
      },
      EditManagerGroup(){
        this.$refs.EditForm.validate().then(result => {
          if(result){
            this.$axios.put('/api/v1/Group/'+this.Editid,this.EditForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.edit_dialog=false;
                  this.GetManagerGroup();
                }
            });    
          }
        })
      },
      GetManagerPermission(){
        this.$axios.get('/api/v1/Permission').then((res)=>{
          if(res.data.status=='success'){
            this.PermissionItems = res.data.data;
          }
        });
      },
      GetManagerGroupPermissionDetail(id){
        this.Editid   = id;
        // this.$axios.get('/api/v1/Permission/'+this.Editid).then((res)=>{
        //     if(res.data.status=='success'){
        //       var tmp   = this.EditForm;
        //       tmp.name =  res.data.data.name;
        //       this.EditForm   = tmp;
              this.edit_permission_dailog=true;
              this.PermissionActive   = [3,5];
        //     }
        // });    
      },
      EditManagerGroupPermission(){
        this.$refs.EditForm.validate().then(result => {
          if(result){
            this.$axios.put('/api/v1/Group/'+this.Editid,this.EditForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.edit_dialog=false;
                  this.GetManagerGroup();
                }
            });    
          }
        })
      }
    }
  }
</script>