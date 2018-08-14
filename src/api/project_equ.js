import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/device/device/list',
    method: 'get',
    params: query
  })  
}

  /* 所有产品列表 */
export function fetchProductList(query) {
  return request({
    url: '/product/product/list',
    method: 'get',
    params: query
  })
}
  /* 所有项目列表 */
export function projectList(query) {
  return request({
    url: '/project/project/list',
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
/* 删除 */
export function delObj(id) {
  return request({
    url: '/device/device/delete?project_device_id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function updataObj(obj) {
  return request({
    url: '/device/device/edit',
    method: 'post',
    data: obj
  })
}

  /* 分组信息 */
  export function getGroupObj(query) {
    return request({
      url: '/device/device_group/list',
      method: 'get',
      params: query
    })
  }

/* 配置信息 */
export function getConfigObj(query) {
  return request({
    url: '/device/device_config/list',
    method: 'get',
    params: query
  })
}
/* 证书信息 */
// export function getSensorObj(id) {
//   return request({
//     url: '/device/device_sensor/list?deviceId=' + id,
//     method: 'get',
//     params: query
//   })
// }
/* 变量信息 */
export function getSensorObj(query) {
  return request({
    url: '/device/device_sensor/list',
    method: 'get',
    params: query
  })
}
/* 报警信息 */
export function getAlarmObj(query) {
  return request({
    url: '/device/device_alarm/list',
    method: 'get',
    params: query
  })
}
/* 通知信息 */
export function getNotifyObj(query) {
  return request({
    url: '/device/device_notify/list',
    method: 'get',
    params: query
  })
}
