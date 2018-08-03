<template>
    <div class=" clearfix projectManage" >
        <div class="pull-left containers">
            <div class="filter-container">
            <el-button @click="toProjectIndex" size="small" >返回项目列表</el-button>
            <span style="margin-left:20px">项目名称: {{viewData.name}}</span>
            <el-radio-group v-model="tabView" size="small" style="margin-bottom: 30px;" class="pull-right">
                <el-radio-button label="info" :disabled="viewData.children.length != 0">项目详情</el-radio-button>
                <el-radio-button label="org">机构设置</el-radio-button>
                <el-radio-button label="per">人员管理</el-radio-button>
                <el-radio-button label="equ" :disabled="viewData.children.length != 0">设备管理</el-radio-button>
                <el-radio-button label="doc">文档资料</el-radio-button>
            </el-radio-group>
            </div>
            <div style="padding-top:20px;position:relative">
                <info v-if="tabView === 'info'" :project-info="viewData" ref="info" style="width:100%;"></info>
                <org v-if="tabView === 'org'" :project-info="viewData" ref="org"></org>
                <per v-if="tabView === 'per'" :project-info="viewData" ref="per"></per>
                <equ v-if="tabView === 'equ'" :project-info="viewData" ref="equ"></equ>
                <doc v-if="tabView === 'doc'" :project-info="viewData" ref="doc"></doc>
            </div>
        </div>
        <el-card class="pull-right addNewContainer" :style="cardHeight" :class="{'show':cardVisibel}" >
            <i class="closeBtn el-icon-close" @click="cardVisibel = false"></i>
            <add-org v-if="tabView === 'org'" :project-info="viewData" ref="addOrg"></add-org>
            <add-per v-if="tabView === 'per'" :project-info="viewData" ref="addPer"></add-per>
            <add-equ v-if="tabView === 'equ'" :project-info="viewData" ref="addEqu"></add-equ>
            <add-doc v-if="tabView === 'doc'" :project-info="viewData" ref="addDoc"></add-doc>
        </el-card>
    </div>
</template>
<script>
import info from "./manageView/info";
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
        info,
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
            tabView:'info',
            cardHeight:{'height':null},
            cardVisibel:false,
        }
    },
    created() {
        this.getCardHeight()
    },
    mounted() {

    },
    computed: {
        
    },
    methods:{
        getCardHeight(){
            this.cardHeight.height = document.body.clientHeight - 107  - 30 + 'px'
        },
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
    width: 100%
}
</style>
<style>
.projectManage{
    position: relative;
}
.addNewContainer{
    background: #fff;
    width: 300px;
    padding-top: 0 ;
    position: absolute;
    min-height: 730px;
    top: -16px;
    right: -335px;
    /* right: -28px; */
    z-index: 9
}
.addNewContainer.show{
    right: -28px;
}
.addNewContainer .tit{
    margin-top:-20px;
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    position: relative;
    margin-bottom: 20px;
}
.addNewContainer h3{
    float: left;
    line-height: 60px;
    padding-left:20px;
    font-weight: bold;
}
.addNewContainer .tit::before{
    display: block;
    content: '';
    width: 4px;
    background: #30a487;
    height:20px;
    position: absolute;
    left: 0;
    top: 20px;
}
.addNewContainer .tit span{
    line-height: 70px;
    color: #cacaca;
    font-size: 12px;
    padding-left: 20px;
    letter-spacing: 1px;
}
.closeBtn{
    position: absolute;
    right: 20px;
    top:0;
    z-index: 9;
    cursor: pointer;
    float: right;
    margin-top: 22px;
    color: #6b6b6b;
    transition: transform .3s ease-out 0s,-webkit-transform .3s ease-out 0s;
}
.closeBtn:hover{
    transform: rotate(180deg)
}
</style>

