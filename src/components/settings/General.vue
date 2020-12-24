<template>
	
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
	      },
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