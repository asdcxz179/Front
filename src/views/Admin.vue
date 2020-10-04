<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="{name:child.link}"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="{name:item.link}"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">{{$t('login-page.login-form-title')}}</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>
      <v-language></v-language>
      <v-password></v-password>
      <v-btn icon v-on:click="this.logout">
        <v-icon>fa-sign-out-alt</v-icon>
      </v-btn>
     <!--  <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn
        icon
        large
      >
        <v-avatar
          size="32px"
          item
        >
          <v-img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          ></v-img></v-avatar>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<style scoped>
  .admin-language >>> input{
    width: 0px;
  }
  .admin-language >>> .v-select__selection{
    max-width:100%;
  }
</style>
<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
      ],
    }),
    created:function(){
      this.makeMenu();
    },
    watch:{
      Lang:function(){
        this.makeMenu();
      }
    },
    methods:{
      makeMenu(){
        this.$axios.get('/api/v1/Route').then((res)=>{
          for(var data in res.data.data){
            res.data.data[data].text  = this.$i18n.t('menu.'+res.data.data[data].text);
            if(res.data.data[data].children){
              for(var child in res.data.data[data].children){
                res.data.data[data].children[child].text  = this.$i18n.t('menu.'+res.data.data[data].children[child].text);
              }
            }
          }
          this.items  = res.data.data
        });
      },
      logout(){
        this.$axios.get('/api/v1/Logout').then((res)=>{
            if(res.data.status=='success'){
                location.reload();
                this.$common.RemoveToken();
                this.$common.RemoveUuid();
            }
        });
      }
    },
    computed:{
      Lang:{
        get(){
          return this.$store.state.language;
        }
      }
    }
  }
</script>