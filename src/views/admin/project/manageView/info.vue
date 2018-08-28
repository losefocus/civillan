<template>
    <div class="deviceInfo clearfix" v-loading="loading">
        <div class="pull-left info_" >
            <div class="image">
                <img v-if="info.thumbnailPath&&info.thumbnailUrl!=''&&info.thumbnailPath!=''" :src="info.thumbnailUrl+info.thumbnailPath">
                <img v-else style="width:100%;height:100%" src="../../../../assets/img/no_pic.png">
                <div class="tm">{{info.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{info.endAt | parseTime('{y}-{m}-{d}')}}</div>
            </div>
            <div class="parcent_ clearfix">
                <span class="pull-left">项目进度</span>
                <div class="pull-left progress_"><el-progress :percentage="percentage"></el-progress></div>
            </div>
            <ul class="organList">
                <li></li>
            </ul>
            <el-table :data="organList" style="width: 100%;border: 1px solid #EBEDF8;border-bottom:none;border-radius: 4px;" height="176">
                <el-table-column align="left" label="联络人" width="70">
                    <template slot-scope="scope">
                        <span style="white-space:nowrap;">{{scope.row.contact}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="电话" width="120">
                    <template slot-scope="scope">
                        <span style="white-space:nowrap;">{{scope.row.phone}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="类型" width="80">
                    <template slot-scope="scope">
                        <span style="white-space:nowrap;">{{scope.row.organName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="机构名称" >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start" :open-delay="300">
                            <span style="white-space:nowrap;">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text">
                <p class="text_tit">项目介绍</p>
                <p v-if="info.comment == ''" style="text-align: center;font-size:16px">暂无介绍</p>
                <p class="comment">{{info.comment}}</p>
            </div>
        </div>
        <div class="pull-right charts_">
            <ul class="stats">
                <li class="bule">
                    <i class="stats_icon iconfont icon-ai-tool"></i>
                    <span class="stats_name">设备</span>
                    <span class="stats_value">{{deviceTotal}}</span>
                </li>
                <li class="yellow">
                    <i class="stats_icon iconfont icon-fl-renyuan"></i>
                    <span class="stats_name">人员</span>
                    <span class="stats_value">{{userTotal}}</span>
                </li>
                <li class="green">
                    <i class="stats_icon iconfont icon-shipintianchong"></i>
                    <span class="stats_name">影像</span>
                    <span class="stats_value">{{mediaTotal}}</span>
                </li>
                <li class="deepBule">
                    <i class="stats_icon iconfont icon-969caidan_wendangzhongxin"></i>
                    <span class="stats_name">文档</span>
                    <span class="stats_value">{{documentTotal}}</span>
                </li>
            </ul>
            <div class="analysis">
                <div id="chart_statistics" class="pull-left " style="width:49%;height:100%"></div>
                <div id="chart_analysis" class="pull-right" style="width:49%;height:100%"></div>
            </div>
            <div class="progress">
                <div id="chart_progress" style="width:100%;height:100%"></div>
            </div>
        </div>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {deviceList, docList, getObj, mediaList, organList, userList} from "@/api/project_info";

  export default {
    data(){
        return{
            loading:true,
            info:{},
            percentage:0,
            listQuery: {
                projectId:this.projectInfo.id,
                page_index: 1,
                page_size: 9999
            },
            organList:[],
            deviceTotal:0,
            userTotal:0,
            mediaTotal:0,
            documentTotal:0,
            chart_statistics:null,
            chart_analysis:null,
            chart_progress:null,
            options_statistics:{
                title: {
                    text: '警报统计',
                    padding:20
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right:'20px',
                    top:'20px',
                    data:[
                        {
                            name:'软基处理',
                            icon:'circle'
                        },
                        {
                            name:'路基路面',
                            icon:'circle'
                        }
                    ]
                },
                grid: {
                    left: '4%',
                    right: '5%',
                    bottom: '20px',
                    top:'30%',
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
                    data: ['08-01','08-02','08-03','08-04','08-05','08-06'] 
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
                        name:'软基处理',
                        type:'line',
                        lineStyle:{
                            color:'#2C82BE'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#2C82BE',
                            borderColor:'#2C82BE'
                        },
                        areaStyle: {normal: {}},
                        data:[220, 112, 191, 234, 200, 330]
                    },
                    {
                        name:'路基路面',
                        type:'line',
                        lineStyle:{
                            color:'#76DDFB'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#76DDFB',
                            borderColor:'#76DDFB'
                        },
                        areaStyle: {normal: {}},
                        data:[120, 132, 301, 134, 110, 230]
                    },
                ]
            },
            options_analysis:{
                title: {
                    text: '作业统计',
                    padding:20
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right:'20px',
                    top:'20px',
                    data:[
                        {
                            name:'软基处理',
                            icon:'circle'
                        },
                        {
                            name:'路基路面',
                            icon:'circle'
                        }
                    ]
                },
                grid: {
                    left: '4%',
                    right: '5%',
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
                    data: ['08-01','08-02','08-03','08-04','08-05','08-06'] 
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
                        name:'软基处理',
                        type:'line',
                        lineStyle:{
                            color:'#2C82BE'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#2C82BE',
                            borderColor:'#2C82BE'
                        },
                        areaStyle: {normal: {}},
                        data:[120, 312, 291, 134, 200, 430]
                    },
                    {
                        name:'路基路面',
                        type:'line',
                        lineStyle:{
                            color:'#76DDFB'
                        },
                        showSymbol: false,
                        itemStyle:{
                            color:'#76DDFB',
                            borderColor:'#76DDFB'
                        },
                        areaStyle: {normal: {}},
                        data:[220, 332, 261, 534, 99, 130]
                    },
                ]
            },
            options_progress:{
                title: {
                    text: '施工进度',
                    padding:20
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    right:'20px',
                    top:'20px',
                    borderRadius: 2,

                    data:[
                        {
                            name:'进度',
                            icon:'circle'
                        },
                        
                    ]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisTick:false,
                    axisLine:{
                        lineStyle:{
                            width:0 
                        }
                    },
                    axisLabel: {
                        formatter: '{value}%',
                        textStyle: {
                            fontWeight: '80'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLine:{
                        lineStyle:{
                            width:0 
                        }
                    },
                    axisTick:false,
                    data: ['软基处理','工程桥梁','路基路面','拌合站']
                },
                series: [
                    {
                        name: '进度',
                        type: 'bar',
                        barWidth:'60%',
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 1, 0,
                                    [
                                        {offset: 0, color: '#53A8E2'},
                                        {offset: 1, color: '#76DDFB'}
                                    ]
                                )
                            },
                        },
                        data: [28, 53, 85, 66]
                    }
                ]
            },
        }
    },
    props:['projectInfo'],
    created() {
        
    },
    mounted() {
        this.getInfo();
        this.getDeviceList();
        this.getChart_statistics()
        this.getChart_analysis();
        this.getChart_progress();
        window.onresize = ()=>{
            this.resizeChart()
            var docWidth = document.body.clientWidth;
            if(docWidth <= 1400){
                this.$store.commit("SET_COLLAPSE_",true);
            }else{
                this.$store.commit("SET_COLLAPSE_",false);
            }
        }
    },
    computed: {
        ...mapGetters(["isCollapse"])
    },
    methods:{
        getInfo(){
            this.loading = true
            getObj(this.projectInfo.id).then(res => {
                this.info = res.data.result
                let nowTm = Math.round(new Date().getTime()/1000)
                this.percentage = (nowTm > this.info.endAt)?100:Math.round((nowTm - this.info.beginAt) / (this.info.endAt - this.info.beginAt) * 100)
                let OList = res.data.result.organTypeList
                OList.forEach(ele => {
                    ele.organList.forEach(elm => {
                        this.organList.push({organName:ele.name,contact:elm.contact,name:elm.name,phone:elm.phone,})
                    })
                });
                this.loading = false
            })
        },
        getDeviceList(){
            deviceList(this.listQuery).then(res => {
                this.deviceTotal = res.data.result.total
            })
            userList(this.listQuery).then(res => {
                this.userTotal = res.data.result.total
            })
            mediaList(this.listQuery).then(res => {
                this.mediaTotal = res.data.result.total
            })
            docList(this.listQuery).then(res => {
                this.documentTotal = res.data.result.total
            })
        },
        getChart_statistics(){
            this.chart_statistics = this.$echarts.init(document.getElementById('chart_statistics'))
            this.chart_statistics.setOption(this.options_statistics);
        },
        getChart_analysis(){
            this.chart_analysis = this.$echarts.init(document.getElementById('chart_analysis'))
            this.chart_analysis.setOption(this.options_analysis);
        },
        getChart_progress(){
            this.chart_progress = this.$echarts.init(document.getElementById('chart_progress'))
            this.chart_progress.setOption(this.options_progress);
        },
        resizeChart(){
            this.chart_statistics.resize();
            this.chart_analysis.resize();
            this.chart_progress.resize();
        }
    },
    watch:{
        isCollapse(oldVal,val){
            setTimeout(this.resizeChart,500)
        }
    }
}
</script>
<style scoped lang="scss">
.deviceInfo{
    height: 700px;
    width: 100%
}
.info_{
    width: 435px;
    height: 700px;
    box-sizing: border-box;    
    .image{
        width: 100%;
        height: 170px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
        .tm{
            position: absolute;
            left: 0;
            bottom: 0;
            text-align: center;
            width: 100%;
            height: 35px;
            line-height: 35px;
            color: #fff;
            background: rgba(0, 0, 0, 0.35);
            font-size: 14px;
        }
    }
    .parcent_{
        height: 57px;
        line-height: 57px;
        font-size: 14px;
        padding-left:20px;
        .progress_{
            width: calc(100% - 100px);
            padding: 20px 0 0 20px
        }
    }
    .text{
        height: 278px;
        border-radius: 4px;
        border: 1px solid #EBEDF8;
        margin-top: 17px;
        padding: 0 25px;
        font-size: 12px;
        color: #999;
        line-height: 24px;
        .text_tit{
            font-size: 20px;
            color:#333;
            padding: 20px 0;
            font-weight: bold;
        }
        .comment{
            height: 214px;
            overflow-y: auto;
        }
    } 
}
.charts_{
    width: calc(100% - 455px);
    border-radius: 4px;
    .stats{
        display: flex;
        flex-wrap:wrap ;
        justify-content: space-between;
        padding-bottom: 17px;
        li{
            width: 23%;
            height: 106px;
            text-align: center;
            border-radius: 4px;
            color:#fff;
            display: flex;
            flex-wrap:wrap ;
            justify-content: center;
            align-items:center ;
            .stats_icon{
                font-size: 30px;
                line-height: 30px;
            }
            .stats_name{
                font-size: 16px;
                padding: 0 10px;
            }
            .stats_value{
                font-size: 30px;
                padding: 0 10px;
            }
        }
        .bule{
            background: #03A9F4;
        }
        .yellow{
            background: #FFB302;
        }
        .green{
            background: #8AC44A;
        }
        .deepBule{
            background: #53A8E2;
        }
    }
    .analysis{
        width: 100%;
        border-radius: 4px;
        height: 280px;
        border: 1px solid #EBEDF8;
        box-sizing: border-box;
        margin-bottom: 17px;

    }
    .progress{
        width: 100%;
        border-radius: 4px;
        height: 280px;
        border: 1px solid #EBEDF8;
        box-sizing: border-box;
    }
}
@media screen and (max-width: 1600px){
    .stats_name{
        display: none
    }
}
@media screen and (max-width: 1280px){
    .stats_icon{
        width: 100%;
        padding-top: 10px;
    }
}
</style>
