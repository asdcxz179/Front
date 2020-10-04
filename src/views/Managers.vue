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
        total:0,
      }
    },
    created:function(){
      this.GetManager();
    },
    watch: {
      options: {
        handler () {
          this.GetManager();
        },
        deep: true,
      },
    },
    methods:{
      GetManager(){
        console.log(this.options.itemsPerPage);
        this.$axios.get('/api/v1/Manager?page='+this.options.page+'&limit='+this.options.itemsPerPage).then((res)=>{
          if(res.data.status=='success'){
            this.desserts   = res.data.data.data;
            this.total  = res.data.data.total;
          }
          this.loading  = false;
        });
      }
    }
  }
</script>