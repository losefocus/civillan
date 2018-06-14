import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project/list',
      method: 'get',
      params: query
    })
  }

  /* 所以管理员列表 */
  export function fetchRoleList() {
    return request({
      url: '/project/project_role/list',
      method: 'get',
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

  /* 图片上传 */
  export function uploadImg(obj) {
    return request({
      url: '/file/attachment/upload',
      method: 'post',
      // headers:{'Content-Type':'multipart/form-data'},
      data: obj
    })
  }