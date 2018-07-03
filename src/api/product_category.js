import request from '@/router/axios'

/* 分类列表 */
export function fetchList(query) {
    return request({
      url: '/product/product/list_category',
      method: 'get',
      params: query
    })
  }


/* 新增 */
export function addObj(obj) {
  return request({
    url: '/product/product/add_category',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/product/product/delete_category?product_category_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function editObj(obj) {
  return request({
    url: '/product/product/edit_category' ,
    method: 'post',
    data: obj
  })
}
