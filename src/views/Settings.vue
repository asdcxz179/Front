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
                  {{$t('system-settings-page.maintenace-settings')}}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                >
                  <ValidationObserver ref="GeneralForm" >
                    <v-form ref="general-form" @submit="EditSettings('GeneralForm')">
                      <v-card>
                        <v-card-text >
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
                  <ValidationObserver ref="MaintenaceForm" >
                    <v-form ref="maintenace-form" @submit="EditSettings('MaintenaceForm')">
                      <v-card>
                        <v-card-text >
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_switch')" rules="required">
                            <v-switch
                              v-model="settings.MaintenaceForm.maintenance_switch"
                              v-bind:label="$t('system-settings-page.maintenance_switch')" 
                              :error-messages="errors"
                            ></v-switch>
                          </ValidationProvider>
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_start_time')" rules="">
                            <v-datetime-picker 
                              v-bind:label="$t('system-settings-page.maintenance_start_time')"  
                              v-model="settings.MaintenaceForm.maintenance_start_datetime"
                              :error-messages="errors"
                              :timePickerProps="timePickerProps"
                            > </v-datetime-picker>
                          </ValidationProvider>
                          <ValidationProvider v-slot="{ errors }" v-bind:name="$t('system-settings-page.maintenance_end_time')" rules="">
                            <v-datetime-picker 
                              v-bind:label="$t('system-settings-page.maintenance_end_time')"  
                              v-model="settings.MaintenaceForm.maintenance_end_datetime"
                              :error-messages="errors"
                              :timePickerProps="timePickerProps"
                            > </v-datetime-picker>
                          </ValidationProvider>
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
      type: 'month',
      types: ['month', 'week', 'day'],
      mode: 'stack',
      weekday: [0, 1, 2, 3, 4, 5, 6],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      start_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      tab: null,
      settings:{
        GeneralForm:{
          web_name:"",
          web_email:"",
        },
        MaintenaceForm:{
          maintenance_switch:false,
          maintenance_start_datetime:"",
          maintenance_end_datetime:"",
        }
      },
      timePickerProps:{
        format:"24hr",
      }
    }),
    created:function(){
      this.GetSettings();
    },
    methods:{
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
    }
  }
</script>