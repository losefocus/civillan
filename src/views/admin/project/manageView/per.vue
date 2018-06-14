<template>
    <div style="padding:20px;border:1px solid #dcdfe6">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >添加人员
            </el-button>
            <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >角色管理
            </el-button>
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
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { fetchRoleList} from "@/api/project_per";
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
        }
    },
    created() {
        this.getList()
    },
    mounted() {
    },
    computed: {},
    methods:{
        getList(){
            console.log(this.projectInfo.id)
            this.listQuery.projectId = this.projectInfo.id
            fetchRoleList(this.listQuery).then(response => {
                console.log(this.listQuery)
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

        }
    }
}
</script>
<style scoped>

</style>
