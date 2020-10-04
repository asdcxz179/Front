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
          :items-per-page="10"
          class="elevation-1"
          :loading="loading" 
          v-bind:loading-text="$t('common.loading')"
          :server-items-length="totalDesserts"
          :options.sync="options"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        loading:true,
        totalDesserts:0,
        options:{
          page:""
        },
        headers: [
          {
            text: this.$i18n.t('common.no'),
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: this.$i18n.t('common.account'), value: 'username' },
          { text: this.$i18n.t('common.name'), value: 'name' },
          { text: this.$i18n.t('common.email'), value: 'email' },
          { text: this.$i18n.t('common.created_at'), value: 'created_at' },
        ],
        desserts: [
        ],
      }
    },
    created:function(){
      this.GetManager();
    },
    methods:{
      GetManager(){
        console.log(this.itemsPerPage);
        // const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        this.$axios.get('/api/v1/Manager').then((res)=>{
          if(res.data.status=='success'){
            this.desserts   = res.data.data.data;
            this.totalDesserts  = res.data.data.total;
          }
          this.loading  = false;
        });
      }
    }
  }
</script>