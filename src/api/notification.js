import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/notification/list',
      method: 'get',
      params: query
    })
  }


/* 新增 */
export function pushObj(obj) {
  return request({
    url: '/notification/push_message',
    method: 'post',
    params: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/notification/delete?id=' + id,
    method: 'post'
  })
}

/* 人员列表 */
export function fetchUserList() {
  return request({
    url: '/project/project_user/list',
    method: 'get',
  })
}
