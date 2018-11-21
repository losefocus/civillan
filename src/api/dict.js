import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/dict/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dict/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dict/get?id=' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/admin/dict/delete?id=' + row.id + '&type=' + row.type,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dict/edit/',
    method: 'post',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/admin/dict/type?type=' + type,
    method: 'get'
  })
}

export function remote_p(type) {
  return request({
    url: '/admin/dict/platform/dict?type=' + type,
    method: 'get'
  })
}
