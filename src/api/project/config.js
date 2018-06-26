import request from '@/router/axios'

  /* 添加 */
  export function addObj(obj) {
    return request({
      url: '/device/device_config/add' ,
      method: 'post',
      data: obj
    })
  }

  /* 修改 */
  export function editObj(obj) {
    return request({
      url: '/device/device_config/edit' ,
      method: 'post',
      data: obj
    })
  }

   /* 删除 */
   export function delObj(id) {
    return request({
      url: '/device/device_config/delete?project_device_config_id=' +id,
      method: 'post',
    })
  }