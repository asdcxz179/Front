module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer:{
  	proxy:{
  		'/api':{
  			target:'http://localhost/api',
  			changOrigin:true,
  			pathRewrite : {
                '^/api' : ''
            }
  		}
  	}
  }
}