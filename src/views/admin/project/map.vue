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
                zoom:11,
                center: [120, 29]
            });
        }
    }
}
</script>
<style scoped>

</style>
