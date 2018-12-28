import request from '@/utils/request'

export function getList(query){
    return request({
        url: '/api/FamilyCoachApi/GetBusCoursesList',
        method: 'get',
        params: query
    })
}

export function submit(data){
    return request({
        url: '/api/FamilyCoachApi/AddOrUpdateBusCourses',
        method: 'post',
        data
    })
}


export function getCategory(query){
    return request({
        url: '/api/FamilyCoachApi/GetFcClassifies',
        method: 'get',
        params: query
    })
}

export function delone(query){
    return request({
        url: '/api/FamilyCoachApi/DeleteBusCourses',
        method: 'get',
        params: query
    })
}
export function getDetail(query){
    return request({
        url: '/api/FamilyCoachApi/GetCoursesForId',
        method: 'get',
        params: query
    })
}
