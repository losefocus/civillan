import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}
/* 添加 */
export function addObj(obj) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data: obj
  })
}
/* 获取 */
export function getObj(id) {
  return request({
    url: '/admin/user/get?id=' + id,
    method: 'get'
  })
}
/* 删除 */
export function delObj(id) {
  return request({
    url: '/admin/user/delete?id=' + id,
    method: 'post'
  })
}
/* 修改 */
export function putObj(obj) {
  return request({
    url: '/admin/user/edit',
    method: 'post',
    data: obj
  })
}

/* 修改 */
export function get_parent(id) {
  return request({
    url: '/admin/user/get_parent?id='+id,
    method: 'get',
  })
}