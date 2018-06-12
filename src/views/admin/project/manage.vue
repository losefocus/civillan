<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button @click="toProjectIndex" size="small" >返回</el-button>
            <el-radio-group v-model="tabView" size="small" style="margin-bottom: 30px;" class="pull-right">
                <el-radio-button label="info">基本信息</el-radio-button>
                <el-radio-button label="org">机构设置</el-radio-button>
                <el-radio-button label="per">人员管理</el-radio-button>
                <el-radio-button label="equ">设备管理</el-radio-button>
                <el-radio-button label="doc">文档资料</el-radio-button>
            </el-radio-group>
        </div>
        <div>
            <info v-if="tabView === 'info'"></info>
            <org v-if="tabView === 'org'"></org>
            <per v-if="tabView === 'per'"></per>
            <equ v-if="tabView === 'equ'"></equ>
            <doc v-if="tabView === 'doc'"></doc>
        </div>
    </div>
</template>
<script>
import info from "./manageView/info";
import org from "./manageView/org";
import per from "./manageView/per";
import equ from "./manageView/equ";
import doc from "./manageView/doc";
export default {
    components:{
        info,
        org,
        per,
        equ,
        doc,
    },
    data(){
        return {
            tabView:'info'
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
