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
        
          <v-card>
            <v-card-title>
              {{$t('menu.system_settings')}}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-tabs
                v-model="tab"
              >
                <v-tab
                >
                  {{$t('system-settings-page.general-settings')}}
                </v-tab>
                <v-tab
                >
                  {{$t('system-settings-page.maintenance-settings')}}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                >
                  <ValidationObserver ref="GeneralForm" >
                    <v-form ref="general-form" @submit="EditSettings('GeneralForm')">
                      <v-card>
                        <v-card-text >
                          <v-row>
                            <v-col cols=1>
                              <v-img
                                :src="'http://localhost'+settings.GeneralForm.web_ico"
                              ></v-img>
                            </v-col>
                            <v-col>
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.web_ico')" rules="">
                                <v-file-input
                                  ref="web_ico"
                                  accept=".ico"
                                  v-bind:label="$t('system-settings-page.web_ico')" 
                                  :error-messages="errors"
                                  prepend-icon=""
                                  @change="FileHandle($event,'web_ico')"
                                ></v-file-input>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.web_name')" rules="required">
                            <v-text-field
                              v-model="settings.GeneralForm.web_name"
                              v-bind:label="$t('system-settings-page.web_name')" 
                              :error-messages="errors"
                            ></v-text-field>
                          </ValidationProvider>
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.web_email')" rules="required|email">
                            <v-text-field
                              v-model="settings.GeneralForm.web_email"
                              v-bind:label="$t('system-settings-page.web_email')" 
                              :error-messages="errors"
                            ></v-text-field>
                          </ValidationProvider>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue darken-1" text type="submit">{{$t('common.save')}}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </ValidationObserver>
                </v-tab-item>
                <v-tab-item
                >
                  <ValidationObserver ref="MaintenanceForm" >
                    <v-form ref="maintenance-form" @submit="EditSettings('MaintenanceForm')">
                      <v-card>
                        <v-card-text >
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_switch')" rules="required">
                            <v-switch
                              v-model="settings.MaintenanceForm.maintenance_switch"
                              v-bind:label="$t('system-settings-page.maintenance_switch')" 
                              :error-messages="errors"
                            ></v-switch>
                          </ValidationProvider>
                          <v-row>
                            <v-col>
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_start_date')" rules="">
                                <v-menu
                                  v-model="menu_maintenance_start_date"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="maintenance_start_date"
                                      v-bind:label="$t('system-settings-page.maintenance_start_date')"  
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      :error-messages="errors"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="maintenance_start_date"
                                    @input="menu_maintenance_start_date = false"
                                  ></v-date-picker>
                                </v-menu>
                              </ValidationProvider>
                            </v-col>
                            <v-col>
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_time')" rules="">
                                <v-menu
                                  ref="menu_maintenance_start_time"
                                  v-model="menu_maintenance_start_time"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="menu_maintenance_start_time"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="maintenance_start_time"
                                      v-bind:label="$t('system-settings-page.maintenance_start_time')"  
                                      prepend-icon="mdi-clock-time-four-outline"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      :error-messages="errors"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="menu_maintenance_start_time"
                                    v-model="maintenance_start_time"
                                    full-width
                                    format="24hr"
                                    use-seconds
                                    @click:second="$refs.menu_maintenance_start_time.save(maintenance_start_time)"
                                  ></v-time-picker>
                                </v-menu>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_end_date')" rules="">
                                <v-menu
                                  v-model="menu_maintenance_end_date"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="maintenance_end_date"
                                      v-bind:label="$t('system-settings-page.maintenance_end_date')"  
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      :error-messages="errors"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="maintenance_end_date"
                                    @input="menu_maintenance_end_date = false"
                                  ></v-date-picker>
                                </v-menu>
                              </ValidationProvider>
                            </v-col>
                            <v-col>
                              <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_end_time')" rules="">
                                <v-menu
                                  ref="menu_maintenance_end_time"
                                  v-model="menu_maintenance_end_time"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="menu_maintenance_end_time"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="maintenance_end_time"
                                      v-bind:label="$t('system-settings-page.maintenance_end_time')"  
                                      prepend-icon="mdi-clock-time-four-outline"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                      :error-messages="errors"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="menu_maintenance_end_time"
                                    v-model="maintenance_end_time"
                                    full-width
                                    format="24hr"
                                    use-seconds
                                    @click:second="$refs.menu_maintenance_end_time.save(menu_maintenance_end_time)"
                                  ></v-time-picker>
                                </v-menu>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue darken-1" text type="submit">{{$t('common.save')}}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </ValidationObserver>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      tab: null,
      settings:{
        GeneralForm:{
          web_ico:"",
          web_name:"",
          web_email:"",
        },
        MaintenanceForm:{
          maintenance_switch:false,
          maintenance_start_datetime:"",
          maintenance_end_datetime:"",
        }
      },
      menu_maintenance_start_date:false,
      menu_maintenance_start_time:false,
      maintenance_start_date:"",
      maintenance_start_time:"00:00:00",
      menu_maintenance_end_date:false,
      menu_maintenance_end_time:false,
      maintenance_end_date:"",
      maintenance_end_time:"00:00:00",
    }),
    watch: {
      options: {
        handler () {
          this.GetManagerGroup();
        },
        deep: true,
      },
      maintenance_start_date:function(){
        this.StartDateHandle()
      },
      maintenance_start_time:function(){
        this.StartDateHandle()
      },
      maintenance_end_date:function(){
        this.EndDateHandle()
      },
      maintenance_end_time:function(){
        this.EndDateHandle()
      },
      "settings.MaintenanceForm.maintenance_start_datetime":function(){
        let tmp = this.settings.MaintenanceForm.maintenance_start_datetime.split(' ');
        this.maintenance_start_date = tmp[0];
        this.maintenance_start_time = tmp[1];
      },
      "settings.MaintenanceForm.maintenance_end_datetime":function(){
        let tmp = this.settings.MaintenanceForm.maintenance_end_datetime.split(' ');
        this.maintenance_end_date = tmp[0];
        this.maintenance_end_time = tmp[1];
      },
      "settings.MaintenanceForm.maintenance_switch":function(){
        if(typeof(this.settings.MaintenanceForm.maintenance_switch)!=="boolean"){
          this.settings.MaintenanceForm.maintenance_switch   = parseInt(this.settings.MaintenanceForm.maintenance_switch);  
        }
      },
      "settings.GeneralForm.web_ico":function(){
        // this.$refs.web_ico.text[0] = this.settings.GeneralForm.web_ico
      }
    },
    created:function(){
      this.GetSettings();
    },
    methods:{
      StartDateHandle(){
        this.settings.MaintenanceForm.maintenance_start_datetime = this.maintenance_start_date+' '+this.maintenance_start_time
      },
      EndDateHandle(){
        this.settings.MaintenanceForm.maintenance_end_datetime = this.maintenance_end_date+' '+this.maintenance_end_time
      },
      GetSettings(){
        this.$axios.get('/api/v1/Settings').then((res)=>{
          if(res.data.status=='success'){
            for(let form in this.settings ){
              for(let name in this.settings[form]){
                this.settings[form][name] = res.data.data[name];
              }
            }
          }
        });
      },
      EditSettings(validate){
        this.$refs[validate].validate().then(result => {
          if(result){
            this.$axios.put('/api/v1/Settings/Update',this.settings[validate]).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                }
            });    
          }
        })
      },
      FileHandle(event,name){
        if(event){
          let reader = new FileReader();
          reader.readAsDataURL(event);
          let tmp = this;
          reader.onload = function(){
            tmp.settings.GeneralForm[name] = this.result;
          }  
        }
        
      }
    }
  }
</script>