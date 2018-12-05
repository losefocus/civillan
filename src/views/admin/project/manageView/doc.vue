<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加文件</el-button>
            <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="文档标题" v-model="listQuery.name"></el-input>
        </div>
        <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 99%;margin-bottom:20px;">
            <el-table-column align="left" label="文档标题" min-width="150">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="文件类型" min-width="60">
                <template slot-scope="scope">
                    <span>{{scope.row.extension}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上传用户" min-width="80">
                <template slot-scope="scope">
                    <span v-if="'frontUser' in scope.row">{{scope.row.frontUser.name}}</span>
                    <span v-else style="white-space:nowrap;">{{adminerHash[scope.row.createdBy]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上传时间" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" min-width="60">   
                <template slot-scope="scope">
                    <span>{{(scope.row.status == 1)?'已公开':'未公开'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope" >
                    <a :href="scope.row.fileBaseUrl+scope.row.filePath" download target="_blank"><el-button size="mini" type="" plain>下载</el-button></a>
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
  import {mapGetters} from "vuex";
  import {delObj, fetchList, updataObj} from "@/api/project_doc";

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
            objectTypeVisible:false,
            flag:'add',
            createdLoading:false,
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
                "此操作将永久删除该文件(文件名:" + row.name + "), 是否继续?",
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
            }).catch(() => {});
        },
        updataDoc(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addDoc.flag = 'updata'
            this.$parent.$refs.addDoc.form = Object.assign({},row)
            this.$parent.$refs.addDoc.form.status = (row.status === 1)?true:false
        },
    }
}
</script>
<style scoped>

</style>
