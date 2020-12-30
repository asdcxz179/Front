<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-toolbar flat color="white">
              <v-toolbar-title>{{$t('experience-page.experience-list')}}</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <template>
                <v-tooltip bottom >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="add_dialog=true"
                    >{{$t('experience-page.add-experience')}}</v-btn>
                  </template>
                  <span>{{$t('experience-page.add-experience')}}</span>
                </v-tooltip>
              </template>
              
            </v-toolbar>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-expansion-panels
              v-model="panel"
              multiple
            >
              <v-expansion-panel
                v-for="(item,i) in jobs"
                :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
                  {{ item.job_company }}
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  {{ item.job_title }}
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  {{ item.job_start_date }} ~ {{ (item.job_end_date!=null)?item.job_end_date:$t('experience-page.on-job') }}
                  <template v-slot:actions>
                    <v-icon 
                      v-if="item.status==1"
                      color="success"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon 
                      v-else
                      color="error"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card>
                    <v-card-title>
                      {{ item.job_company }} {{ item.job_start_date }} ~ {{ (item.job_end_date!=null)?item.job_end_date:$t('experience-page.on-job') }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ item.job_title }}
                    </v-card-subtitle>
                    <v-card-text class="text--primary" v-html="item.job_content">
                    </v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-actions>
                      <v-tooltip bottom >
                        <template #activator="{ on:tooltip }">
                          <v-btn
                            color="primary"
                            v-on="{ ...tooltip}"
                            @click="GetExperienceDetail(item.uuid)"
                          >{{$t('experience-page.edit-experience')}}</v-btn>
                        </template>
                        <span>{{$t('experience-page.edit-experience')}}</span>
                      </v-tooltip>
                      <v-tooltip bottom >
                        <template #activator="{ on:tooltip }">
                          <v-btn
                            color="error"
                            v-on="{ ...tooltip}"
                            class="ml-2"
                            @click="DeleteExperience(item.uuid)"
                          >{{$t('experience-page.delete-experience')}}</v-btn>
                        </template>
                        <span>{{$t('experience-page.delete-experience')}}</span>
                      </v-tooltip>
                    </v-card-actions>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="add_dialog" max-width="500px">
      <ValidationObserver ref="ExperienceForm" >
        <v-form @submit="AddExperience" ref="add_form">
          <v-card>
            <v-card-title>
              <span class="headline">{{$t('experience-page.add-experience')}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_company')" rules="required">
                      <v-text-field 
                        v-bind:label="$t('common.job_company')" 
                        type="text" 
                        required 
                        v-model="ExperienceForm.job_company"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_title')" rules="required">
                      <v-text-field 
                        v-bind:label="$t('common.job_title')" 
                        type="text" 
                        required 
                        v-model="ExperienceForm.job_title"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      v-model="add_job_start_date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_start_date')" rules="required">
                          <v-text-field
                            v-model="ExperienceForm.job_start_date"
                            v-bind:label="$t('common.job_start_date')"  
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </template>
                      <v-date-picker
                        v-model="ExperienceForm.job_start_date"
                        @input="add_job_start_date = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      v-model="add_job_end_date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_end_date')" rules="">
                          <v-text-field
                            v-model="ExperienceForm.job_end_date"
                            v-bind:label="$t('common.job_end_date')"  
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </template>
                      <v-date-picker
                        v-model="ExperienceForm.job_end_date"
                        @input="add_job_end_date = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_title')" rules="required">
                      <quill-editor
                        v-model="ExperienceForm.job_content"
                        :options="editorOption"
                        :error-messages="errors"
                        v-bind:label="$t('common.job_content')" 
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_status')" rules="required">
                      <v-select
                        :items="job_status_items"
                        v-bind:label="$t('common.job_status')" 
                        outlined
                        :error-messages="errors"
                        v-model="ExperienceForm.status"
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
        <v-form @submit="EditExperience" ref="edit_form">
          <v-card>
            <v-card-title>
              <span class="headline">{{$t('manager-group-page.edit-manger-group')}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_company')" rules="required">
                      <v-text-field 
                        v-bind:label="$t('common.job_company')" 
                        type="text" 
                        required 
                        v-model="EditForm.job_company"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_title')" rules="required">
                      <v-text-field 
                        v-bind:label="$t('common.job_title')" 
                        type="text" 
                        required 
                        v-model="EditForm.job_title"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      v-model="edit_job_start_date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_start_date')" rules="required">
                          <v-text-field
                            v-model="EditForm.job_start_date"
                            v-bind:label="$t('common.job_start_date')"  
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </template>
                      <v-date-picker
                        v-model="EditForm.job_start_date"
                        @input="edit_job_start_date = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      v-model="edit_job_end_date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_end_date')" rules="">
                          <v-text-field
                            v-model="EditForm.job_end_date"
                            v-bind:label="$t('common.job_end_date')"  
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </template>
                      <v-date-picker
                        v-model="EditForm.job_end_date"
                        @input="edit_job_end_date = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_title')" rules="required">
                      <quill-editor
                        v-model="EditForm.job_content"
                        :options="editorOption"
                        :error-messages="errors"
                        v-bind:label="$t('common.job_content')" 
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider v-slot="{ errors }" v-bind:name="$t('common.job_status')" rules="required">
                      <v-select
                        :items="job_status_items"
                        v-bind:label="$t('common.job_status')" 
                        outlined
                        :error-messages="errors"
                        v-model="EditForm.status"
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
  </v-container>
</template>

<script>
  import 'quill/dist/quill.core.css' // import styles
  import 'quill/dist/quill.snow.css' // for snow theme
  import 'quill/dist/quill.bubble.css' // for bubble theme
  import { quillEditor } from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    data () {
      return {
        add_dialog:false,
        edit_dialog:false,
        add_job_start_date:false,
        add_job_end_date:false,
        edit_job_start_date:false,
        edit_job_end_date:false,
        editorOption:{},
        panel: [],
        Editid:"",
        job_status_items:[
          {
            text:this.$i18n.t('common.enable'),
            value:1,
          },
          {
            text:this.$i18n.t('common.disable'),
            value:0,
          }
        ],
        jobs:[],
        ExperienceForm:{
          job_company:"",
          job_title:"",
          job_content:"",
          job_start_date:"",
          job_end_date:null,
        },
        EditForm:{
          job_company:"",
          job_title:"",
          job_content:"",
          job_start_date:"",
          job_end_date:null,
        },
      }
    },
    created:function(){
      this.GetExperience();
    },
    methods:{
      GetExperience(){
        this.$axios.get('/api/v1/Experience').then((res)=>{
          if(res.data.status=='success'){
            this.jobs   = res.data.data;
            for(var key in this.jobs ){
              this.panel.push(parseInt(key));
            }
          }
        });
      },
      AddExperience(){
        this.$refs.ExperienceForm.validate().then(result => {
          if(result){
            this.$axios.post('/api/v1/Experience',this.ExperienceForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.add_dialog=false;
                  this.GetExperience();
                  this.$refs.add_form.reset();
                }
            });    
          }
        })
      },
      GetExperienceDetail(id){
        this.Editid   = id;
        if(typeof(this.$refs.edit_form)!=='undefined'){
          this.$refs.edit_form.reset();
          this.$refs.EditForm.reset();  
        }
        this.$axios.get('/api/v1/Experience/'+this.Editid).then((res)=>{
            if(res.data.status=='success'){
              var tmp   = this.EditForm;
              tmp =  res.data.data;
              this.EditForm   = tmp;
              this.edit_dialog=true;
            }
        });    
      },
      EditExperience(){
        this.$refs.EditForm.validate().then(result => {
          if(result){
            this.$axios.put('/api/v1/Experience/'+this.Editid,this.EditForm).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.edit_dialog=false;
                  this.GetExperience();
                }
            });    
          }
        })
      },
      async DeleteExperience(uuid){
        try {
          let {isConfirmed} = await this.$swal({
            title:this.$i18n.t('common').warning,
            icon:"warning",
            html:this.$i18n.t('common').confirm_delete,
            showCancelButton:true,
            confirmButtonColor:"red",
            confirmButtonText:this.$i18n.t('common').confirm,
            cancelButtonText:this.$i18n.t('common').cancel,
          });
          if(isConfirmed){
            await this.$axios.delete('/api/v1/Experience/'+uuid,{}).then((res)=>{
                if(res.data.status=='success'){
                  this.$common.AxiosHandle(res);
                  this.GetExperience();
                }
            });
          }
        }catch(e){
          console.log(e);
        }
      },
    }
  }
</script>