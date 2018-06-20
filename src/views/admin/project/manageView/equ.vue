<template>
    <div style="padding:20px;border:1px solid #dcdfe6">
        <div class="filter-container">
            <!-- <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >添加设备</el-button> -->
            <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >分组管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;">
            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在分组">
                <template slot-scope="scope">
                    <span>{{scope.row.parentId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="key">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <span>{{scope.row.secret}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="固件版本">
                <template slot-scope="scope">
                    <span>{{scope.row.firmware}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="激活日期">
                <template slot-scope="scope">
                    <span>{{scope.row.active_at}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="500">
                <template slot-scope="scope" >
                    <el-button size="small" type="success" plain @click="perManage(scope.row)">配置</el-button>
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">证书</el-button>
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">变量</el-button>
                    <el-button size="small" type="success" plain @click="perManage(scope.row)">报警</el-button>
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">通知</el-button>
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">修改</el-button>
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
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
