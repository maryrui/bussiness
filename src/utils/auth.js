// import Cookies from 'js-cookie'

const TokenKey='Admin-Token'

export function getToken(){
    return sessionStorage.getItem(TokenKey)
}

export function setToken(token){
    return sessionStorage.setItem(TokenKey,token)
}

export function removeToken(){
    return sessionStorage.removeItem(TokenKey)
}

export function getUserId(){
    return sessionStorage.getItem('userId')
}

export function setUserId(userid){
    return sessionStorage.setItem('userId',userid)
}

export function removeUserId(){
    return sessionStorage.removeItem('userId')
}