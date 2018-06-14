import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project_organ/list',
      method: 'get',
      params: query
    })
  }

  /* 新增 */
export function addObj(obj) {
  return request({
    url: '/project/project_organ/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project_organ/delete?project_organ_id=' + id,
    method: 'post'
  })
}

/* 修改 */
export function editObj(obj) {
  return request({
    url: '/project/project_organ/edit',
    method: 'post',
    data: obj
  })
}