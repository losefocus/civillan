import request from '@/router/axios'

/*  */
export function getObj(id) {
  return request({
    url: '/device/device_sim/get?projectDevice.id='+id,
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

