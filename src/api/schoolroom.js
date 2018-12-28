import request from '@/utils/request'

export function getList(query){
    return request({
        url: '/api/FatherStudyApi/GetContentList',
        method: 'get',
        params: query
    })
}

export function submit(data){
    return request({
        url: '/api/ContentApi/CreateOrEdit',
        method: 'post',
        data
    })
}


export function getCategory(){
    return request({
        url: '/api/FatherStudyApi/GetCategory',
        method: 'get',

    })
}


export function getDetail(query){
    return request({
        url: '/api/FatherStudyApi/GetDetail',
        method: 'get',
        params: query
    })
}

export function getThmeList(query){
    return request({
        url: '/api/FatherStudyApi/GetFatherStudyTheme',
        method: 'get',
        params: query
    })
}

export function delone(query){
    return request({
        url: '/api/ContentApi/Delete',
        method: 'get',
        params: query
    })
}

