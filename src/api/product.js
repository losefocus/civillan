import request from '@/router/axios'

/* 分类列表 */
export function fetchCategoryList() {
  return request({
    url: '/product/product/list_category',
    method: 'get',
  })
}

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

/* 获取模板信息 */
export function get_templateObj(id) {
  return request({
    url: '/product/product/get_template?product_template_id=' + id,
    method: 'get',
  })
}

/* 添加/修改模板信息 */
export function set_templateObj(obj) {
  return request({
    url: '/product/product/set_template' ,
    method: 'post',
    data: obj
  })
}