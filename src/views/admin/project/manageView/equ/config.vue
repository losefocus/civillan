<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" label-width="70px" size="mini">
            <el-form-item label="配置名称" style="width: 325px">
                <el-input v-model="form.name" size="mini" auto-complete="off" style="width:240px"></el-input>
            </el-form-item>
            <el-form-item label="配置项" style="width: 325px;">
                <el-input v-model="form.key" size="mini" auto-complete="off"  style="width:255px"></el-input>
            </el-form-item>
            <el-form-item label="配置内容" style="width: 650px">
                <el-input v-model="form.value" type="textarea" :rows="2"  style="width:580px" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right"  @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="配置名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配置项">
                    <template slot-scope="scope">
                        <span>{{scope.row.key}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配置内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {getObj,addObj,delObj,editObj} from "@/api/project/config";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            form:{
                name:'',
                key:'',
                status:true
            },
            flag:'add',
            listQuery:{
                deviceId:this.dataInfo.id,
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null
        }
    },
    created() {
        //this.getList()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["configList"]),
    },
    methods:{
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.resetTem()
            this.listLoading = true
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
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
                    this.getList(this.listQuery)
                    this.$parent.$parent.$parent.$parent.alertNotify('删除')
                })
            })
        },
        handleAdd(){
            let data = Object.assign({},this.form)
            // data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            data.deviceId = this.dataInfo.id
            this.createdLoading = true
            addObj(data).then(res => {
                this.getList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('添加')
                this.resetTem()
            })
        },
        handleEdit(){
            this.createdLoading = true
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            editObj(data).then(res => {
                this.getList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('修改')
                this.cancelEdit()
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                name:'',
                key:'',
                status:true
            }
            this.createdLoading = false
        }
    },
    watch:{
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px;
    margin-bottom: 10px
}

</style>
