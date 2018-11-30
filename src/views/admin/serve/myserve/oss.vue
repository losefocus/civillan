<template>
    <div class="app-container">
        <div style="height:500px;padding:10px" v-loading="loading">
            <div class="pull-left c_l">
                <div class="tit">{{item.name}}</div>
                <div class="text">{{item.intro}}</div>
                <div class="cont clearfix">
                    <div class="pull-left cont_l">
                        <p>购买</p>
                        <p>数量</p>
                    </div>
                    <div class="pull-left cont_r">
                        <div class="clearfix" style="height:40px;line-height:40px;margin-top:20px">
                            <span class="pull-left" style="color:#666666;margin-right:25px">扩充大小</span>
                            <div class="block pull-left" style="width:450px">
                                <el-slider
                                v-model="amount"
                                show-input>
                                </el-slider>
                            </div>
                        </div>
                        <span style="color:#F15F5F;margin-left:80px">剩余短信量：{{surplus || 0}} {{item.unit}}</span>
                        <div>
                            <el-input style="width:120px;margin-left:80px;margin-top:20px" v-model="term" size="small" type="number" min="0" @change="changeNum"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pull-right c_r">
                <div class="tit">当前配置</div>
                <ul>
                    <li class="clearfix"><span>服务类型：</span><p>{{item.name}}</p></li>
                    <li class="clearfix"><span>扩充大小：</span><p>{{amount}} {{item.unit}}</p></li>
                    <li class="clearfix"><span>购买有效期：</span><p>{{term}} 年</p></li>
                </ul>
                <div class="clearfix">
                    <div class="pull-right originalCost" style="color:#999999;padding-top:10px;line-height:28px;">
                        <span style="font-size:12px;">原价：</span><span style="font-size:18px;text-decoration:line-through;">￥{{(item.price*amount).toFixed(2)}}</span>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="pull-right" style="color:#999999;height:40px;line-height:40px;">
                        <span style="font-size:12px">折后价：</span><span style="font-size:32px;color:#F15F5F">￥{{item.discount==0?(item.price*amount).toFixed(2):(item.price*amount*item.discount).toFixed(2)}}</span>
                    </div>
                </div>
                <el-button style="width:100%;margin-top:30px;" type="primary" @click="toPay" :disabled="term<1 || amount<1">立即购买</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getObj} from "@/api/serve/myserve";

export default {
    data(){
        return {
            loading:false,
            amount:0,
            term:0,
            item:{
                name:'',
                intro:'',
                price:0,
                discount:0
            },
            surplus_:0,
            surplus:0,

        }
    },
    created(){
        this.getInfo()
    },
    methods:{
        getInfo(){
            this.loading = true
            let id = this.$route.query.id
            getObj(id).then(res => {
                this.item = res.data.result.orderServe
                this.surplus = res.data.result.surplus
                // this.surplus_ = res.data.result.surplus
                this.loading = false
            })
        },
        changeNum(){
            // this.surplus = parseInt(this.surplus_)+parseInt(this.amount)
        },
        toPay(){
            console.log(this.item)
            let data = Object.assign({amount:this.amount},this.item)
            this.$router.push({path:'/serve/myserve/pay',query:data})
        }
    }
}
</script>



<style lang="scss" scoped>

.c_l{
    width: calc(100% - 330px);
    .tit{
        height:24px;
        font-size:20px;
        font-weight:600;
        color:#333333;
        line-height:24px;
        padding-top: 10px;
    }
    .text{
        max-width:900px;
        font-size:12px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:21px;
        padding: 20px 0 40px;
    }
    .cont{
        height:170px;
        background:rgba(250,250,250,1);
        .cont_l{
            height: 100%;
            padding:60px 10px;
            background: #F2F2F2;
            box-sizing: border-box;
            width: 50px;
            float: left;
            color: #666666;
            font-size:14px;
            line-height:24px;
            font-weight:500;
            margin-right:70px;
        }
        .cont_r{
            width: calc(100% - 120px );
            
            font-size:14px;
        }
    }
}
.c_r{
    width:300px;
    height:350px;
    background: #FAFAFA;
    padding: 0 30px;
    box-sizing: border-box;
    .tit{
        height:60px;
        font-size:18px;
        font-weight:600;
        color:#333333;
        line-height:60px;
        border-bottom:1px solid rgba(151,151,151,0.2);
        margin-bottom: 15px;
    }
    li{
        width: 100%;
        line-height: 28px;
        font-size: 12px;
        span{
            color:rgba(153,153,153,1);
            width: 72px;
            float: left;
        }
        p{
            color: #666666;
            float: left;
        }
    }

}
</style>

