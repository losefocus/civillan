import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/order/billHistory/list',
    method: 'get',
    params: query
  })
}
