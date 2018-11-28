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
export function updateObj(obj) {
  return request({
    url: '/project/project_camera/edit',
    method: 'post',
    data: obj
  })
}

/* 分组列表 */
export function fetchCategoryList(query) {
    return request({
      url: '/project/project_camera/list_category',
      method: 'get',
      params: query
    })
  }

  /* 分组新增 */
export function addCategoryObj(obj) {
  return request({
    url: '/project/project_camera/add_category',
    method: 'post',
    data: obj
  })
}

/* 分组删除 */
export function delCategoryObj(id) {
  return request({
    url: '/project/project_camera/delete_category?project_camera_category_id=' + id,
    method: 'post'
  })
}

/* 分组修改 */
export function updataCategoryObj(obj) {
  return request({
    url: '/project/project_camera/edit_category',
    method: 'post',
    data: obj
  })
}