<template>
    <div class=" clearfix projectManage" >
        <div class="pull-left containers">
            <div class="filter-container">
            <el-button @click="toProjectIndex" size="small" >返回</el-button>
            <span>项目名称: {{viewData.name}}</span>
            <el-radio-group v-model="tabView" size="small" style="margin-bottom: 30px;" class="pull-right">
                <el-radio-button label="org">机构设置</el-radio-button>
                <el-radio-button label="per">人员管理</el-radio-button>
                <el-radio-button label="equ">设备管理</el-radio-button>
                <el-radio-button label="doc">文档资料</el-radio-button>
            </el-radio-group>
            </div>
            <div style="padding-top:20px; ">
                <org v-if="tabView === 'org'" :project-info="viewData" ref="org"></org>
                <per v-if="tabView === 'per'" :project-info="viewData" ref="per"></per>
                <equ v-if="tabView === 'equ'" :project-info="viewData" ref="equ"></equ>
                <doc v-if="tabView === 'doc'" :project-info="viewData" ref="doc"></doc>
            </div>
        </div>
        <div class="pull-right addNewContainer" v-if="tabView != 'info'">
            <add-org v-if="tabView === 'org'" :project-info="viewData" ref="addOrg"></add-org>
            <add-per v-if="tabView === 'per'" :project-info="viewData" ref="addPer"></add-per>
            <add-equ v-if="tabView === 'equ'" :project-info="viewData" ref="addEqu"></add-equ>
            <add-doc v-if="tabView === 'doc'" :project-info="viewData" ref="addDoc"></add-doc>
        </div>
    </div>
</template>
<script>
import org from "./manageView/org";
import per from "./manageView/per";
import equ from "./manageView/equ";
import doc from "./manageView/doc";
import addOrg from "./manageView/addOrg";
import addPer from "./manageView/addPer";
import addEqu from "./manageView/addEqu";
import addDoc from "./manageView/addDoc";

export default {
    components:{
        org,
        per,
        equ,
        doc,
        addOrg,
        addPer,
        addEqu,
        addDoc
    },
    props:['viewData'],
    data(){
        return {
            tabView:'org'
        }
    },
    created() {
    },
    mounted() {

    },
    computed: {
        
    },
    methods:{
        toProjectIndex(){
            this.$parent.showView = 'index'
            this.tabView = null
        },
    },
    watch:{
        
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
.containers{
    width: calc(100% - 320px)
}
.addNewContainer{
    width: 260px;
    border: 1px solid #ebeef5;
    padding: 10px 20px 0 20px
}

</style>
