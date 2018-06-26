import { validatenull } from '@/util/validate'
/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const {
    name,
    content,
    type,
    datetime
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if (type) sessionStorage.setItem(name, JSON.stringify(obj))
  else localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */
export const getStore = (params) => {
  const {
    name,
    type
  } = params
  let obj = {}
  let content
  obj = sessionStorage.getItem(name)
  if (validatenull(obj)) obj = sessionStorage.getItem(name)
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = params => {
  let {
    name
  } = params
  localStorage.removeItem(name)
  sessionStorage.removeItem(name)
}
