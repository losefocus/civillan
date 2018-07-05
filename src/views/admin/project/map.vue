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
            mapHeight:{height:'500px'}
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

            var markers = []
            this.stationData.forEach(function(data) {
                let item = {position:[data.position.split(',')[0],data.position.split(',')[1]],title:data.name}
                let position = [data.position.split(',')[0],data.position.split(',')[1]]
                markers.push(item)
            })
            
            markers.forEach(function(item,index) {
                let marker = new AMap.Marker({
                    map: map,
                    // icon: item.icon,
                    position: [item.position[0], item.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    title:item.title
                });
                marker.content = '我是第' + (index + 1) + '个Marker';
                marker.on('click', markerClick);
                marker.emit('click', {target: marker});
            });
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            function markerClick(e) {
                console.log(e)
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }
            map.setFitView();
        }
    }
}
</script>
<style scoped>

</style>
