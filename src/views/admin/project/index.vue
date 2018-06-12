<template>
    <div class="app-container calendar-list-container">
        <div v-show="showView === 'index'">
            <div class="filter-container">
                <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" v-if="roleProject_btn_add">添加项目
                </el-button>
                <el-button class="filter-item" style="" @click="toProjectMap"  size="small" type="primary" icon="edit" >项目地图
                </el-button>
                <div class="pull-right">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" class="filter-item" placeholder="项目名称" v-model="listQuery.keyword">
                    </el-input>
                    <el-button class="filter-item" type="primary" v-waves icon="search" size="small" @click="handleFilter">搜索</el-button>
                </div>
            </div>
            <div class="clearfix">
                <div class="pull-left" style="width:calc(100% - 350px)">
                    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;margin-bottom:10px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" v-if="scope.row.children.length != 0" border ref="subTable" id="subTable">
                                    <el-table-column align="center" label="缩略图">
                                        <template slot-scope="pro">
                                            {{pro.row.beginAt}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="项目名称">
                                        <template slot-scope="pro">
                                            {{pro.row.name}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="开始时间">
                                        <template slot-scope="pro">
                                            {{pro.row.beginAt}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="结束时间">
                                        <template slot-scope="pro">
                                            {{pro.row.endAt}}
                                        </template>
                                    </el-table-column>           
                                    <el-table-column align="center" label="管理员">
                                        <template slot-scope="pro">
                                            {{pro.row.adminer}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="操作"  width="380" class-name="lastTd">
                                        <template slot-scope="pro">
                                            <el-button size="small" type="success" plain @click="toInfo(pro.row)">信息</el-button>
                                            <el-button size="small" type="success" plain @click="toOrg(pro.row)">机构</el-button>
                                            <el-button size="small" type="success" plain @click="toPer(pro.row)">人员</el-button>
                                            <el-button size="small" type="success" plain @click="toEqu(pro.row)">设备</el-button>
                                            <el-button size="small" type="success" plain @click="toDoc(pro.row)">文档</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="缩略图">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="项目名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="开始时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.beginAt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="结束时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.endAt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="管理员">
                            <template slot-scope="scope">
                                <span>{{scope.row.adminer}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="380">
                            <template slot-scope="pro" v-if="pro.row.children.length === 0">
                                <el-button size="small" type="success" plain @click="toInfo(pro.row)">信息</el-button>
                                <el-button size="small" type="success" plain @click="toOrg(pro.row)">机构</el-button>
                                <el-button size="small" type="success" plain @click="toPer(pro.row)">人员</el-button>
                                <el-button size="small" type="success" plain @click="toEqu(pro.row)">设备</el-button>
                                <el-button size="small" type="success" plain @click="toDoc(pro.row)">文档</el-button>
                            </template>
                        </el-table-column>
                    </el-table>    
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
                <div class="pull-right addNewProject">
                    <h3>添加项目</h3>
                    <el-form label-width="78px" :model="addNewForm" :rules="rules" ref="addNewForm">
                        <el-form-item label="父级项目" prop="parentId">
                            <el-select v-model="addNewForm.parentId" size="small" placeholder="请选择" @change="selectParentId">
                                <el-option
                                v-for="item in parentIdOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="addNewForm.name" size="small" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="计划工期" prop="tm">
                            <el-date-picker
                            size="small"
                            v-model="addNewForm.tm"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="管理员" prop="adminer">
                            <el-select v-model="addNewForm.adminer" size="small" placeholder="请选择" @change="selectParentId">
                                <el-option
                                v-for="item in adminerOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>                        
                        </el-form-item>
                        <el-form-item label="图片" prop="picUrl">
                            <el-input v-model="addNewForm.picUrl" size="small" placeholder="请输入内容"></el-input>
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
                            <el-checkbox-group v-model="addNewForm.resource">
                                <el-checkbox label="已激活"></el-checkbox>
                                <el-checkbox label="可见"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <!-- <el-form-item> -->
                            <el-button type="primary" @click="submitForm('addNewForm')" size="small" style="width:100%;">立即创建</el-button>
                            <el-button @click="resetForm('addNewForm')" size="small" style="width:100%;margin:20px 0 0 0">重置</el-button>
                        <!-- </el-form-item> -->
                    </el-form>
                </div>
            </div>
            
        </div>
        <div v-show="showView === 'mapView'">
            <map-view></map-view>
        </div>
        <div v-show="showView === 'manage'">
            <project-manage ref="proManage" :view-data='viewData'></project-manage>
        </div>
    </div>
</template>

<script>
import { fetchList,fetchRoleList } from "@/api/project";
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
                picUrl: [
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
                keyword:'',
                page_index: 1,
                page_size: 20
            },
            listLoading:false,
            list:[{children:[{name:'123'}]}],
            total:null,
            showView:'index',
            viewData:null,
            parentIdOptions:[{value: '0',label: '无'},{value: '1',label: '1'}],
            adminerOptions:[],
            addNewForm:{
                parentId:'0',
                name:'',
                tm:'',
                adminer:'',
                picUrl:'',
                position:'',
                comment:'123',
                resource:[],
            }
            
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
        getRoleList(){
            fetchRoleList().then(response => {
                let datas = response.data.result.items;
                let options = []
                for (let i=0; i<datas.length; i++) {
                    options.push({value:datas[i].id,label:datas[i].id}) 
                } 
                this.adminerOptions = options
            })
        },
        getList(){
            //console.log(this.listQuery)
            fetchList().then(response => {
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
                if(treeArray[i].parentId == 0){
                    treeArray[i].children = [];
                    tmpMap[treeArray[i].id]= treeArray[i]; 
                    options.push({value:treeArray[i].id,label:treeArray[i].name})
                }
            } 
            this.parentIdOptions = options
            for (let i=0; i<treeArray.length; i++) {
                var key=tmpMap[treeArray[i].parentId];
                if (key) {
                    key["children"].push(treeArray[i]);
                } else {
                    r.push(treeArray[i]);
                }
            }
            return r
                
        },
        handleCreate(){
            console.log(this.$refs)
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.addNewForm)
                    console.log('submit!');
                } else {
                    console.log('error submit!!');
                    //return false;
                }
            });
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleFilter(){
            console.log(123)
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
        },
        //人员
        toPer(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'per'
        },
        //设备
        toEqu(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'equ'
        },
        //文档
        toDoc(row){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'doc'
        },
        addNewProject(){
            
        },
        selectParentId(){
            console.log(this.addNewForm.parentId)
        },
        
    }
}
</script>

<style scoped>
.addNewProject{
    width: 260px;
    height: 665px;
    border: 1px solid #dcdfe6;
    padding: 10px 20px
}
</style>

