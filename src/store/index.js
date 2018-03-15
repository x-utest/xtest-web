/**
 * Created by qiankn on 2016/8/2.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import { apiHost } from "../config"
 if(!apiHost){
     throw new TypeError('未指定服务接口地址！')
 }
localStorage.apiHost=apiHost;

Vue.use(Vuex);
//axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://api.apiapp.cc/' : 'http://api.apiapp.cc/';


const store = new Vuex.Store({
    state: {
        serverUrl: apiHost,
        loginUser: { userName: '' },
        token: ''
    },
    actions: {

    },
    mutations: {
        SET_ApiURL(state, data) {
            state.serverUrl = data
        },
        SET_TOKEN(state, data) {
            state.token = data
        },
        SET_LoginUser(state, data) {
            state.loginUser.userName = data
        }
    },
    modules: {
    }
})

export default store

