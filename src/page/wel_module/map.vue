<template>
    <div class="map_c">
        <div id="projectContainer" style="height:320px;width:100%"></div>
        <div class="zoomControl">
            <i class="zoomIn el-icon-plus" @click="zoomIn"></i>
            <i class="zoomOut el-icon-minus" @click="zoomOut"></i>
        </div>
    </div>
</template>
<script>
  import { fetchList} from "@/api/project";

export default {
    props:['dataInfo'],
    data(){
        return {
            mapHeight:{height:'500px'},
            map:null,
            markersArry:[]
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
            this.map = new AMap.Map('projectContainer', {
                resizeEnable: false,
                zoom:1,
                center: [120.007321,30.263739]
            });
            this.map.clearMap();  // 清除地图覆盖物
            // this.map.getUiSettings().setZoomControlsEnabled(true);
            let markers = []
            let map_ = this.map
            let this_ = this
            fetchList(this.listQuery).then(response => {
                let datas = response.data.result.items;
                datas.forEach(data => {
                    let item = {
                        position:[data.position.split(',')[0],data.position.split(',')[1]],
                        title:data.name,
                        beginAt:data.beginAt,
                        endAt:data.endAt,
                        adminer:data.adminer,
                        data:data
                    }
                    let position = [data.position.split(',')[0],data.position.split(',')[1]]
                    markers.push(item)
                })
                markers.forEach((item,index) => {
                    let marker = new AMap.Marker({
                        map: this.map,
                        // icon: item.icon,
                        position: [item.position[0], item.position[1]],
                        offset: new AMap.Pixel(-12, -36),
                        title:item.title,
                        label:{
                            content: `<div style="width:300px;text-align: center"><span style="background:#fff;padding:5px 8px;box-shadow: 2px 2px 5px #888888;border-radius:2px">${item.title}</span></div>`,
                            offset:new AMap.Pixel(-140, -25)
                        },
                        data:item.data
                    });
                    this.markersArry.push(marker)
                    // marker.setLabel({
                    //     //修改label相对于maker的位置
                    //     offset: new AMap.Pixel(-140, -20),
                    //     content: `<div style="width:300px;text-align: center"><span style="background:#fff;padding:3px;">${item.title}</span></div>`
                    // });

                    marker.on('click', markerClick);
                    // marker.emit('click', {target: marker});
                });
                
                function markerClick(e) {
                    this_.toProject(e.target.F.data)
                }
                this.map.setFitView();

            });
            
        },
        zoomIn(){
            this.map.zoomIn()
        },
        zoomOut(){
            this.map.zoomOut()
        },
        toProject(data){
            this.$store.commit("SET_PROJECTSTATE",{data:data});
            this.$router.push({ path:'/admin/project'});
        }
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
