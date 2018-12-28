import request from '@/utils/request'

export function getList(query){
    return request({
        url: '/api/StoreApi/GetContentList',
        method: 'get',
        params: query
    })
}

export function getTypeList(query){
    return request({
        url: '/api/StoreApi/GetCategory',
        method: 'get',
        params:query
    })
}

export function getArticleDetail(query){
    return request({
        url:"/api/StoreApi/GetContentDetail",
        method:'get',
        params:query
    })
}

export function submitArticle(data){
    return request({
        url:"/api/ContentApi/CreateOrEdit",
        method:'post',
        data
    })
}

export function DelImg(data){
    return request({
        url:"/api/FileApi/BatchDeleteFile",
        method:'post',
        data
    })
}

export function delArticle(query){
    return request({
        url:"/api/ContentApi/Delete",
        method:'get',
        params:query
    })
}

export function getTypeLists(query){
    return request({
        url:"/api/StoreApi/GetContentTypeList",
        method:'get',
        params:query
    })
}
export function addType(query){
    return request({
        url:"/api/StoreApi/CreateOrEditContentType",
        method:'get',
        params:query
    })
}

export function removeType(query){
    return request({
        url:"/api/StoreApi/DeleteContentType",
        method:'get',
        params:query
    })
}
