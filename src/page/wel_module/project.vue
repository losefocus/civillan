<template>
    <div class="wel_project">
        <div class="tit">项目</div>
        <div class="clearfix">
            <div class="p_l pull-left">
                <p>总数量</p>
                <span>300</span>
            </div>
            <div class="p_r  pull-right">
                <p><i class="icon_ iconfont icon-peizhihechajieguobaobiao"></i>进行中<span class="data_">200</span></p>
                <p><i class="icon_ iconfont icon-shijian"></i>已结束<span class="data_">98</span></p>
                <p><i class="icon_ iconfont icon-yichang"></i>异&nbsp;&nbsp;&nbsp;&nbsp;常<span class="data_">2</span></p>
            </div>
        </div>
        <div class="charts" style="width:100%">
            <div id="myChart" :style="chartStyle"></div>
        </div>
    </div>
</template>
<script>
import {mapGetters } from "vuex";
export default {
    data(){
        return{
            myChart:null,
            chartStyle:{
                width:'100%',
                height:'175px'
            },
            options:{
                color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
                tooltip: {},
                grid: {
                    left: 'left',
                    right: '10px',
                    top:'20px',
                    bottom: '20px',
                    containLabel: true
                },
                xAxis: {
                    axisTick:false,
                    axisLine:{
                        lineStyle:{
                            width:0 
                        }
                    },
                    data: ["机构","人员","文档","影像","监控"]
                },
                yAxis: {
                    show:false,
                    splitLine:{show: false},//去除网格线
                    type : 'value',
                    splitArea : {show : false}//保留网格区域
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    barWidth:'50%',
                    data: [{itemStyle:{color:'#76DDFB'},value:5},
                    {itemStyle:{color:'#53A8E2'},value:20},
                    {itemStyle:{color:'#2C82BE'},value:36},
                    {itemStyle:{color:'#53A8E2'},value:10},
                    {itemStyle:{color:'#76DDFB'},value:8}]
                }]
            }
        }
    },
    created(){ 
    },
    mounted(){
        this.drawLine();
    },
    computed: {
        ...mapGetters(["isCollapse"])
    },
    methods: {
        resizeChart(){
            this.myChart.resize()
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            this.myChart.setOption(this.options);
        }
    },
    watch:{}
}
</script>
<style scoped="scoped" lang="scss">
    .tit{
        padding: 20px;
        font-size:16px;
        font-family:PingFangSC-Medium;
        color:#333;
        line-height:22px;
        font-weight: bold;
    }
    .p_l{
        width: 45%;
        padding-left:15%;
        box-sizing: border-box;
        height: 88px;
        position: relative;
        p{
            color: #666;
            font-size:14px;
            line-height:20px;
            margin-top:10px;
        }
        span{
            color: #03A9F4;
            line-height:59px;
            font-size:42px;
        }

    }
    .p_l::after{
        content: "";
        width: 2px;
        height: 88px;
        background-color: #E8E8E8;
        position: absolute;
        top: 0;
        right: 0;
    }
    .p_r{
        height: 88px;
        width: 55%;
        // padding-left:10%;
        box-sizing: border-box;
        color: #666;
        display: flex;
        flex-wrap:wrap ;
        align-content:space-between;
        justify-content:center;
        p{
            width: 140px;
            line-height: 20px;
            margin: auto;
            text-align: left;
            font-size: 14px;
            .icon_{
                padding-right:10px;
                font-size: 16px;
            }
            span{
                padding-left: 20px;
            }
            .data_{
                font-weight: bold;
                font-size: 18px;
                color: #333
            }
        }
    }
    .chart{
        width: 100%;
    }
</style>
