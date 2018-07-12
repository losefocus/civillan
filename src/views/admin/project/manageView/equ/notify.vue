<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" label-width="70px" size="mini">
            <el-form-item label="报警标题" style="width: 650px">
                <el-select v-model="form.alarmId" placeholder="请选择" size="mini" :loading="alarmLoading">
                    <el-option
                    v-for="item in alarmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知对象"  style="width: 650px">
                <el-select v-model="form.puserIds" multiple placeholder="请选择" size="mini" :loading="userLoading">
                    <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报警周期" style="width: 310px;">
                <el-select v-model="form.cycle" placeholder="请选择" size="mini">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知方式" style="width: 310px;margin-left:30px">
                <el-select v-model="form.notifyTypes" placeholder="请选择" size="mini" >
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  style="width: 140px;padding-top:5px" class="pull-right">
                <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="通知对象">
                    <template slot-scope="scope">
                        <span>{{scope.row.projectUser.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="通知方式">
                    <template slot-scope="scope">
                        <span>{{scope.row.notifyTypes}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报警周期">
                    <template slot-scope="scope">
                        <span>{{scope.row.cycle}}</span>
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
import { remote } from "@/api/dict";
import {getAlarmObj,getUserObj,getObj,addObj,delObj,editObj} from "@/api/project/notify";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            options:[],
            typeOptions:[],
            form:{
                alarmId:'',
                puserIds:[],
                cycle:'',
                notifyTypes:'',
                status:true
            },
            flag:'add',
            listQuery:{
                deviceId:this.dataInfo.id,
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            alarmOptions:[],
            alarmLoading:false,
            userOptions:[],
            userLoading:false,
        }
    },
    created() {
        this.getList()
        this.getAlarmList()
        this.getUserList()
        remote("cycle").then(response => {
            this.options = response.data.result;
        });
        remote("notify_types").then(response => {
            this.typeOptions = response.data.result;
        });
    },
    mounted() {

    },
    computed: {
        // ...mapGetters(["notifyList"]),
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
        getAlarmList(){
            this.alarmLoading = true
            getAlarmObj(this.dataInfo.id).then(res => {
                this.alarmOptions = []
                let data = res.data.result.items
                data.forEach(element => {
                    let ele = {value:element.id,label:element.title}
                    this.alarmOptions.push(ele)
                });
                this.alarmLoading = false
            })
        },
        getUserList(){
            this.userLoading = true
            let data={
                device_id:this.dataInfo.id,
                project_id:this.$parent.$parent.projectInfo.id
            }
            getUserObj(data).then(res => {
                this.userOptions = []
                let data = res.data.result
                data.forEach(element => {
                    let ele = {value:element.id,label:element.name}
                    this.userOptions.push(ele)
                });
                this.userLoading = false
            })
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
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该通知, 是否继续?",
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
        handleAdd(formName){
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            data.deviceId = this.dataInfo.id
            data.puserIds = data.puserIds.join()
            this.createdLoading = true
            addObj(data).then(res => {
                this.getList(this.listQuery)
                this.$parent.$parent.$parent.$parent.alertNotify('添加')
                this.resetTem()
            })
        },
        resetTem(){
            this.form={
                alarmId:'',
                puserIds:[],
                cycle:'',
                notifyTypes:'',
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
