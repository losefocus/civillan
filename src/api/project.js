import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
    return request({
      url: '/project/project/list',
      method: 'get',
      params: query
    })
  }

  export function fetchRoleList(query) {
    return request({
      url: '/project/project_role/list',
      method: 'get',
      params: query
    })
  }
// export function fetchList(query) {
//     return request({
//       url: '/project/project/list',
//       method: 'get',
//       params: query,
//       headers: {
//           'Content-Type': 'application/json; charset=UTF-8'
//         }
//     })
//   }