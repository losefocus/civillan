import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/admin/help_center/list',
      method: 'get',
      params: query
    })
  }

    /* 详情 */
export function getObj(id) {
  return request({
    url: '/admin/help_center/get?id='+id,
    method: 'get',
  })
}