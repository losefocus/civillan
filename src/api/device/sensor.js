import request from '@/router/axios'

/* 变量信息 */
export function getObj(query) {
  return request({
    url: '/device/device_sensor/list',
    method: 'get',
    params: query
  })
}
  /* 添加 */
  export function addObj(obj) {
    return request({
      url: '/device/device_sensor/add' ,
      method: 'post',
      data: obj
    })
  }

  /* 修改 */
  export function editObj(obj) {
    return request({
      url: '/device/device_sensor/edit' ,
      method: 'post',
      data: obj
    })
  }

   /* 删除 */
   export function delObj(id) {
    return request({
      url: '/device/device_sensor/delete?project_device_variable_ids=' +id,
      method: 'post',
    })
  }

