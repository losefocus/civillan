<template>
    <div class="map_c">
        <div id="container" style="height:320px;width:100%"></div>
        <div class="zoomControl">
            <i class="zoomIn el-icon-plus" @click="zoomIn"></i>
            <i class="zoomOut el-icon-minus" @click="zoomOut"></i>
        </div>
    </div>
</template>
<script>
export default {
    props:['dataInfo'],
    data(){
        return {
            mapHeight:{height:'500px'},
            map:null
        }
    },
    created() {},
    mounted() {
        this.getMapHeight()
        this.initMap()
    },
    computed: {},
    methods:{
        getMapHeight(){
            this.mapHeight.height = document.body.clientHeight - 107 - 100 - 45 + 'px'
        },
        initMap(){
            this.map = new AMap.Map('container', {
                resizeEnable: false,
                zoom:9,
                center: [120.007321,30.263739]
            });
            this.map.clearMap();  // 清除地图覆盖物
            this.map.getUiSettings().setZoomControlsEnabled(true);
            var markers = []
            this.stationData.forEach(function(data) {
                let item = {
                    position:[data.position.split(',')[0],data.position.split(',')[1]],
                    title:data.name,
                    beginAt:data.beginAt,
                    endAt:data.endAt,
                    adminer:data.adminer,
                }
                let position = [data.position.split(',')[0],data.position.split(',')[1]]
                markers.push(item)
            })

            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            markers.forEach(function(item,index) {
                let marker = new AMap.Marker({
                    map: this.map,
                    // icon: item.icon,
                    position: [item.position[0], item.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    title:item.title
                });
                marker.content = `<div class="info-title">项目名称：${item.title}</div>
                <div class="info-title">开始时间：${item.beginAt}</div>
                <div class="info-title">结束时间：${item.endAt}</div>
                <div class="info-title">管理员：${item.adminer}</div>
                <div class="info-content">当前坐标：${item.position[0]}, ${item.position[1]}</div>`;
                marker.on('click', markerClick);
                // marker.emit('click', {target: marker});
            });
            
            function markerClick(e) {
                infoWindow.setContent(e.target.content);
                infoWindow.open(this.map, e.target.getPosition());
                this.map.setZoomAndCenter(14, e.target.getPosition());
            }
            this.map.setFitView();
        },
        zoomIn(){
            this.map.zoomIn()
        },
        zoomOut(){
            this.map.zoomOut()
        },
    }
}
</script>
<style scoped="scoped" lang="scss">
.map_c{
    position: relative;
    .zoomControl{
        position: absolute;
        right:20px;
        bottom:20px;
        box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.3);
        border-radius: 2px;
        overflow: hidden;
        .zoomIn,.zoomOut{
            display: block;
            width: 20px;
            height: 20px;
            background: #fff;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            position: relative;
            cursor: pointer;
        }
        .zoomOut::after{
            content: "";
            width: 16px;
            height: 1px;
            background: #E6E6E6;
            position: absolute;
            top: 0;
            left: 2px;
        }
    }
}
</style>
