<template>
    <div style="height:100%;">
        <el-button @click="toProjectIndex" size="small">返回</el-button>
        <div id="container" style="height:100%;"></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            
        }
    },
    created() {},
    mounted() {
        this.initMap()
    },
    computed: {},
    methods:{
        toProjectIndex(){
            this.$parent.showView = 'index'
        },
        initMap(){
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom:11,
                center: [116.397428, 39.90923]
            });
        }
    }
}
</script>
<style scoped>

</style>
