import request from '@/router/axios'

/* 报警信息 */
export function getObj(query) {
  return request({
    url: '/device/device_alarm/list',
    method: 'get',
    params: query
  })
}

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

  /* 变量信息 */
export function getSensor(query) {
  return request({
    url: '/device/device_sensor/list',
    method: 'get',
    params: query
  })
}
