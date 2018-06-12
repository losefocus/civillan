<template>
    <div>
        <el-button @click="toProjectIndex" size="small">返回</el-button>
        map
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

    },
    computed: {},
    methods:{
        toProjectIndex(){
            this.$parent.showView = 'index'
        },
    }
}
</script>
<style scoped>

</style>
