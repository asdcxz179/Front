module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:process.env.NODE_ENV === 'production'
    ? '/front/'
    : '/',
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