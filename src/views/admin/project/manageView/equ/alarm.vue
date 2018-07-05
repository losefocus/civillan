<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" label-width="70px" size="small">
            <el-form-item label="报警标题" style="width: 650px">
                <el-input v-model="form.title" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="触发条件" style="width: 310px;">
                <el-input v-model="form.condition" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="报警周期" style="width: 310px;;margin-left:30px">
                <el-select v-model="form.cycle" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报警内容" style="width: 310px">
                <el-input v-model="form.triggerMessage" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="恢复内容" style="width: 310px;margin-left:30px">
                <el-input v-model="form.recoverMessage" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" style="width: 650px">
                <el-input v-model="form.comment" type="textarea" :rows="2" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:10px">
                <el-table-column align="center" label="报警标题">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报警内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.triggerMessage}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="恢复内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.recoverMessage}}</span>
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
                        <el-button size="mini" type="success" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" plain @click="deleteList(scope.row)">删除</el-button>
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
import { mapGetters } from "vuex";
import {getObj,addObj,delObj,editObj} from "@/api/project/alarm";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            options:[
                {
                    value: 0,
                    label: '从不通知'
                },{
                    value: 1,
                    label: '仅一次'
                },{
                    value: 5,
                    label: '每隔5分钟'
                },{
                    value: 30,
                    label: '每隔30分钟'
                },{
                    value: 60,
                    label: '每隔1小时'
                },{
                    value: 1440,
                    label: '每隔1天'
                }
            ],
            form:{
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
                status:''
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
        this.getList()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["alarmList"]),
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
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
                status:''
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
