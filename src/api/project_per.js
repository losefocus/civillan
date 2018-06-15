import request from '@/router/axios'

  /* 人员列表 */
  export function fetchRoleList(query) {
    return request({
      url: '/project/project_user/list',
      method: 'get',
      params: query
    })
  }

  /* 新增 */
  export function addObj(obj) {
    return request({
      url: '/project/project_user/add',
      method: 'post',
      data: obj
    })
  }

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project_user/delete?id=' + id,
    method: 'post'
  })
}
/* 修改 */
export function updateObj(obj) {
  return request({
    url: '/project/project_user/edit',
    method: 'post',
    data: obj
  })
}

 /* 角色信息 */
 export function roleInfo(id) {
  return request({
    url: '/project/project_user/get?project_user_id='+id,
    method: 'get',
  })
}