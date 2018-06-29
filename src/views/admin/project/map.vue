<template>
    <div>
        <el-button @click="toProjectIndex" size="small">返回</el-button>
        <div id="container" :style="mapHeight" style="margin-top:10px"></div>
    </div>
</template>
<script>
export default {
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
                zoom:15,
                center: [120.007321,30.263739]
            });
            
            map.clearMap();  // 清除地图覆盖物
            var markers = [{
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png',
                position: [120.007321,30.263739]
            }, {
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png',
                position: [120.097272,30.28983]
            }, {
                icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b3.png',
                position: [120.182416,30.411893]
            }];

            markers.forEach(function(marker) {
                new AMap.Marker({
                    map: map,
                    icon: marker.icon,
                    position: [marker.position[0], marker.position[1]],
                    offset: new AMap.Pixel(-12, -36)
                });
            });

            map.setFitView();
        }
    }
}
</script>
<style scoped>

</style>
