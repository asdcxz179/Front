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
            {{$t('menu.webpage_manager')}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-tabs
              v-model="tab"
            >
              <v-tab
                v-for="(item,i) in webs"
                :key="i"
              >
                {{$t('common.'+item.page_title)}}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="(item,i) in webs"
                :key="i"
              >
                <v-form  @submit="EditWebPage(item.page_title)">
                  <v-card>
                    <v-card-text>
                      <editor
                        :apiKey="$root.tinymce_key"
                        v-model="webs[i].page_content"
                        :init="$root.editorOption"
                        ref="tiny"
                      >
                      </editor>
                    </v-card-text>
                    <v-divider></v-divider>
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
      tab: null,
      webs:[],
      content:""
    }),
    created:function(){
      this.GetWebPage();
    },
    methods:{
      GetWebPage(){
        this.$axios.get('/api/v1/WebPage').then((res)=>{
          if(res.data.status=='success'){
            this.webs   = res.data.data;
          }
        });
      },
      EditWebPage(ref){
        this.$axios.put('/api/v1/WebPage/'+ref,this.webs[ref]).then((res)=>{
            if(res.data.status=='success'){
              this.$common.AxiosHandle(res);
              this.GetWebPage();
            }
        });  
      },
    }
  }
</script>