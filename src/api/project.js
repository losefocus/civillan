import request from '@/router/axios'

/* 项目列表 */
export function fetchList(query) {
    return request({
      url: '/project/project/list',
      method: 'get',
      params: query
    })
  }

  /* 项目列表 */
export function getObj(id) {
  return request({
    url: '/project/project/get?project_id='+id,
    method: 'get',
  })
}


  /* 管理员列表 */
  export function fetchAdminList(query) {
    return request({
      url: '/admin/user/list',
      method: 'get',
      params: query
    })
  }
 /* 图片上传 */
export function uploadImg(obj) {
  return request({
    url: '/file/attachment/upload',
    method: 'post',
    // headers:{'Content-Type':'multipart/form-data'},
    data: obj
  })
}
/* 新增 */
export function addObj(obj) {
  return request({
    url: '/project/project/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project/delete?project_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function editObj(obj) {
  return request({
    url: '/project/project/edit',
    method: 'post',
    data: obj
  })
}