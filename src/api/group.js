import request from '@/router/axios'

export function GetMenu() {
  return request({
    url: '/admin/menu/userMenu',
    method: 'get'
  })
}
export function fetchTree(query) {
  return request({
    url: '/admin/user/list_group',
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
    url: '/admin/user/add_group',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/get_group?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/delete_group?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user/edit_group',
    method: 'post',
    data: obj
  })
}
