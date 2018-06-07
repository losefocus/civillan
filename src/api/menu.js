import request from '@/router/axios'
export function GetMenu() {
  return request({
    url: '/admin/menu/userMenu',
    method: 'get'
  })
}
export function fetchTree(query) {
  return request({
    url: '/admin/menu/allTree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/admin/menu/navMenu',
    method: 'get'
  })
}

export function fetchUserTree() {
  return request({
    url: '/admin/menu/userTree',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu/add/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu/edit',
    method: 'post',
    data: obj
  })
}
