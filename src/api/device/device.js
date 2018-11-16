import request from '@/router/axios'

/* 获取所有可关联设备列表 */
export function fetchDeviceList(type) {
  return request({
    url: '/device/device_relation/bindable?type='+type,
    method: 'get',
  })
}

/* 新增设备关联 */
export function bindDevice(obj) {
  return request({
    url: '/device/device_relation/bind',
    method: 'post',
    params: obj
  })
}

/* 获取已关联设备列表 */
export function deviceRelationList(obj) {
  return request({
    url: '/device/device_relation/list',
    method: 'get',
    params: obj
  })
}
