import request from '@/utils/request'

const getShortUrl = async function(parmas){
    return request({
        url: '/api/short-url',
        method: 'get',
        params: parmas
    })
}