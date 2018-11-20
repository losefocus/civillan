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

