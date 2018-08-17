<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加配置</el-button>
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">导入</el-button>
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">导出</el-button>
            <!-- <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="文档标题" v-model="listQuery.name"></el-input> -->
        </div>
        <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 99%;margin-bottom:20px;">
            <el-table-column align="left" label="名称" min-width="150">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标识" min-width="60">
                <template slot-scope="scope">
                    <span>{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width="80">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;">{{scope.row.typeId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" min-width="60">   
                <template slot-scope="scope">
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" min-width="60">   
                <template slot-scope="scope">
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" plain>复制</el-button>
                    <el-button size="mini" type="" plain @click="updataDoc(scope.row)" style="margin-left:0px">修改</el-button>
                    <el-button size="mini" type="" plain @click="deleteDoc(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {fetchList,delObj} from "@/api/project_config";
export default {
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:null,
        }
    },
    created() {
        this.getList()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["adminerHash"])
    },
    methods:{
        handleAdd(){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addDoc.flag = 'add'
            this.$parent.$refs.addDoc.resetTemp()
        },
        getList(){
            this.listLoading = true
            this.listQuery.sort_by = 'sort'
            this.listQuery.direction = 'asc'
            this.listQuery.projectId = this.projectInfo.id
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
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
        deleteDoc(row){
            this.$confirm(
                "此操作将永久删除该配置(配置名:" + row.name + "), 是否继续?",
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
        updataDoc(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addConfig.flag = 'updata'
            this.$parent.$refs.addConfig.form = Object.assign({},row)
            this.$parent.$refs.addConfig.form.status = (row.status === 1)?true:false
            // this.$parent.$refs.addConfig.config_content = JSON.parse(row.content)
            let contents = JSON.parse(row.content)
            contents.forEach(ele => {
                ele.flag = false
            });
            this.$parent.$refs.addConfig.config_content = contents
        },
    }
}
</script>
<style scoped>

</style>
