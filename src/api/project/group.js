import request from '@/router/axios'
  /* 信息 */
export function getObj(query) {
  return request({
    url: '/device/device_group/list',
    method: 'get',
    params: query
  })
}

  /* 添加 */
  export function addObj(obj) {
    return request({
      url: '/device/device_group/add' ,
      method: 'post',
      data: obj
    })
  }

  /* 修改 */
  export function editObj(obj) {
    return request({
      url: '/device/device_group/edit' ,
      method: 'post',
      data: obj
    })
  }

   /* 删除 */
   export function delObj(id) {
    return request({
      url: '/device/device_group/delete?project_device_group_id=' +id,
      method: 'post',
    })
  }