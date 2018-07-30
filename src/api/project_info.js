import request from '@/router/axios'

/* 列表 */
export function getObj(id) {
    return request({
      url: '/project/project/get?project_id='+id,
      method: 'get',
    })
  }
