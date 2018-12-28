import request from '@/utils/request'

export function removeImg(query){
    return request({
        url: '/api/FileApi/BatchDeleteFile',
        method: 'post',
        params: query
    })
}