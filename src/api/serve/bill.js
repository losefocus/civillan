import request from '@/router/axios'

/* 添加 */
export function addObj(query) {
  return request({
    url: '/order/bill/add',
    method: 'post',
    data: query
  })
}

/* 添加 */
export function updateObj(query) {
  return request({
    url: '/order/bill/update',
    method: 'post',
    data: query
  })
}

/* 列表 */
export function getObj() {
  return request({
    url: '/order/bill/get',
    method: 'get',
  })
}

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/order/bill/list',
    method: 'get',
    params: query
  })
}