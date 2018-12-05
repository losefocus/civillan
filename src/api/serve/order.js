import request from '@/router/axios'


/* 添加 */
export function addObj(query) {
  return request({
    url: '/order/add',
    method: 'post',
    data: query
  })
}

/* 支付 */
export function payment(id) {
  return request({
    url: '/order/pay/payment?orderId='+id,
    method: 'get',
  })
}

/* 订单列表 */
export function fetchList(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

/* 开票的列表 */
export function orderList(ids) {
  return request({
    url: '/order/get_order_list?ids='+ids,
    method: 'get',
  })
}

/* 服务列表 */
export function serviceList(query) {
  return request({
    url: '/order/service/list',
    method: 'get',
    params: query
  })
}

/* 取消订单 */
export function cancelObj(id) {
  return request({
    url: '/order/cancel?id='+id,
    method: 'get',
  })
}