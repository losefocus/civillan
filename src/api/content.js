import request from '@/router/axios'
/* 标签列表 */
export function fetchTagList(query) {
  return request({
    url: '/admin/article/tag/list',
    method: 'get',
    params: query
  })
}

/* 分类列表 */
export function fetchCategoryList(query) {
  return request({
    url: '/admin/article/category/list',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/article/list',
    method: 'get',
    params: query
  })
}

/* 图片上传 */
export function upload(query) {
    return request({
      url: '/file/attachment/upload',
      method: 'post',
      data: query,
    })
  }

  /* 删除 */
export function delObj(id) {
    return request({
      url: '/admin/article/delete?id=' + id,
      method: 'post'
    })
  }

  /* 新增 */
export function addObj(obj) {
    return request({
      url: '/admin/article/add',
      method: 'post',
      data: obj
    })
  }

  /* 编辑 */
export function updataObj(obj) {
    return request({
      url: '/admin/article/update',
      method: 'post',
      data: obj
    })
  }

  /* 详情 */
export function getObj(id) {
    return request({
      url: '/admin/article/get?id='+id,
      method: 'get',
    })
  }