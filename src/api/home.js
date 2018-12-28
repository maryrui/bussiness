import request from '@/utils/request'

export function getSumNum(query){
    return request({
        url: '/api/StoreApi/GetActivityAppointmentStatis',
        method: 'get',
        params: query
    })
}