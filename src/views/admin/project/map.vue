<template>
    <div>
        <el-button @click="toProjectIndex" size="small" type="primary">项目列表</el-button>
        <div id="container" :style="mapHeight" style="margin-top:10px"></div>
    </div>
</template>
<script>
  import {parseTime} from "@/filters/index";

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
            this.mapHeight.height = document.body.clientHeight - 107 - 100 - 15 + 'px'
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
                if(data.position == '') return true
                let item = {
                    position:[data.position.split(',')[0],data.position.split(',')[1]],
                    title:data.name,
                    beginAt:parseTime(data.beginAt,'{y}-{m}-{d}'),
                    endAt:parseTime(data.endAt,'{y}-{m}-{d}'),
                    adminer:data.adminer,
                    url:data.thumbnailUrl+data.thumbnailPath
                }
                let position = [data.position.split(',')[0],data.position.split(',')[1]]
                markers.push(item)
            })

            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
            markers.forEach(function(item,index) {
                let marker = new AMap.Marker({
                    map: map,
                    position: [item.position[0], item.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    title:item.title,
                });
                marker.content =`<div style="width:290px;height:200px;background:#fff;">
                    <div style="position:relative;width: 290px;height: 130px;background: url('${item.url}');background-size:100% 100%">
                        <div class="info-time">${item.beginAt}<span class="info-Interval"> 至 </span>${item.endAt}</div>
                    </div>
                    <div class="info-title" style="padding-left:15px;line-height:40px;height:40px;">${item.title}</div>
                    <ul class="info-group"><li>软基</li><li>路面</li><li>桥梁</li><li>试验室</li><li>拌和站</li></ul>
                    </div>`

                marker.on('click', markerClick);
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
<style scoped>

</style>
