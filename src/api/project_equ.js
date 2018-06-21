import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/device/device/list',
    method: 'get',
    params: query
  })  
}

  /* 所有产品列表 */
export function fetchProductList() {
  return request({
    url: '/product/product/list',
    method: 'get',
  })
}

/* 新增 */
export function addObj(obj) {
  return request({
    url: '/device/device/add',
    method: 'post',
    data: obj
  })
}
/* 删除 */
export function delObj(id) {
  return request({
    url: '/device/device/delete?project_device_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function updataObj(obj) {
  return request({
    url: '/device/device/edit',
    method: 'post',
    data: obj
  })
}