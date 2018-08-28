<template>
    <div class="dataChart_l clearfix">
        <div class="tit pull-left">数据</div>
        <div class="charts pull-right" style="width:calc(100% - 60px)">
            <div id="chart_l" :style="chartStyle"></div>
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
                height:'300px'
            },
            options:{
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right:'20px',
                    top:'20px',
                    data:[
                        {
                            name:'统计一',
                            icon:'circle'
                        },
                        {
                            name:'统计二',
                            icon:'circle'
                        }
                    ]
                },
                grid: {
                    left: '0%',
                    right: '4%',
                    bottom: '20px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick:false,
                    axisLine:{
                        lineStyle:{
                            width:0 
                        }
                    },
                    boundaryGap: false,
                    data: ['一','二','三','四','五','六']
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            width:0 
                        }
                    },
                    axisTick:false
                },
                series: [
                    {
                        name:'统计一',
                        type:'line',
                        lineStyle:{
                            color:'#2C82BE'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#2C82BE',
                            borderColor:'#2C82BE'
                        },
                        data:[220, 112, 191, 234, 200, 330]
                    },
                    {
                        name:'统计二',
                        type:'line',
                        lineStyle:{
                            color:'#76DDFB'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#76DDFB',
                            borderColor:'#76DDFB'
                        },
                        data:[120, 132, 301, 134, 110, 230]
                    },
                ]
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
            this.myChart = this.$echarts.init(document.getElementById('chart_l'))
            // 绘制图表
            this.myChart.setOption(this.options);
        }
    },
    watch:{}
}
</script>
<style scoped="scoped" lang="scss">
.dataChart_l{
    width: 100%;
    height: 100%;
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
        .data_{
            font-size: 34px;
        }
    }
    .chart{
        width: 100%;
    }
}
</style>
