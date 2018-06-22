import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project_file/list',
      method: 'get',
      params: query
    })
  }


  /* 新增 */
  export function addObj(obj) {
    return request({
      url: '/project/project_file/add',
      method: 'post',
      data: obj
    })
  }

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project_file/delete?project_file_id=' + id,
    method: 'post'
  })
}

  /* 编辑 */
export function updataObj(obj) {
  return request({
    url: '/project/project_file/edit',
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