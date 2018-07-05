<template>
    <div>
        <el-button @click="toProjectIndex" size="small">返回</el-button>
        <div id="container" :style="mapHeight" style="margin-top:10px"></div>
    </div>
</template>
<script>
export default {
    props:['stationData'],
    data(){
        return {
            mapHeight:{height:'100px'}
        }
    },
    created() {},
    mounted() {
        this.initMap()
        this.getMapHeight()
    },
    computed: {},
    methods:{
        getMapHeight(){
            this.mapHeight.height = document.body.clientHeight - 107 - 100 - 45 + 'px'
        },
        toProjectIndex(){
            this.$parent.showView = 'index'
        },
        initMap(){
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom:13,
                center: [120.007321,30.263739]
            });
            map.clearMap();  // 清除地图覆盖物

            var markers = [],
                positions=[]
            this.stationData.forEach(function(data) {
                let marker = {position:[data.position.split(',')[0],data.position.split(',')[1]],title:data.name}
                let position = [data.position.split(',')[0],data.position.split(',')[1]]
                markers.push(marker)
                positions.push(position)
            })
            
            markers.forEach(function(marker) {
                new AMap.Marker({
                    map: map,
                    icon: marker.icon,
                    position: [marker.position[0], marker.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    title:marker.title
                });
            });
            

            var polygon = new AMap.Polygon({
                path : positions,  //以点的坐标创建一个隐藏的多边形
                map:map,
                strokeOpacity:0,//透明
                fillOpacity:0,//透明
                bubble:true//事件穿透到地图
            });
            var overlaysList = map.getAllOverlays('polygon');//获取多边形图层
            map.setFitView(overlaysList);
        }
    }
}
</script>
<style scoped>

</style>
