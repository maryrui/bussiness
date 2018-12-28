import request from '@/utils/request'

export function getList(query) {
    return request({
        url: '/api/StoreApi/GetActivityAppointmentList',
        method: 'get',
        params: query
    })
}

export function getCount(query) {
    return request({
        url: '/api/StoreApi/GetStatusCount',
        method: 'get',
        params: query
    })
}

export function pass(data) {
    return request({
        url: '/api/StoreApi/UpdateAppointmentStatus',
        method: 'post',
        data
    })
}

