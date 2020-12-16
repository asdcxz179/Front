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
                  <v-form ref="general-form">
                    <v-card>
                      <v-card-text >
                        <v-text-field
                          v-model="general_form.web_name"
                          v-bind:label="$t('system-settings-page.web_name')" 
                          required
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="blue darken-1" text type="submit">{{$t('common.save')}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-tab-item>
                <v-tab-item
                >
                  <v-form ref="maintenace-form">
                    <v-card>
                      <v-card-text >
                        <v-text-field
                          label="Name2"
                          required
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="blue darken-1" text type="submit">{{$t('common.save')}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
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
      general_form:{
        web_name:""
      },
    }),
  }
</script>