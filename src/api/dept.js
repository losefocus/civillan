import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/admin/dept/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dept/add/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dept/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/dept/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dept/edit',
    method: 'post',
    data: obj
  })
}
