module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:process.env.NODE_ENV === 'production'
    ? '/front/'
    : '/',
  indexPath:'../../resources/views/admin.blade.php',
  outputDir:'../admin/public/front',
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