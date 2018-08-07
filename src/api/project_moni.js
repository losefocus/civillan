import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project_camera/list',
      method: 'get',
      params: query
    })
  }

  /* 新增 */
export function addObj(obj) {
  return request({
    url: '/project/project_camera/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project_camera/delete?project_camera_id=' + id,
    method: 'post'
  })
}

/* 修改 */
export function updataObj(obj) {
  return request({
    url: '/project/project_camera/edit',
    method: 'post',
    data: obj
  })
}