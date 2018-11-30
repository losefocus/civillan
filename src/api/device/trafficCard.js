import request from '@/router/axios'

/*  */
export function getObj(id) {
  return request({
    url: '/device/device_sim/get?deviceId='+id,
    method: 'get',
    // params: query
  })
}

/* 绑定 */
export function setObj(query) {
  return request({
    url: '/device/device_sim/set',
    method: 'post',
    data: query
  })
}

/* 解绑 */
export function deleteObj(query) {
  return request({
    url: '/device/device_sim/delete',
    method: 'post',
    params: query
  })
}

