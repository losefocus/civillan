import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/product/product/list',
      method: 'get',
      params: query
    })
  }


/* 新增 */
export function addObj(obj) {
  return request({
    url: '/product/product/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/product/product/delete?product_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function updataObj(obj) {
  return request({
    url: '/product/product/edit' ,
    method: 'post',
    data: obj
  })
}
