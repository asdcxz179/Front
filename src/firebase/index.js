import Vue from 'vue'
import * as Firebase from 'firebase/app'

Vue.use(Firebase)

const firebaseConfig = 	{
							apiKey: "AIzaSyBuJ4wXP47CIDqOdwO1z1E3e-1BgJ5sryo",
							authDomain: "node-c47cc.firebaseapp.com",
							databaseURL: "https://node-c47cc.firebaseio.com",
							projectId: "node-c47cc",
							storageBucket: "node-c47cc.appspot.com",
							messagingSenderId: "803368523581",
							appId: "1:803368523581:web:6d213e6aa1f3988858d754"
						};

Firebase.initializeApp(firebaseConfig)

export default Firebase