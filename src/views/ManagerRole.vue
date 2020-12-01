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
              <v-toolbar-title>{{$t('manager-role-page.table-name')}}</v-toolbar-title>
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
                  >{{$t('manager-role-page.add-manger-role')}}</v-btn>
                </template>
                <ValidationObserver ref="ManagerRoleForm" >
                  <v-form @submit="AddManagerRole" ref="add_form">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{$t('manager-role-page.add-manger-role')}}</span>
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
                                  v-model="ManagerRoleForm.name"
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
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
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
        loading:true,
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
        ManagerRoleForm:{
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
          { text: this.$i18n.t('common.operate'), value: 'uuid',sortable: false, },
        ],
        desserts: [
        ],
        total:0,
      }
    },
    created:function(){
      this.GetManagerRole();
    },
    watch: {
      options: {
        handler () {
          this.GetManagerRole();
        },
        deep: true,
      },
    },
    methods:{
      GetManagerRole(){
        let extend  = this.$common.SortHandle(this.options);
        this.$axios.get('/api/v1/Role?page='+this.options.page+'&limit='+this.options.itemsPerPage+extend).then((res)=>{
          if(res.data.status=='success'){
            this.desserts   = this.$common.DataNoHandle(res.data.data.data,this.options.page,this.options.itemsPerPage);
            this.total  = res.data.data.total;
          }
          this.loading  = false;
        });
      },
      AddManagerRole(){
        this.$refs.ManagerRoleForm.validate().then(result => {
          if(result){
            this.$axios.post('/api/v1/Role',this.ManagerRoleForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.add_dialog=false;
                  this.GetManagerRole();
                }
            });    
          }
        })
      }
    }
  }
</script>