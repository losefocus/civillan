<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加人员</el-button>
            <el-button class="filter-item" style="" @click="objectTypeVisible = true" size="small" type="primary" icon="edit" >角色管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" stripe fit highlight-current-row style="width: 99%;margin-bottom:20px">
            <el-table-column align="center" label="姓名(角色)" min-width="110">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;cursor:pointer;"><a>{{scope.row.name}}({{scope.row.userRole[0].projectRole.role}})</a></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电话" min-width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="登录名">
                <template slot-scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="所在机构" min-width="170">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectOrgan.name" placement="top-start" :open-delay="300">
                        <span style="white-space:nowrap;cursor:pointer;"><a>{{scope.row.projectOrgan.name}}</a></span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="角色">
                <template slot-scope="scope">
                    <span>{{scope.row.userRole.roleId}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="140">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" plain @click="updatePer(scope.row)">修改</el-button>
                    <el-button size="mini" type="" plain @click="deletePer(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog id="orgType" title="角色管理"  :visible.sync="objectTypeVisible" width='690px'>
            <el-form :model="roleForm" class="clearfix" ref="roleForm" size="mini">
                <el-form-item label="角色" style="width: 200px">
                    <el-input v-model="roleForm.role" style="width:150px;" size="mini" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" style="width: 200px">
                    <el-input v-model="roleForm.description" style="width:150px;" size="mini" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item >
                    <el-checkbox v-model="roleForm.available" >已启用</el-checkbox>
                </el-form-item> -->
                <el-form-item  style="width: 230px" class="pull-right">

                    <div v-show="flag == 'add'" class="pull-right">
                        <el-button size="mini" type="primary" @click="addRole('roleForm')" :loading="createdRoleLoading">添加</el-button>
                    </div>
                   <div v-show="flag == 'edit'" class="pull-right">
                        <el-button size="mini" type="primary" @click="handleEditRole('roleForm')" :loading="createdRoleLoading">保存</el-button>
                        <el-button size="mini" type="info" @click="cancelEdit('roleForm')" style="margin-left:5px;">取消</el-button>
                   </div>
                   <el-checkbox v-model="roleForm.available"  class="pull-right" style="margin-right:20px;">已启用</el-checkbox>
                </el-form-item>
            </el-form>
            <div v-loading="roleListLoading">
                <el-table :data="roleList" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                    <el-table-column align="center" label="角色">
                        <template slot-scope="scope">
                            <span>{{scope.row.role}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="描述">
                        <template slot-scope="scope">
                            <span>{{scope.row.description}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <i v-if="scope.row.available == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                            <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button size="mini" type="" plain @click="updateRole(scope.row)">修改</el-button>
                            <el-button size="mini" type="" plain @click="deleteRole(scope.row)" style="margin-left:0px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!roleListLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange_role" @current-change="handleCurrentChange_role" :current-page.sync="roleListQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="roleListQuery.page_size" layout="total, prev, pager, next, jumper" :total="roleTotal">
                    </el-pagination>
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
import { fetchUserList,delObj,fetchRoleList,addRoleObj,delRoleObj,updateRoleObj} from "@/api/project_per";
export default {
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            roleListLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:null,
            objectTypeVisible:false,
            roleForm:{
                available:true
            },
            roleList:[],
            roleListQuery: {
                page_index: 1,
                page_size: 10
            },
            roleTotal:null,
            flag:'add',
            createdRoleLoading:false
        }
    },
    created() {
        this.getList()
        this.getRoleList()
    },
    mounted() {
    },
    computed: {},
    methods:{ 
        handleAdd(){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addPer.flag = 'add'
            this.$parent.$refs.addPer.resetTemp()
        },
        getList(){
            this.listLoading = true
            this.listQuery.projectId = this.projectInfo.id
            fetchUserList(this.listQuery).then(res => {
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
        updatePer(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addPer.flag = 'edit'
            this.$parent.$refs.addPer.usernameDisabled = true
            this.$parent.$refs.addPer.form = Object.assign({},row)
            this.$parent.$refs.addPer.form.status = (row.status == 1)?true:false
            this.$parent.$refs.addPer.form.projectOrgan = {id :row.projectOrgan.id}
            this.$parent.$refs.addPer.role = row.userRole[0].projectRole.id
        },
        deletePer(row){
            this.$confirm(
                "此操作将永久删除该机构类型(类型名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.$parent.$parent.alertNotify('删除')
                })
            })
            
        },
        getRoleList(){
            this.roleListQuery.projectId = this.projectInfo.id
            this.roleListLoading = true
            fetchRoleList(this.roleListQuery).then(res => {
                this.roleList = res.data.result.items
                this.roleTotal = res.data.result.total
                let roleOptions = []
                this.roleList.forEach(element => {
                    element.value = element.id
                    element.label = element.role
                    roleOptions.push(element)
                });
                this.$store.commit("SET_ROLEOPTIONS",roleOptions);
                this.roleListLoading = false
            })
        },
        handleSizeChange_role(val) {
            this.roleListQuery.page_size = val;
            this.getRoleList();
        },
        handleCurrentChange_role(val) {
            this.roleListQuery.page_index = val;
            this.getRoleList();
        },
        addRole(formName){
            let data = Object.assign({}, this.roleForm);
            data.available = data.available?1:0
            data.projectId = this.projectInfo.id
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createdRoleLoading = true
                    addRoleObj(data).then( res => {
                        if(res.data.success == true){
                            this.getRoleList()
                            this.roleForm = {};
                            this.$parent.$parent.alertNotify('添加')
                            this.createdRoleLoading = false
                        }
                    })
                }
            })
        },
        updateRole(row){
            this.flag = 'edit'
            this.roleForm= Object.assign({}, row);
            this.roleForm.available = (this.roleForm.available == 1)?true:false
        },
        handleEditRole(formName){
            let data = Object.assign({}, this.roleForm);
            data.available = data.available?1:0
            delete data.label
            delete data.value
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createdRoleLoading = true
                    updateRoleObj(data).then( res => {
                        if(res.data.success == true){
                            this.getRoleList()
                            this.cancelEdit();
                            this.$parent.$parent.alertNotify('修改')
                            this.createdRoleLoading = false
                        }
                    })
                }
            })
        },
        deleteRole(row){
            this.$confirm(
                "此操作将永久删除该角色(角色名:" + row.role + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delRoleObj(row.id).then(res => {
                    this.getRoleList()
                    this.$parent.$parent.alertNotify('删除')
                })
            })
            
        },
        cancelEdit(){
            this.flag = 'add'
            this.roleForm = {available:true}
            this.createdRoleLoading = false
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
