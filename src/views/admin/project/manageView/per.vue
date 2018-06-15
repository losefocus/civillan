<template>
    <div style="padding:20px;border:1px solid #dcdfe6">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="objectTypeVisible = true" size="small" type="primary" icon="edit" >角色管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;">
            <el-table-column align="center" label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="电话">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="登录名">
                <template slot-scope="scope">
                    <span>{{scope.row.beginAt}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在机构">
                <template slot-scope="scope">
                    <span>{{scope.row.endAt}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.adminer}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope" >
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" plain @click="deleteOrg(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog id="orgType" title="角色管理"  :visible.sync="objectTypeVisible" width='680px'>
            <div>
                项 目 : {{projectInfo.name}} 
            </div>
            <el-form :model="roleForm" class="clearfix" ref="roleForm">
                <el-form-item label="角色" style="width: 140px">
                    <el-input v-model="roleForm.role" style="width:90px;" size="small" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" style="width: 250px">
                    <el-input v-model="roleForm.description" style="width:200px;" size="small" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-checkbox v-model="roleForm.available" >已启用</el-checkbox>
                </el-form-item>
                <el-form-item  style="width: 140px">
                    <div v-show="flag == 'add'">
                        <el-button size="small" type="primary" @click="addRole">添加</el-button>
                    </div>
                   <div v-show="flag == 'edit'">
                        <el-button size="small" type="primary" @click="handleUpdateRole('roleForm')">保存</el-button>
                        <el-button size="small" type="info" @click="cancelUpdate('roleForm')">取消</el-button>
                   </div>
                </el-form-item>
            </el-form>
            <el-table :data="roleList" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 99%;">
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
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span>{{(scope.row.available == 1)?'已启用':'未启用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" type="success" plain @click="updateRole(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" plain @click="deleteRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { fetchUserList,fetchRoleList,addRoleObj,delRoleObj} from "@/api/project_per";
export default {
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            list:[{}],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            objectTypeVisible:false,
            roleForm:{},
            roleList:[{}],
            flag:'add'
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
        getList(){
            this.listQuery.projectId = this.projectInfo.id
            fetchUserList(this.listQuery).then(res => {
                console.log(res)
            })
        },
        handleCreate(){

        },
        toProjectMap(){

        },
        perManage(){

        },
        editOrg(){

        },
        deleteOrg(){

        },
        getRoleList(){
            this.listQuery.projectId = this.projectInfo.id
            fetchRoleList(this.listQuery).then(res => {
                this.roleList = res.data.result.items
                let roleOptions = []
                this.roleList.forEach(element => {
                    element.value = element.id
                    element.label = element.name
                    roleOptions.push(element)
                });
                this.$store.commit("SET_ROLEOPTIONS",roleOptions);
            })
        },
        addRole(){
            let data = Object.assign({}, this.roleForm);
            data.available = data.available?1:0
            data.projectId = this.projectInfo.id
            console.log(data)
            addRoleObj(data).then( res => {

            })
        },
        updateRole(){
            this.flag = 'edit'
        },
        handleUpdateRole(){

        },
        deleteRole(row){
            this.$confirm(
                "此操作将永久删除该角色(角色名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delRoleObj(row.id).then(res => {

                })
            })
            
        },
        cancelUpdate(){
            this.flag = 'add'
            this.roleForm = {}
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
