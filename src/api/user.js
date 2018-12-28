import request from '@/utils/request'

export function getUserList(query) {
    return request({
        url: '/api/StoreApi/GetUserByStoreId',
        method: 'get',
        params: query
    })
}

