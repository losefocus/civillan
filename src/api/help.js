import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/admin/article/list',
      method: 'get',
      params: query
    })
  }

    /* 详情 */
export function getObj(id) {
  return request({
    url: '/admin/article/get?id='+id,
    method: 'get',
  })
}