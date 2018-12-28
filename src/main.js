// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css/normalize.css'
import Vue from 'vue'
import App from './App'
import "@/style/index.scss"
import router from './router'
import Element from 'element-ui'
import store from "./store"
// import './mock'
// import './permission'
import './icons'
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill"
import * as filters from './filters' // global filters
import {isAuth} from "@/utils"
//编辑器
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.min.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'


Vue.use(Element)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.isAuth = isAuth     // 权限方法

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
