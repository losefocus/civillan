<template>
    <div>
        <div id="container" style="height:500px"></div>
        <input id="pickerInput" placeholder="位置搜索..." />
    </div>
</template>
<script>
export default {
    data(){
        return {
            lnglat:''
        }
    },
    created() {

    },
    mounted() {
        this.initMap()
    },
    computed: {},
    methods:{
        initMap(){
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 10
            });
            var marker = new AMap.Marker({
                cursor: 'move',
                animation: true,
            });
            // this.$parent.$parent.form.position = map.getCenter().getLng()+','+map.getCenter().getLat()
            var clickEventListener = map.on('click', e => {
                this.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
                marker.setMap(map);
                marker.setAnimation('AMAP_ANIMATION_DROP')
                marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()])
                this.$parent.$parent.form.position = this.lnglat
                setTimeout(()=>{
                    this.$parent.$parent.positionVisible = false
                },800)
            });
            //搜索
            AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
                var poiPicker = new PoiPicker({
                    input: 'pickerInput',
                    placeSearchOptions: {
                        map: map,
                        pageSize: 10
                    },
                });
                poiPicker.on('poiPicked', function(poiResult) {
                    poiPicker.hideSearchResults();
                    var source = poiResult.source,
                        poi = poiResult.item;
                    if (source !== 'search') {
                        poiPicker.searchByKeyword(poi.name);
                    } else {
                    }
                });
            });
        }
    }
}
</script>
<style scoped>
    #pickerInput {
        position: absolute;
        z-index: 9999;
        top: 20px;
        left: 20px;
        width: 200px;
        padding: 5px 5px;
    }
    
    #poiInfo {
        background: #fff;
    }
    
    .amap_lib_placeSearch .poibox.highlight {
        background-color: #CAE1FF;
    }
    
    .amap_lib_placeSearch .poi-more {
        display: none!important;
    }
</style>
