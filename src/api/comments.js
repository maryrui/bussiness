import request from '@/utils/request'

export function getList(query){
    return request({
        url: '/api/StoreApi/GetContentList',
        method: 'get',
        params: query
    })
}