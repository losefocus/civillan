<template>
    <div class="clearfix">
        <div >
            产 品 : {{productInfo.name}} 
        </div>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:10px">
                <el-table-column align="center" label="变量">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标识">
                    <template slot-scope="scope">
                        <span>{{scope.row.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.type}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#f56c6c"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.$index, list)" style="margin-left:0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>

import {get_templateObj} from "@/api/product";
export default {
    props:['productInfo','templateInfo'],
    data(){
        return {
            listLoading:false,
            flag:'add',
            textareax:'',
            list:[],
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            templateData:null
        }
    },
    created() {
        this.getList()
    },
    mounted() {
    },
    computed: {},
    methods:{
        handleCurrentChange(){},
        handleSizeChange(){},
        getList(){
            this.listLoading = true
            let id
            this.productInfo.productTemplate.forEach(element => {
                if(element.type === 1)id = element.id
            });
            get_templateObj(id).then(res => {
                let data = res.data.result
                this.templateData = data
                this.list = []
                this.total = 0
                if(data.content && data.content !=''){
                    this.list = JSON.parse(data.content)
                    this.total = this.list.length
                }
                this.listLoading = false
            })
        },
        updateList(index, rows){
            
        },
        deleteList(row){
            rows.splice(index, 1);
            let content = rows
            this.setContent(content)
        },
        setContent(content){
            this.templateInfo.content = content
            console.log(this.templateInfo)
        },
        handleAdd(){},
        handleEdit(){},
        cancelEdit(){}
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>
