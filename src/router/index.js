import Vue from 'vue'
import Router from 'vue-router'
import {getToken} from '@/utils/auth'
import store from '@/store'
import {isURL} from '@/utils/validate'
const _import = require ('./_import_'+process.env.NODE_ENV);

Vue.use(Router)


import Layout from "../views/Layout/Layout"

const globalRoutes=[
    {path:"/login",component:_import('login/index'),hidden:true,name:'login'},
    {path:"/404",component:_import('errorPage/404'),hidden:true,name:'404'},

]

const mainRoutes ={
    path:"",
    component:Layout,
    redirect:"home",
    children:[{
        path:"home",
        component:_import('home/index'),
        name:"home",
        meta:{title:"首页",icon:"home",nocache:true}
    }],
    beforeEnter (to, from, next) {
        let token = getToken();
        if (!token || !/\S/.test(token)) {
            next({ path: 'login' })
        }
        next()
    }
}

const router= new Router({
    mode:'hash',
    scrollBehavior:()=>({y:0}),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRoutes)
})


router.beforeEach((to, from, next) => {
    // 添加动态(菜单)路由
    // 1. 已经添加 or 全局路由, 直接访问
    // 2. 获取菜单列表, 添加并保存本地存储
    if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
        next()
    } else {
        store.dispatch('GetUserInfo').then(res=>{
            var menuList=sessionStorage.getItem('menuList');
            if (menuList) {
                console.log(123);
                fnAddDynamicMenuRoutes(JSON.parse(menuList))
                router.options.isAddDynamicMenuRoutes = true
              /*  sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'))
                sessionStorage.setItem('permissions', JSON.stringify(permissions || '[]'))*/
                console.log(234);
                next({ path:'/home' })
            } else {
                sessionStorage.setItem('menuList', '[]')
                sessionStorage.setItem('permissions', '[]')
                next()
            }
        }).catch(error=>{
            next({path:'/login'})
        })
    }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route) {
    var temp = []
    for (var i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return 'global'
        } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
            temp = temp.concat(globalRoutes[i].children)
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
    var temp = []
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].children && menuList[i].children.length >= 1) {
            temp = temp.concat(menuList[i].children)
        }
        else if (menuList[i].menuUrl && /\S/.test(menuList[i].menuUrl)) {
            menuList[i].menuUrl = menuList[i].menuUrl.replace(/^\//, '')
            var route = {
                path: '/'+menuList[i].menuUrl,
                component: null,
                name: menuList[i].menuUrl.replace('/','-'),
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].menuName,
                    isDynamic: true,
                    isTab: true,
                    iframeUrl: ''
                }

            }
            // url以http[s]://开头, 通过iframe展示
            if (isURL(menuList[i].url)) {
                route['path'] = `i-${menuList[i].menuId}`
                route['name'] = `i-${menuList[i].menuId}`
                route['meta']['iframeUrl'] = menuList[i].url
            } else {
                try {
                    // console.log(menuList[i].menuUrl.split('/:')[0]);
                    route['component'] = _import(menuList[i].menuUrl.split('/:')[0]) || null
                } catch (e) {}
            }
            routes.push(route)
        }
    }
    if (temp.length >= 1) {
        fnAddDynamicMenuRoutes(temp, routes)
    } else {
        mainRoutes.name = 'main-dynamic'
        mainRoutes.children = routes
        router.addRoutes([
            mainRoutes,
            { path: '*', redirect: { name: '404' } }
        ])
        sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
        console.log('\n')
        console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
        console.log(mainRoutes.children)
        console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
    }
}

export default router


