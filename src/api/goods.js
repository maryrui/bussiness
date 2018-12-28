import request from '@/utils/request'

export function getList(query){
    return request({
        url: '/goods/list',
        method: 'get',
        params: query
    })
}

export function submitTimer(data){
    return request({
        url: '/api/TimeBlockApi/CreateOrEditTimeBlock',
        method: 'post',
        data
    })
}

export function getActiveCount(query){
    return request({
        url: '/api/StoreApi/GetActivityStatusCount',
        method: 'get',
        params:query
    })
}

export function updateStatus(query){
    return request({
        url: '/api/StoreApi/UpdateActivityStatus',
        method: 'get',
        params:query
    })
}

export function getTimerList(query){
    return request({
        url: '/api/TimeBlockApi/GetStoreTimeBlockList',
        method: 'get',
        params:query
    })
}

export function removeOne(query){
    return request({
        url: '/api/TimeBlockApi/Delete',
        method: 'get',
        params:query
    })
}

export function getActiveType(query){
    return request({
        url: '/api/StoreApi/GetStoreActivityType',
        method: 'get',
        params:query
    })
}

export function creatActive(data){
    return request({
        url: '/api/StoreApi/CreateOrEditActivity',
        method: 'post',
        data
    })
}
export function getDetail(query){
    return request({
        url: '/api/StoreApi/GetDetail',
        method: 'get',
        params:query
    })
}

export function getActiveList(query){
    return request({
        url: '/api/StoreApi/GetActivityList',
        method: 'get',
        params:query
    })
}
export function getTimeDetail(query){
    return request({
        url: '/api/TimeBlockApi/GetTimeBlockById',
        method: 'get',
        params:query
    })
}

export function getTypeLists(query){
    return request({
        url:"/api/StoreApi/GetActivityTypeList",
        method:'get',
        params:query
    })
}
export function addType(query){
    return request({
        url:"/api/StoreApi/CreateOrEditActivityType",
        method:'get',
        params:query
    })
}

export function removeType(query){
    return request({
        url:"/api/StoreApi/DeleteActivityType",
        method:'get',
        params:query
    })
}

