<template>
    <div class="app-container calendar-list-container" >
        <div v-show="showView === 'index'"  class="clearfix">
            <div class="pull-left"  style="width:calc(100% - 320px)">
                <div class="filter-container">
                    <!-- <el-button class="filter-item" style="" size="small" type="primary" icon="edit" v-if="roleProject_btn_add">添加项目
                    </el-button> -->
                    <el-button class="filter-item" style="" @click="toProjectMap"  size="small" type="primary" icon="edit" >项目地图
                    </el-button>
                    <div class="pull-right">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" suffix-icon="el-icon-search" class="filter-item" placeholder="项目搜索" v-model="listQuery.keyword">
                        </el-input>
                        <!-- <el-button class="filter-item" type="primary" v-waves icon="search" size="small" @click="handleFilter">搜索</el-button> -->
                    </div>
                </div>
            
                <div v-loading="listLoading" >
                    <el-table :data="list" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;margin-bottom:10px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" v-if="scope.row.children.length != 0" border ref="subTable" id="subTable">
                                    <el-table-column align="center" label="缩略图">
                                        <template slot-scope="pro">
                                            <img style="width:50px;height:50px" :src="pro.row.thumbnailUrl+pro.row.thumbnailPath" :alt="pro.row.name">
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="项目名称">
                                        <template slot-scope="pro">
                                            {{pro.row.name}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="开始时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.beginAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="结束时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.endAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>           
                                    <el-table-column align="center" label="管理员">
                                        <template slot-scope="pro">
                                            {{adminerHash[pro.row.adminer]}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="操作"  width="430" class-name="lastTd">
                                        <template slot-scope="pro">
                                            <el-button size="small" type="success" plain @click="toInfo(pro.row)">信息</el-button>
                                            <el-button size="small" type="success" plain @click="toOrg(pro.row)">机构</el-button>
                                            <el-button size="small" type="success" plain @click="toPer(pro.row)">人员</el-button>
                                            <el-button size="small" type="success" plain @click="toEqu(pro.row)">设备</el-button>
                                            <el-button size="small" type="success" plain @click="toDoc(pro.row)">文档</el-button>
                                            <el-button size="small" type="danger" plain @click="delProject(pro.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="缩略图">
                            <template slot-scope="scope">
                                <img style="width:50px;height:50px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="项目名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="开始时间" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="结束时间" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="管理员">
                            <template slot-scope="scope">
                                <span>{{adminerHash[scope.row.adminer]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="430">
                            <template slot-scope="pro" v-if="pro.row.children.length === 0">
                                <el-button size="small" type="success" plain @click="toInfo(pro.row)">信息</el-button>
                                <el-button size="small" type="success" plain @click="toOrg(pro.row)">机构</el-button>
                                <el-button size="small" type="success" plain @click="toPer(pro.row)">人员</el-button>
                                <el-button size="small" type="success" plain @click="toEqu(pro.row)">设备</el-button>
                                <el-button size="small" type="success" plain @click="toDoc(pro.row)">文档</el-button>
                                <el-button size="small" type="danger" plain @click="delProject(pro.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>    
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div class="pull-right addNewProject">
                <h3>添加项目</h3>
                <el-form label-width="65px" :model="addNewForm" :rules="rules" ref="addNewForm">
                    <el-form-item label="上级" prop="parentId">
                        <el-select v-model="addNewForm.parentId" size="small" placeholder="请选择" @change="selectParentId">
                            <el-option
                            v-for="item in parentIdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="工期" prop="tm">
                        <el-date-picker
                        style="width:195px"
                        size="small"
                        v-model="addNewForm.tm"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="管理员" prop="adminer">
                        <el-select v-model="addNewForm.adminer" size="small" placeholder="请选择" @change="selectAdminer">
                            <el-option
                            v-for="item in adminerOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                    </el-form-item>
                    <el-form-item label="图片" prop="thumbnailPath">
                        <el-upload
                        class="upload-demo"
                        ref="upload"
                        :headers="headers"
                        action="/file/attachment/upload"
                        :limit="10"
                        :data="params"
                        name="uploadFile"
                        :show-file-list ="false"
                        :on-success="uploadSuccess"
                        :file-list="addNewForm.fileList"
                        :auto-upload="true">
                            <el-button slot="trigger" size="small" type="primary">选取</el-button>
                            <el-input v-model="addNewForm.imageName" style="width:135px" size="small" placeholder="请选取图片"></el-input>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="位置" prop="position">
                        <el-input v-model="addNewForm.position" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="comment">
                        <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="addNewForm.comment">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox label="已启用" v-model="addNewForm.status" size="small"></el-checkbox>
                        <el-button type="primary" class="pull-right" @click="submitForm('addNewForm')" size="small" :loading="createLoading" style="width:90px;">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-show="showView === 'mapView'">
            <map-view ></map-view>
        </div>
        <div v-show="showView === 'manage'">
            <project-manage ref="proManage" :view-data='viewData'></project-manage>
        </div>
    </div>
</template>

<script>
import { getToken } from "@/util/auth";
import { fetchList,fetchAdminList,addObj,uploadImg,delObj} from "@/api/project";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js";
import mapView from "./map";
import projectManage from "./manage";

export default {
    components:{
        mapView,
        projectManage
    },
    data(){
        return {
            rules: {
                parentId: [
                    { required: false, message: '请选择父级项目', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                tm: [
                    { required: true, message: '请选择工期', trigger: 'blur' }
                ],
                adminer: [
                    { required: true, message: '请选择管理员', trigger: 'change' }
                ],
                thumbnailPath: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '请选择位置', trigger: 'blur' }
                ],
                comment: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            roleProject_btn_add:true,
            sys_user_upd:true,
            sys_user_del:true,
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            listLoading:false,
            list:[{children:[{name:'123'}]}],
            total:null,
            showView:'index',
            viewData:null,
            parentIdOptions:[],
            adminerOptions:[],
            addNewForm:{
                parentId:0,
                name:'',
                tm:'',
                adminer:'',
                thumbnailPath:'',
                thumbnailUrl:'',
                imageName:'',
                position:'',
                comment:'',
                status:0,
                fileList: []
            },
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            createLoading:false,
            adminerHash:{}
        }
    },
    created() {
        this.getList();
        this.getRoleList();
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions"])
    },
    methods:{
        //管理员列表
        getRoleList(){
            fetchAdminList().then(response => {
                let datas = response.data.result.items;
                let options = []
                for (let i=0; i<datas.length; i++) {
                    options.push({value:datas[i].id,label:datas[i].username}) 
                    this.adminerHash[datas[i].id] = datas[i].username
                } 
                this.adminerOptions = options
            })
        },
        //项目列表
        getList(){
            //console.log(this.listQuery)
            // this.listLoading = true
            fetchList(this.listQuery).then(response => {
                let datas = response.data.result.items;
                this.list = this.arrayToJson(datas);
                this.total = response.data.result.total;
                this.listLoading = false;
            });
        },
        //数组转为树结构
        arrayToJson(treeArray){
            var r = [];
            var tmpMap ={};
            let options = []
            options.push({value:0,label:'无'})
            for (let i=0; i<treeArray.length; i++) {
                if("parentId" in treeArray[i] && treeArray[i].parentId == 0){
                    treeArray[i].children = [];
                    tmpMap[treeArray[i].id]= treeArray[i]; 
                    options.push({value:treeArray[i].id,label:treeArray[i].name})
                }
            } 
            this.parentIdOptions = options
            for (let i=0; i<treeArray.length; i++) {
                if("parentId" in treeArray[i]) {
                    var key=tmpMap[treeArray[i].parentId];
                    if (key) {
                        key["children"].push(treeArray[i]);
                    } else {
                        r.push(treeArray[i]);
                    }
                }
            }
            return r
                
        },
        uploadSuccess(response, file, fileList){
            this.addNewForm.thumbnailPath = response.result.path
            this.addNewForm.thumbnailUrl = response.result.baseUrl
            this.addNewForm.imageName = response.result.name
            this.addNewForm.fileList = []
        },  
        // 新增项目
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let formData = Object.assign({}, this.addNewForm);
                    formData.beginAt = Math.round(new Date(formData.tm[0]).getTime()/1000);
                    formData.endAt = Math.round(new Date(formData.tm[1]).getTime()/1000);
                    formData.adminer = formData.adminer.toString()
                    formData.status = formData.status?1:0
                    delete formData.tm
                    delete formData.fileList
                    delete formData.imageName
                    addObj(formData).then(response => {
                        this.createLoading = false
                        this.getList()
                        this.resetForm(formName)
                    })
                }
            });
        },
        // 删除项目
        delProject(row){
            this.$confirm(
                "此操作将永久删除该项目(项目名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(response => {
                    console.log(response)
                    this.getList()
                })
            })
            
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleFilter(){
            this.listQuery.page_index = 1;
            this.getList()
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        //地图
        toProjectMap(){ 
            this.showView = 'mapView'
        },
        //信息
        toInfo(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'info'
            this.viewData = row
        },
        //机构
        toOrg(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'org'
            this.viewData = row
        },
        //人员
        toPer(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'per'
            this.viewData = row
        },
        //设备
        toEqu(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'equ'
            this.viewData = row
        },
        //文档
        toDoc(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'doc'
            this.viewData = row
        },
        addNewProject(){
            
        },
        selectParentId(){
            console.log(this.addNewForm.parentId)
        },
        selectAdminer(){}
    }
}
</script>

<style scoped>
.el-form-item{
    margin-bottom: 15px
}
.addNewProject{
    width: 260px;
    border: 1px solid #dcdfe6;
    padding: 10px 20px 0 20px
}
.el-form-item__error{
    padding-top: 0 !important
}
</style>

