import Vue from 'vue'
import App from './app.vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI);

import filters from '../../filters/filters.js'

Object.keys(filters).forEach(function (key, index) {
    Vue.filter(key, filters[key]);
})

var app = new Vue({
    el: '#app',
    ...App
});

