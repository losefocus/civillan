import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/admin/article/list',
      method: 'get',
      params: query
    })
  }


/* 新增 */
export function addObj(obj) {
  return request({
    url: '/admin/article/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/admin/article/delete?id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function updataObj(obj) {
    return request({
      url: '/admin/article/update',
      method: 'post',
      data: obj
    })
  }