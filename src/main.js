
//import ElementUI from 'element-ui'
import Vue from 'vue'
import App from './app'
import filters from './filters/filters.js'
import directives from './directives/directives.js'



import ElementUI from 'element-ui'
Vue.use(ElementUI);



import axios from 'axios'
Vue.prototype.$http=axios;

import store from './store'

import router from './router'
import { sync } from 'vuex-router-sync'
// Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
//sync(store, router);
//import 'reset-css'
import './assets/public.less'

//注册所有的全局filters，可加前缀进行区分
Object.keys(filters).forEach(function (key, index) {
    Vue.filter(key, filters[key]);
})
Object.keys(directives).forEach(function (key, index) {
    Vue.directive(key, directives[key]);
})

/* eslint-disable no-new */
new Vue({
    router,
    route:{
         data(t){
console.error(t)
    }
    },
    store,
    el: '#app',
    ...App
});


