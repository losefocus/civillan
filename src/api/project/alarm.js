import request from '@/router/axios'
  
  /* 添加 */
  export function addObj(obj) {
    return request({
      url: '/device/device_alarm/add' ,
      method: 'post',
      data: obj
    })
  }

  /* 修改 */
  export function editObj(obj) {
    return request({
      url: '/device/device_alarm/edit' ,
      method: 'post',
      data: obj
    })
  }

   /* 删除 */
   export function delObj(id) {
    return request({
      url: '/device/device_alarm/delete?project_device_alarm_id=' +id,
      method: 'post',
    })
  }