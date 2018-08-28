import request from '@/router/axios'

/* 分类列表 */
export function categoryList(query) {
    return request({
      url: '/product/product/list_category',
      method: 'get',
      params: query
    })
  }

/* 参数列表 */
export function fetchList(query) {
    return request({
      url: '/product/product_params/list',
      method: 'get',
      params: query
    })
  }

/* 新增 */
export function addObj(obj) {
  return request({
    url: '/product/product_params/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/product/product_params/delete?product_params_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function editObj(obj) {
  return request({
    url: '/product/product_params/edit' ,
    method: 'post',
    data: obj
  })
}
