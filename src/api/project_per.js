import request from '@/router/axios'

/* 机构列表 */
export function fetchOrganList(id) {
  return request({
    url: '/project/project_organ/list?projectId='+id,
    method: 'get',
  })
}

  /* 人员列表 */
  export function fetchUserList(query) {
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
 export function userInfo(id) {
  return request({
    url: '/project/project_user/get?project_user_id='+id,
    method: 'get',
  })
}

/* 角色列表 */
export function fetchRoleList(query) {
  return request({
    url: '/project/project_role/list',
    method: 'get',
    params: query
  })
}

/* 新增角色 */
export function addRoleObj(obj) {
  return request({
    url: '/project/project_role/add',
    method: 'post',
    data: obj
  })
}

/* 删除角色 */
export function delRoleObj(id) {
  return request({
    url: '/project/project_role/delete?project_role_id=' + id,
    method: 'post'
  })
}