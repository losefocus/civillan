import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/route/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/route/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/route/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/route/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/route/edit',
    method: 'post',
    data: obj
  })
}

export function applyObj() {
  return request({
    url: '/admin/route/apply',
    method: 'get'
  })
}
