<template>
    <div class="notify">
        <div class="tit">警报</div>
        <div class="content"><span class="data_">300</span>/<span>120</span>条</div>
        <div class="item">
            <div class="clearfix item_t">
                <div class="pull-left item_fl"><i class="icon_ iconfont icon-shouji"></i>SMS</div>
                <div class="pull-right num">30</div>
            </div>
            <div>
                <el-progress :percentage="30" color="#fff"></el-progress>
            </div>
        </div>
        <div class="item">
            <div class="clearfix item_t">
                <div class="pull-left item_fl"><i class="icon_ iconfont icon-youjian"></i>E-MAIL</div>
                <div class="pull-right num">50</div>
            </div>
            <div>
                <el-progress :percentage="50" color="#fff"></el-progress>
            </div>
        </div>
        <div class="item">
            <div class="clearfix item_t">
                <div class="pull-left item_fl"><i class="icon_ iconfont icon-weixin"></i>微信</div>
                <div class="pull-right num">80</div>
            </div>
            <div>
                <el-progress :percentage="80" color="#fff"></el-progress>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        resizeChart(){
            this.myChart.resize()
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(document.getElementById('chart_a'))
            // 绘制图表
            this.myChart.setOption(this.options);
        }
    },
}
</script>
<style scoped="scoped" lang="scss">

.notify{
    width: 100%;
    height: 100%;
    color: #fff;
    background: #03A9F4;
    .tit{
        line-height: 22px;
        padding: 20px 0 0 20px;
        font-weight: bold;
    }
    .content{
        text-align: right;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        padding-right:20px;
        padding-bottom:50px;
        .data_{
            font-size: 34px;
        }
    }
    .item{
        padding:25px;
        .item_t{
            height: 30px;
            line-height: 30px;
            .item_fl{
                font-size: 14px;
            }
            .icon_{
                padding-right:10px;
                font-size: 20px;
            }
            .num{
                padding-right:50px;
                font-size: 20px;
            }
        }
        
    }
}
</style>
