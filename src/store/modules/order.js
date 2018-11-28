import {getStore, removeStore, setStore} from '@/util/store'

const common = {

  state: {

    projectState: getStore({
      name: 'projectState'
    }) || {},
  },
  actions: {
 
  },
  mutations: {

    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
  }
}
export default order
