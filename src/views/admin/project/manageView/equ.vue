<template>
    <div style="padding:20px;border:1px solid #dcdfe6">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >分组管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;margin-bottom:10px">
            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在分组">
                <template slot-scope="scope">
                    <span>{{scope.row.deviceGroup.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="key">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top">
                        <el-button size="small">key</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.secret" placement="top">
                        <el-button size="small">secret</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="固件版本">
                <template slot-scope="scope">
                    <span>{{scope.row.firmware}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="激活日期" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="500">
                <template slot-scope="scope" >
                    <el-button size="small" type="success" plain @click="perManage(scope.row)">配置</el-button>
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">证书</el-button>
                    <el-button size="small" type="success" plain @click="deleteOrg(scope.row)">变量</el-button>
                    <el-button size="small" type="success" plain @click="perManage(scope.row)">报警</el-button>
                    <el-button size="small" type="success" plain @click="editOrg(scope.row)">通知</el-button>
                    <el-button size="small" type="success" plain @click="updataEqu(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" plain @click="deleteEqu(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {fetchList,delObj,updataObj} from "@/api/project_equ";
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
            total:null,
            flag:'add',
            createdLoading:false
        }
    },
    created() {
        this.getList()
    },
    mounted() {

    },
    computed: {},
    methods:{
        handleCreate(){

        },
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
        deleteEqu(row){
            this.$confirm(
                "此操作将永久删除该设备(设备名:" + row.name + "), 是否继续?",
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
        updataEqu(row){
            console.log(row)
            this.$parent.$refs.addEqu.flag = 'updata'
            this.$parent.$refs.addEqu.form = Object.assign({},row)
            this.$parent.$refs.addEqu.form.status = row.status === 1?true:false
            this.$parent.$refs.addEqu.productId_alias = row.productId+','+row.alias
        },
        handleUpdataEqu(){
            
            updataObj().then(res => {
                this.$parent.$parent.alertNotify('修改')
            })
        },
        perManage(){

        },
        editOrg(){

        },
        deleteOrg(){

        },
        
    }
}
</script>
<style scoped>

</style>
