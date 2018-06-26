import request from '@/router/axios'
  
  /* 获取 */
export function getAlarmObj(id) {
  return request({
    url: '/device/device_alarm/list?deviceId=' + id,
    method: 'get',
  })
}

  /* 添加 */
  export function addObj(obj) {
    return request({
      url: '/device/device_notify/add' ,
      method: 'post',
      data: obj
    })
  }

  /* 修改 */
  export function editObj(obj) {
    return request({
      url: '/device/device_notify/edit' ,
      method: 'post',
      data: obj
    })
  }

   /* 删除 */
   export function delObj(id) {
    return request({
      url: '/device/device_notify/delete?project_device_Notify_id=' +id,
      method: 'post',
    })
  }