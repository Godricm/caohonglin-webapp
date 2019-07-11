import Vue from 'vue'
import App from './App'
import xPlus from 'async-validator-uniapp'
   
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
