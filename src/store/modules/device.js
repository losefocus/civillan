import {getStore, removeStore, setStore} from '@/util/store'
import {validatenull} from '@/util/validate'
import {getDic} from '@/api/admin'
import {baseUrl} from '@/config/env';

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
    groupOptions: getStore({
      name: 'groupOptions'
    }) || [],
  },
  actions: {
    
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
    // 选项
    SET_GROUPOPTIONS:(state, action)=>{
      state.groupOptions = action
    },
  }
}
export default device
