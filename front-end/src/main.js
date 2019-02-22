import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './routes.js'
Vue.use(ElementUI)
new Vue({
    el: '#app',
    router:router,
    render: h => h(App)
})
