import request from '@/utils/request'

export function loginByUsername(username,password,usertype){
    const data={
       phone: username,
        password,
        userType:usertype
    }
    return request({
        url:"/api/UserApi/LoginUser",
        method:'post',
        data
    })
}

export  function logout(){
    return request({
        url:"/login/logout",
        method:"post"
    })
}

export function getUserInfo(userid){
    return request({
        url:"/api/UserApi/GetUserInfo",
        method:'get',
        params:{userId:userid}
    })
}