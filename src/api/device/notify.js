import request from '@/router/axios'
  
  /* 获取报警选项 */
export function getAlarmObj(id) {
  return request({
    url: '/device/device_alarm/list?deviceId=' + id,
    method: 'get',
  })
}

  /* 获取人员选项 */
export function getUserObj(query) {
  return request({
    url: '/device/device_notify/get_filter_user',
    method: 'get',
    params: query
  })
}

/* 通知信息 */
export function getObj(query) {
  return request({
    url: '/device/device_notify/list',
    method: 'get',
    params: query
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