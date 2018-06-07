import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/client/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/client/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/client/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/client/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/client/edit',
    method: 'post',
    data: obj
  })
}
