<template>
    <div style="padding:20px;border:1px solid #dcdfe6">
        <div class="filter-container">
            <!-- <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >添加机构
            </el-button> -->
            <el-button class="filter-item" style="" @click="toProjectMap"  size="small" type="primary" icon="edit" >机构类型
            </el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;">
            <el-table-column align="center" label="机构名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
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
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope" >
                    <el-button size="small" type="success" plain @click="perManage(scope.row)">人员管理</el-button>
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">修改</el-button>
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table> 
    </div>
</template>
<script>
import { fetchList,addObj,delObj,editObj} from "@/api/project";
export default {
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            list:[{}]
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
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
