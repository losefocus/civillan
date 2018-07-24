import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/article/tag/list',
    method: 'get',
    params: query
  })
}

  /* 删除 */
export function delObj(id) {
    return request({
      url: '/admin/article/tag/delete?id=' + id,
      method: 'post'
    })
  }

  /* 新增 */
export function addObj(obj) {
    return request({
      url: '/admin/article/tag/add',
      method: 'post',
      data: obj
    })
  }

  /* 编辑 */
export function editObj(obj) {
    return request({
      url: '/admin/article/tag/edit',
      method: 'post',
      data: obj
    })
  }