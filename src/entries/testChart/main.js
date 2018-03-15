

import Vue from 'vue'
import App from './app'

import axios from 'axios'
Vue.prototype.$http=axios;

import ElementUI from 'element-ui'
Vue.use(ElementUI);

//import 'reset-css'
//import '../../assets/public.less'



/* eslint-disable no-new */
new Vue({

    el: '#app',
    ...App
});


