import request from '@/router/axios'

/* 添加 */
export function addObj(query) {
  return request({
    url: '/order/service/add',
    method: 'post',
    data: query
  })
}

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/order/service/list',
    method: 'get',
    params: query
  })
}

/* 编辑 */
export function updateObj(query) {
  return request({
    url: '/order/service/update',
    method: 'post',
    data: query
  })
}

/* 删除 */
export function deleteObj(id) {
  return request({
    url: '/order/service/delete?id='+id,
    method: 'get',
  })
}

/* 删除 */
export function getObj(id) {
  return request({
    url: '/order/service/get?id='+id,
    method: 'get',
  })
}

