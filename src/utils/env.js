/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
// let routerMode = 'history';
let imgBaseUrl = 'http://images.cangdu.org/';


if (process.env.NODE_ENV == 'development') {
        baseUrl="http://192.168.0.222";
    // baseUrl="http://business.api.aiteyou.net";
}else if(process.env.NODE_ENV == 'production'){

    // baseUrl = 'http://cangdu.org:8001';
    baseUrl="http://business.api.aiteyou.net";
}

export {
    baseUrl,
    // routerMode,
    imgBaseUrl,
}