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
export function updateObj(obj) {
  return request({
    url: '/project/project_organ/edit',
    method: 'post',
    data: obj
  })
}

/* 类型列表 */
export function fetchTypeList(id) {
  return request({
    url: '/project/project_organ/list_organ_type?projectId='+id,
    method: 'get',
  })
}

  /* 类型新增 */
  export function addObjType(obj) {
    return request({
      url: '/project/project_organ/add_organ_type',
      method: 'post',
      data: obj
    })
  }
  
  /* 类型删除 */
  export function delObjType(id) {
    return request({
      url: '/project/project_organ/delete_organ_type?project_organ_type_id=' + id,
      method: 'post'
    })
  }
  
  /* 类型修改 */
  export function updateObjType(obj) {
    return request({
      url: '/project/project_organ/edit_organ_type',
      method: 'post',
      data: obj
    })
  }