import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import {
  validatenull
} from '@/util/validate'
import {
  getDic
} from '@/api/admin'
import {
  baseUrl
} from '@/config/env';
import website from '@/const/website'
const device = {

  state: {

    configList: getStore({
      name: 'configList'
    }) || [],
    certiList: getStore({
      name: 'certiList'
    }) || [],
    sensorList: getStore({
      name: 'sensorList'
    }) || [],
    alarmList: getStore({
      name: 'alarmList'
    }) || [],
    notifyList: getStore({
      name: 'notifyList'
    }) || [],
    alarmOptions: getStore({
      name: 'alarmOptions'
    }) || [],
  },
  actions: {
    // 获取字典公用类
    // GetDic({
    //   commit,
    //   state,
    //   dispatch
    // }, dic) {
    //   return new Promise((resolve, reject) => {
    //     if (dic instanceof Array) {
    //       Promise.all(dic.map(ele => getDic(ele))).then(data => {
    //         const result = {}
    //         dic.forEach((ele, index) => {
    //           result[ele] = data[index].data
    //         })
    //         resolve(result)
    //       })
    //     }
    //   })
    // }
  },
  mutations: {

    // 配置
    SET_CONFIGLIST:(state, action)=>{
      state.configList = action
    },
    // 证书
    SET_CERTILIST:(state, action)=>{
      state.certiList = action
    },
    // 变量
    SET_SENSORLIST:(state, action)=>{
      state.sensorList = action
    },
    // 报警
    SET_ALARMLIST:(state, action)=>{
      state.alarmList = action
    },
    // 通知
    SET_NOTIFYLIST:(state, action)=>{
      state.notifyList = action
    },
    // 报警选项
    SET_ALARMOPTIONS:(state, action)=>{
      state.alarmOptions = action
    },
    // 选项
    SET_ALARMOPTIONS:(state, action)=>{
      state.alarmOptions = action
    },
    
  }
}
export default device
