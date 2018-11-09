<template>
    <div>
        <div class="s_top">
            <div class="s_title">账户总览</div>
            <div class="s_content">
                <div class="s_center">
                    <div style="color:rgba(153,153,153,1);line-height:24px;font-size:12px;">现金余额</div>
                    <div style="margin-left:-20px;height:40px;">￥<span style="display: inline-block;font-size:46px;font-weight:600;color:rgba(51,51,51,1);line-height:40px;">{{money}}</span></div>
                    <div style="padding-top:35px;">
                        <el-button type="primary" size="mini">充值</el-button>
                        <el-button type="warning" size="mini">提现</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="s_bot">
            <div class="s_title">推荐产品服务</div>
            <ul class="s_b_content">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            money:300
        }
    },
    computed: {
        
    },
    created() {

    },
    methods:{
       
    }
}
</script>
<style lang="scss" scoped>
    .s_title{
        height: 40px;
        line-height: 40px;
        background: #fbfbfb;
        border-bottom: 1px solid #E8E8E8;
        padding-left: 30px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
    }
    .s_top{
        border: 1px solid #E8E8E8;
        height: 250px;
        box-sizing: border-box;
        margin-bottom: 30px;
        .s_content{
            background: #fff;
            height: calc(100% - 40px);
            .s_center{
                margin:auto;
                width: 300px;
                text-align: center;
                padding-top: 40px;
            }
        }
    }
    .s_bot{
        border: 1px solid #E8E8E8;
        height: 280px;
        box-sizing: border-box;
        .s_b_content{
            background: #fff;
            height: calc(100% - 40px);
            display: flex;
            li{
                height: 168px;
                padding: 20px 25px;
                width: 23%;
                box-sizing: border-box;
                border: 1px solid #EBEDF8;
            }
        }
    }
</style>




