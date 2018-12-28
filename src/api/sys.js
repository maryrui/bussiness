import request from '@/utils/request'

export function createUser(data) {
    return request({
        url: '/api/UserApi/CreateOrEditBusinessUser',
        method: 'post',
        data: data
    })
}

export function createGroup(data) {
    return request({
        url: '/api/GroupApi/CreateOrEditGrade',
        method: 'post',
        data: data
    })
}

export function getUserList(query) {
    return request({
        url: '/api/UserApi/GetBusinessUserList',
        method: 'get',
        params: query
    })
}

export function getGroupList(query) {
    return request({
        url: '/api/GroupApi/GetStoreGrade',
        method: 'get',
        params: query
    })
}

export function getUserDetail(query) {
    return request({
        url: '/api/UserApi/GetBusinessUserById',
        method: 'get',
        params: query
    })
}

export function getGroupDetail(query) {
    return request({
        url: '/api/GroupApi/GetGradeById',
        method: 'get',
        params: query
    })
}
export function getMenuList(query) {
    return request({
        url: '/api/GroupApi/GetMenuList',
        method: 'get',
        params: query
    })
}
export function delGroup(query) {
    return request({
        url: '/api/GroupApi/Delete',
        method: 'get',
        params: query
    })
}
export function delUser(query) {
    return request({
        url: '/api/UserApi/EnableOrDisEnableUser',
        method: 'get',
        params: query
    })
}