<template>
    <div>
        <div id="container" style="height:320px;width:100%"></div>
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
        initMap(){
            var map = new AMap.Map('container', {
                resizeEnable: false,
                zoom:13,
                center: [120.007321,30.263739]
            });
            map.clearMap();  // 清除地图覆盖物
            map.getUiSettings().setZoomControlsEnabled(true);
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
                    map: map,
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
                infoWindow.open(map, e.target.getPosition());
                map.setZoomAndCenter(14, e.target.getPosition());
            }
            map.setFitView();
        }
    }
}
</script>
<style scoped="scoped" lang="scss">

</style>
