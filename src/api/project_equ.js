import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/device/device/list',
      method: 'get',
      params: query
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
