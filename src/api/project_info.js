import request from '@/router/axios'

/* 项目详情 */
export function getObj(id) {
  return request({
    url: '/project/project/get?project_id='+id,
    method: 'get',
  })
}
/* 机构列表 */
export function organList(query) {
  return request({
    url: '/project/project_organ/list',
    method: 'get',
    params: query
  })
}
/* 设备列表 */
export function deviceList(query) {
  return request({
    url: '/device/device/list',
    method: 'get',
    params: query
  })
}
/* 影像列表 */
export function mediaList(query) {
  return request({
    url: '/project/project_media/list',
    method: 'get',
    params: query
  })
}
/* 人员列表 */
export function userList(query) {
  return request({
    url: '/project/project_user/list',
    method: 'get',
    params: query
  })
}
/* 文档列表 */
export function docList(query) {
  return request({
    url: '/project/project_file/list',
    method: 'get',
    params: query
  })
}
