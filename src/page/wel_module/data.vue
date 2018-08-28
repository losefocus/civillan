<template>
    <div class="dataChart clearfix">
        <div class="tit">数据</div>
        <div class="content"><span class="data_">300</span>/<span>120</span>GB</div>
        <div class="charts" style="width:100%">
            <div id="chart_d" :style="chartStyle"></div>
        </div>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    data(){
        return{
            myChart:null,
            chartStyle:{
                width:'100%',
                height:'136px'
            },
            options:{
                color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae'],
                tooltip: {},
                grid: {
                    left: 'left',
                    right: '10px',
                    top:'20px',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: {
                    show:false,
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
                    name: '销量',
                    type: 'line',
                    lineStyle:{
                        color:'#fff'
                    },
                    showSymbol: false,
                    data: [5,15,36,10,8]
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
            this.myChart = this.$echarts.init(document.getElementById('chart_d'))
            // 绘制图表
            this.myChart.setOption(this.options);
        }
    },
    watch:{}
}
</script>
<style scoped="scoped" lang="scss">
.dataChart{
    width: 100%;
    height: 100%;
    background: #8AC44A;
    color: #fff;
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
    }
    .data_{
        font-size: 34px;
    }
    .chart{
        width: 100%;
    }
}
</style>
