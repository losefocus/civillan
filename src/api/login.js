import {baseUrl, dicUrl, khglUrl} from '@/config/env'
import request from '@/router/axios'
import {tableData, userInfo} from '@/mock/user'
import {menu, menuAll} from '@/mock/menu'

export const loginByUsername = (username, password, code, randomStr, domain) => {
  var grant_type = 'password'
  var scope = 'server'
  return request({
    url:'/admin/user/login',
    method: 'post',
    params: { username, password, randomStr, code, domain }  //,grant_type , scope
  })
}

export function mobileLogin(mobile, code) {
  var grant_type = 'mobile'
  var scope = 'server'
  return request({
    url: '/auth/mobile/token',
    headers: {
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { mobile, code, grant_type, scope }
  })
}

export const getUserInfo = (username) => {
  return request({
    url: '/admin/user/info',
    // headers: {
    //   'Authorization': 'Basic cGlnOnBpZw=='
    // },
    method: 'get',
    params:{username}
  })
}

export const logout = (accesstoken, refreshToken) => {
  return request({
    url: '/admin/user/logout',
    method: 'post',
    params: { accesstoken, refreshToken }
  })
}
