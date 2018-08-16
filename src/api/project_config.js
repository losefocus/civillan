import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project_work_config/list',
      method: 'get',
      params: query
    })
  }


  /* 新增 */
  export function addObj(obj) {
    return request({
      url: '/project/project_work_config/add',
      method: 'post',
      data: obj
    })
  }

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project_work_config/delete?project_work_config_id=' + id,
    method: 'post'
  })
}

  /* 编辑 */
export function editObj(obj) {
  return request({
    url: '/project/project_work_config/edit',
    method: 'post',
    data: obj
  })
}
