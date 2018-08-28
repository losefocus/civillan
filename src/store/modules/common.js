import {getStore, removeStore, setStore} from '@/util/store'
import {validatenull} from '@/util/validate'
import {getDic} from '@/api/admin'
import {baseUrl} from '@/config/env';
import website from '@/const/website'

const common = {

  state: {
    isCollapse: false,
    isFullScren: false,
    isLock: getStore({
      name: 'isLock'
    }) || false,
    theme: getStore({
      name: 'theme'
    }) || '#30a487',
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    website: website,
    typeOptions: getStore({
      name: 'typeOptions'
    }) || [],
    organOptions: getStore({
      name: 'organOptions'
    }) || [],
    roleOptions: getStore({
      name: 'roleOptions'
    }) || [],
    adminerHash: getStore({
      name: 'adminerHash'
    }) || [],
  },
  actions: {
    // 获取字典公用类
    GetDic({
      commit,
      state,
      dispatch
    }, dic) {
      return new Promise((resolve, reject) => {
        if (dic instanceof Array) {
          Promise.all(dic.map(ele => getDic(ele))).then(data => {
            const result = {}
            dic.forEach((ele, index) => {
              result[ele] = data[index].data
            })
            resolve(result)
          })
        }
      })
    }
  },
  mutations: {
    // 管理员选项
    SET_ADMINERHASH:(state, action)=>{
      state.adminerHash = action
    },
    // 角色选项
    SET_ROLEOPTIONS:(state, action)=>{
      state.roleOptions = action
    },
    // 机构
    SET_ORGANOPTIONS:(state, action)=>{
      state.organOptions = action
    },
    // 机构类型
    SET_TYPEOPTIONS:(state, action)=>{
      state.typeOptions = action
    },
    SET_COLLAPSE_:(state, action)=>{
      state.isCollapse = action
    },
    SET_COLLAPSE: (state, action) => {
      state.isCollapse = !state.isCollapse
    },
    SET_FULLSCREN: (state, action) => {
      state.isFullScren = !state.isFullScren
    },
    SET_LOCK: (state, action) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_THEME: (state, color) => {
      state.theme = color
      setStore({
        name: 'theme',
        content: state.theme
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    }
  }
}
export default common
