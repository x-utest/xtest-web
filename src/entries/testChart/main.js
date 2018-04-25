import Vue from 'vue'
import App from './app'

import axios from 'axios'
Vue.prototype.$http=axios;

import ElementUI from 'element-ui'
Vue.use(ElementUI);

new Vue({
    el: '#app',
    ...App
});


