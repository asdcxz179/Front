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
        <v-sheet
          tile
          height="54"
          color="grey lighten-3"
          class="d-flex"
        >
          <v-btn
            icon
            class="ma-2"
            @click="$refs.calendar.prev()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-select
            v-model="type"
            :items="types"
            dense
            outlined
            hide-details
            class="ma-2"
            label="type"
          ></v-select>
          <v-dialog v-model="add_event_dialog" persistent max-width="600px">
            M
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                icon 
                color="red"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-form v-model="valid" ref="add_event_form" lazy-validation>
              <v-card>
                <v-card-title>
                  <span class="headline">新增活動</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="add_event_form.name" label="活動名稱*" required></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="start_date_menu"
                          v-model="start_date_menu"
                          :close-on-content-click="false"
                          :return-value.sync="add_event_form.start_date"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="add_event_form.start_date"
                              label="活動開始日期"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="add_event_form.start_date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="start_date_menu = false">取消</v-btn>
                            <v-btn text color="primary" @click="$refs.start_date_menu.save(add_event_form.start_date)">確定</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="start_time_menu"
                          v-model="start_time_menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="add_event_form.start_time"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="add_event_form.start_time"
                              label="活動開始時間"
                              prepend-icon="access_time"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="start_time_menu"
                            v-model="add_event_form.start_time"
                            full-width
                            @click:minute="$refs.start_time_menu.save(add_event_form.start_time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="end_date_menu"
                          v-model="end_date_menu"
                          :close-on-content-click="false"
                          :return-value.sync="add_event_form.end_date"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="add_event_form.end_date"
                              label="活動結束日期"
                              prepend-icon="event"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="add_event_form.end_date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="end_date_menu = false">取消</v-btn>
                            <v-btn text color="primary" @click="$refs.end_date_menu.save(add_event_form.end_date)">確定</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="6">
                        <v-menu
                          ref="end_time_menu"
                          v-model="end_time_menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="add_event_form.end_time"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="add_event_form.end_time"
                              label="活動結束時間"
                              prepend-icon="access_time"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="end_time_menu"
                            v-model="add_event_form.end_time"
                            full-width
                            @click:minute="$refs.end_time_menu.save(add_event_form.end_time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="add_event_dialog = false">關閉</v-btn>
                  <v-btn color="blue darken-1" text @click="submit">新增</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-btn
            icon
            class="ma-2"
            @click="$refs.calendar.next()"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="value"
            :weekdays="weekday"
            :type="type"
            :events="events"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
          ></v-calendar>
        </v-sheet>
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
      add_event_dialog: false,
      start_date_menu: false,
      end_date_menu: false,
      start_time_menu: false,
      end_time_menu: false,
      valid: true,
      add_event_form:{
        name:'',
        start_date: '',
        end_date:'',
        start_time: null,
        end_time: null,
      }
    }),
    methods: {
      // getEvents ({ start, end }) {
      //   const events = []

      //   const min = new Date(`${start.date}T00:00:00`)
      //   const max = new Date(`${end.date}T23:59:59`)
      //   const days = (max.getTime() - min.getTime()) / 86400000
      //   const eventCount = this.rnd(days, days)

      //   for (let i = 0; i < eventCount; i++) {
      //     const allDay = this.rnd(0, 3) === 0
      //     const firstTimestamp = this.rnd(min.getTime(), max.getTime())
      //     const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      //     const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
      //     const second = new Date(first.getTime() + secondTimestamp)

      //     events.push({
      //       name: this.names[this.rnd(0, this.names.length - 1)],
      //       start: first,
      //       end: second,
      //       color: this.colors[this.rnd(0, this.colors.length - 1)],
      //       timed: !allDay,
      //     })
      //   }

      //   this.events = events
      // },
      getEventColor (event) {
        return event.color
      },
      // rnd (a, b) {
      //   return Math.floor((b - a + 1) * Math.random()) + a
      // },
      submit(){
        this.$refs.add_event_form.validate();
        // this.$refs.add_event_form.reset();
        this.events.push({
          name:this.add_event_form.name,
          start:new Date(`${this.add_event_form.start_date}T${this.add_event_form.start_time}`),
          end:new Date(`${this.add_event_form.end_date}T${this.add_event_form.end_time}`),
          color:'red',
        });
        this.add_event_dialog = false;
      }
    },
  }
</script>