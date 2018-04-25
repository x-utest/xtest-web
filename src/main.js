
import Vue from 'vue'
import App from './app'
import filters from './filters/filters.js'
import directives from './directives/directives.js'
import ElementUI from 'element-ui'
import qs from 'qs'

Vue.use(ElementUI);

import axios from 'axios'
/* Fix axios.post(url,form) to FormData  */
/*
const Post = axios.post;
axios.post = function (...args) {
    var [url, form] = args;
    if (typeof form === 'object' && form.constructor !== URLSearchParams) {
        var f = new URLSearchParams;
        Object.keys(form).map(x => f.append(x, form[x]))
        args[1] = f
    }
    return Post.apply(this, args)
}
*/
/* Fix axios.post(url,form) to Payload  */
const Post = axios.post;
axios.post = function (...args) {
    var [url, form, opt] = args;
    if (typeof form === 'object' && form.constructor !== URLSearchParams) {
        args[2] = opt || {};
        args[2].headers = {
            'Content-Type': 'multipart/form-data; charset=UTF-8'
        }
    }
    return Post.apply(this, args)
}

Vue.prototype.$http = axios;

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
    route: {
        data(t) {
            console.error(t)
        }
    },
    store,
    el: '#app',
    ...App
});


