<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加机构</el-button>
            <el-button class="filter-item" style="" @click="objectTypeVisible = true"  size="small" type="primary" icon="edit" >机构类型
            </el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" stripe fit highlight-current-row style="width: 99%;margin-bottom: 20px;">
            <el-table-column align="left" label="机构名称" min-width="170px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start" :open-delay="300">
                        <span style="white-space:nowrap;cursor:pointer;"><a>{{scope.row.name}}</a></span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="联络人">
                <template slot-scope="scope">
                    <span>{{scope.row.contact}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电话">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="地址">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width ="150">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" plain @click="updateOrg(scope.row)">修改</el-button>
                    <el-button size="mini" type="" plain @click="deleteOrg(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog id="orgType" title="机构类型"  :visible.sync="objectTypeVisible" width='690px'>
            <el-form :model="orgTypeForm" class="clearfix" ref="orgTypeForm" size="mini">
                <el-form-item label="名称" style="width: 140px">
                    <el-input v-model="orgTypeForm.name" style="width:90px;" size="mini" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="别名" style="width: 140px">
                    <el-input v-model="orgTypeForm.alias" style="width:90px;" size="mini" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" style="width: 140px">
                    <el-input v-model="orgTypeForm.sort" style="width:90px;" size="mini" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-checkbox v-model="orgTypeForm.status" >已启用</el-checkbox>
                </el-form-item>
                <el-form-item  style="width: 150px">
                    <div v-show="flag == 'add'">
                        <el-button size="mini" type="primary" @click="addType('orgTypeForm')" :loading="createLoading">添加</el-button>
                    </div>
                   <div v-show="flag == 'edit'">
                        <el-button size="mini" type="" @click="handleUpdateType('orgTypeForm')" :loading="createLoading">保存</el-button>
                        <el-button size="mini" type="" @click="cancelEdit('orgTypeForm')">取消</el-button>
                   </div>
                </el-form-item>
            </el-form>
            <div v-loading="typelListLoading">
                <el-table :data="orgTypeList"  element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 99%;margin-bottom:20px;margin-top:10px">
                    <el-table-column align="center" label="类型名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="别名">
                        <template slot-scope="scope">
                            <span>{{scope.row.alias}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="排序">
                        <template slot-scope="scope">
                            <span>{{scope.row.sort}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                            <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" type="" plain @click="updateType(scope.row)">修改</el-button>
                            <el-button size="mini" type="" plain @click="deleteType(scope.row)" style="margin-left:0px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!typelListLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange_type" @current-change="handleCurrentChange_type" :current-page.sync="typeListQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="typeListQuery.page_size" layout="total,  prev, pager, next, jumper" :total="typeTotal">
                    </el-pagination>
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
import { fetchList,delObj,updateObj,fetchTypeList,addObjType,updateObjType,delObjType} from "@/api/project_org";
// import { getBoolean } from '@/utils'
export default {
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            typelListLoading:false,
            list:[],
            objectTypeVisible:false,
            orgTypeForm:{
                name:'',
                alias:'',
                sort:'',
                status:true,
            },
            orgTypeList:[],
            flag:'add',
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:null,
            typeListQuery: {
                page_index: 1,
                page_size: 10
            },
            typeTotal:null,
            createLoading:false,
        }
    },
    created() {
        this.getList()
        this.getTypeList()
    },
    mounted() {

    },
    computed: {},
    methods:{
        handleAdd(){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addOrg.flag = 'add'
            this.$parent.$refs.addOrg.resetTemp()
        },
        // 得到机构列表
        getList(){
            this.listLoading = true
            this.listQuery.projectId = this.projectInfo.id
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        // 修改机构
        updateOrg(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addOrg.flag = 'update'
            this.$parent.$refs.addOrg.addNewForm = Object.assign({},row)
            this.$parent.$refs.addOrg.addNewForm.status = (row.status == 1)?true:false
        },
        // 删除机构
        deleteOrg(row){
            this.$confirm(
                "此操作将永久删除该机构(机构名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    if(res.data.success == true){
                        this.getList()
                        this.$parent.$parent.alertNotify('删除')
                    }
                })
            })
        
        },
        // 得到机构类型列表
        getTypeList(){       
            this.typeListQuery.projectId = this.projectInfo.id     
            this.typelListLoading = true
            fetchTypeList(this.typeListQuery).then(res=>{
                this.orgTypeList = res.data.result.items
                this.typeTotal = res.data.result.total
                let orgTypeOptions = []
                this.orgTypeList.forEach(element => {
                    element.value = element.id
                    element.label = element.name
                    orgTypeOptions.push(element)
                });
                this.$store.commit("SET_TYPEOPTIONS",orgTypeOptions);
                this.typelListLoading = false
            })
        },
        handleSizeChange_type(val) {
            this.typeListQuery.page_size = val;
            this.getTypeList();
        },
        handleCurrentChange_type(val) {
            this.typeListQuery.page_index = val;
            this.getTypeList();
        },
        // 添加机构类型
        addType(formName){
            let data = Object.assign({}, this.orgTypeForm);
            data.projectId = this.projectInfo.id
            data.sort = (Number(data.sort)<=0)?0:Number(data.sort)
            data.status = data.status?1:0
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    addObjType(data).then(res=>{
                        if(res.data.success == true){
                            this.getTypeList()
                            this.$parent.$parent.alertNotify('添加')
                            this.resetType()
                        }
                    })
                }
            })
            
        },
        // 删除机构类型
        deleteType(row){
            this.$confirm(
                "此操作将永久删除该机构类型(类型名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObjType(row.id).then(res => {
                    if(res.data.success == true){
                        this.getTypeList()
                        this.$parent.$parent.alertNotify('删除')
                    }
                })
            })
            
        },
        updateType(row){
            this.flag = 'edit'
            this.orgTypeForm= Object.assign({}, row);
            this.orgTypeForm.status = (this.orgTypeForm.status == 1)?true:false
        },
        // 修改机构类型
        handleUpdateType(formName){
            let data = Object.assign({}, this.orgTypeForm);
            data.sort = (Number(data.sort)<=0)?0:Number(data.sort)
            data.status = data.status?1:0
            delete data.value
            delete data.label
            this.createLoading = true
            updateObjType(data).then(res => {
                if(res.data.success == true){
                    this.getTypeList()
                    this.flag = 'add'
                    this.$parent.$parent.alertNotify('修改')
                    this.resetType()
                }
            })
        },
        cancelEdit(formName){
            this.flag = 'add'
            this.resetType()
        },
        resetType(){
            this.createLoading = false
            this.orgTypeForm={
                name:'',
                alias:'',
                sort:'',
                status:true,
            }
        }
        
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>
