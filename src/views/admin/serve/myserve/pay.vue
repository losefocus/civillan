<template>
<div class="app-container">
    <div class="content clearfix">
        <div class="p_t clearfix">
            <div class="step_ step_3 pull-right clearfix" style="margin-left:20px;" :class="{active:active>=3}">
                <div class="triangle_border_right pull-left triangle_white">
                    <span></span>
                </div>
                <div class="pull-left step_line">支付完成</div>
            </div>
            <div class="step_ step_2 pull-right clearfix" style="margin-left:20px;" :class="{active:active>=2}">
                <div class="triangle_border_right pull-left triangle_white">
                    <span></span>
                </div>
                <div class="pull-left step_line">支付</div>
                <div class="triangle_border_right pull-left">
                    <span></span>
                </div>
            </div>
            <div class="step_ step_1 pull-right clearfix" :class="{active:active>=1}">
                <div class="pull-left step_line">确认订单</div>
                <div class="triangle_border_right pull-left">
                    <span></span>
                </div>
            </div>
        </div>
        <div v-if="active==1" class="step_main_1">
            <div class="p_c">
                <el-table
                :data="tableData"
                style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="商品信息"
                        class-name="info">
                        <template slot-scope="scope">
                            <div style="padding:10px 0;">
                                <div style="font-size:18px;color:#333;line-height:40px;font-weight:600;">短信通知</div>
                                <div style="font-size:12px;color:#999">购买有效期：<span style="color:#666">{{scope.row.date}}</span></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="原价">
                        <template slot-scope="scope">
                            ￥{{scope.row.price}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="price_"
                        label="折后价格">
                        <template slot-scope="scope">
                            ￥{{scope.row.price_}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="p_b pull-right" style="text-align: right;padding-top:30px;">
                <div style="font-size:20px;color:#333333;height:30px;line-height:30px;">应付款：<span style="display:inline-block;font-size:36px;color:#F15F5F;">￥260</span></div>
                <div style="color:#20A445;font-size:12px;padding:5px 0 8px;">省￥20</div>
                <div style="font-size:12px;color:rgba(153,153,153,1);line-height:20px;padding-bottom:25px;">发票：订单对应可开发票的类型和抬头为您在用户中心-发票信息管理中</div>
                <el-button type="primary" size="small" style="margin-bottom:30px" @click="toPay">去支付</el-button>
            </div>
        </div>
        <div v-if="active==2" class="step_main_2">
            <div class="orderInfo">
                <div class="o_tit">支付订单<span class="pull-right" style="font-size:14px;font-weight:400;color:#333">应付款：<span style="color:#F15F5F;font-size:24px;">￥260</span></span></div>
                <div class="o_number">订单号：1233123123122312</div>
                <div style="color:#666666;font-size:14px;">短信通知<span style="padding-left:20px;">数量：{{tableData[0].num}}</span><span style="padding-left:20px;">有效期：{{tableData[0].date}}</span></div>
            </div>
            <div class="orderType clearfix">
                <div class="o_tit">支付方式</div>
                <el-tabs v-model="activeTab" type="card">
                    <el-tab-pane label="支付平台" name="first">
                        <div style="margin-top:20px;">
                            <el-radio-group v-model="radio">
                                <el-radio :label="1" style="height:42px">
                                    <div class="pay_">支付宝支付</div>
                                </el-radio>
                                <el-radio :label="2">
                                    <div class="pay_ pay_wechart">微信支付</div>
                                </el-radio>
                            </el-radio-group>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="线下电汇" name="second">
                        <div style="font-size:16px;color:#333;line-height:24px;margin-top:20px;font-weight:500;">
                            <div style="line-height:24px;">开户名称：浙江智握领程科技股份有限公司</div>
                            <div style="height:46px;line-height:46px;margin:25px 0;vertical-align: middle;">
                                <span style="float:left;">开户银行：</span>
                                <div class="TZblank" style="float:left;width:156px;height:44px;border:1px solid #DBDBDB;margin-right:20px;"></div>
                                <span style="float:left;font-size:14px;color:#999999">台州银行股份有限公司杭州分行</span>
                            </div>
                            <div style="line-height:42px;">
                                <span style="float:left;">银行账号：</span>
                                <span style="float:left;height:42px;width:234px;background:#D8D8D8;text-align:center;font-size:18px;">5304 0238 1600 015</span></div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-button v-if="activeTab=='first'" type="primary" class="pull-right" size="small" style="margin:55px 0 30px;" @click="confirmPay">确认支付</el-button>
                <el-button v-if="activeTab=='second'" type="primary" class="pull-right" size="small" style="margin:20px 0 30px;" >去汇款</el-button>
            </div>
        </div>
        <div v-if="active==3" class="step_main_3">
            <div class="pay_finish">
                <i class="el-icon-check icon_" style=""></i>
                <div style="line-height:24px;font-size:20px;color:#333333;margin:20px 0 7px;">支付成功</div>
                <div style="line-height:24px;font-size:12px;color:#878787">可前往<span style="color:#3489FF;cursor: pointer;" @click="toPayRecord"> 购买记录 </span>查看</div>
            </div>
        </div>
    </div>
</div>
    
</template>

<script>
import { addObj,payment} from "@/api/serve/order";

export default {
    data(){
        return {
            active:'1',
            tableData: [{
                date: '永久',
                num: '100',
                price: '600',
                price_:'400'
            }],
            activeTab: 'first',
            radio:1,
            orderId:null
        }
    },
    created(){
    },
    methods:{
        toPay(){
            let data = this.$route.query
            addObj(data).then(res => {
                if(res.data.success){
                    this.orderId = res.data.result.id
                    this.active = 2
                }
            })
            
        },
        confirmPay(){
            payment(this.orderId).then(res => {
                if(res.data.success){
                    const div = document.createElement('div');
                    div.innerHTML = res.data.result;
                    document.body.appendChild(div);
                    document.forms[0].submit()
                    //this.active = 3
                }
            })
        },
        toPayRecord(){
            this.$router.push({path:'/serve/buy'})
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    margin: 0 auto 50px;
    width: 1135px;
    background: #fff;
}
.p_t{
    margin-bottom:20px;
    .step_line{
        width:365px;
        height:40px;
        background:#CACACA;
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-size:16px;
    }
    .step_2{
        margin-left: -10px
    }
    .step_3 .step_line{
        width:365px;
    }
    .step_.active .step_line{
        background:#409EFF;
    }
    /*向右三角形*/
    .triangle_border_right{
        position:relative;
    }
    .triangle_border_right span{
        display:block;
        width:0;
        height:0;
        border-width:20px 0 20px 30px;
        border-style:solid;
        border-color:transparent transparent transparent #CACACA;/*透明 透明 透明 黄*/
        position:absolute;
        
    }
    .triangle_border_right.triangle_white span{
        border-color:transparent transparent transparent #fff !important;
    }
    .step_.active .triangle_border_right span{
        border-color:transparent transparent transparent #409EFF;/*透明 透明 透明 黄*/
    }
}
.p_c{
    width: 100%;
    border: 1px solid #EBEDF8;
    border-bottom: none;
    .p_c_tit{

    }
}
.orderInfo{
    border: 1px solid #EBEDF8;
    height: 155px;
    padding: 0 30px;
    margin-bottom: 20px;
    .o_tit{
        line-height: 54px;
        border-bottom: 1px solid #EBEDF8;
        font-weight:600;
    }
    .o_number{
        height:20px;
        font-size:12px;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:20px;
        padding: 20px 0 15px;
    }
}
.orderType{
    // height: 315px;
    border: 1px solid #EBEDF8;
    padding: 0 30px;
    .o_tit{
        line-height: 54px;
        border-bottom: 1px solid #EBEDF8;
        font-weight:600;
        margin-bottom: 30px;
    }
    .pay_{
        width: 136px;
        height: 40px;
        display: inline-block;
        border: 1px solid #EBEDF8;
        vertical-align: middle;
        margin-right: 30px;
        line-height: 40px;
        padding-left:55px;
        box-sizing: border-box;
        background: url(../../../../assets/img/alipay.png)no-repeat 15px center
    }
    .pay_wechart{
        background: url(../../../../assets/img/wechartpay.png)no-repeat 15px center;
        padding-left:60px;
    }
    .TZblank{
        background: url(../../../../assets/img/TZblank.png)no-repeat center;
    }
}
.step_main_3{
    border: 1px solid #EBEDF8;
    height: 530px;
    display:flex;
    justify-content:center;
    align-items:center;
    text-align: center;
    .pay_finish{
        .icon_{
            height:60px;
            width:60px;
            background:#65B1FF;
            line-height:60px;
            font-size: 50px;
            border-radius: 50%;
            color: #fff;
            text-align: center
        }
    }
    
}
</style>

