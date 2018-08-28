import request from '@/router/axios'

/* 生成 */
export function generateObj(query) {
  return request({
    url: '/certificate/certificate/generate',
    method: 'get',
    params: query
  })
}

export function getObj(query) {
  return request({
    url: '/certificate/certificate/get',
    method: 'get',
    params: query
  })
}
