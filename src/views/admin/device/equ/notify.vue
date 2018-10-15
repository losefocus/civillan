<template>
    <div>
        <div class="clearfix addBtn" style="padding-bottom:20px;">
            <el-button type="primary" size="mini" v-show="!isshow"  class="pull-left" @click="isshow = !isshow" >添加</el-button>
            <el-button type="info" size="mini" v-show="isshow" class="pull-left" @click="cancelEdit" style="margin-left:0">取消</el-button>
        </div>
        <div style="padding-bottom:10px;">设 备 : {{dataInfo.name}}</div>
        <el-collapse-transition>
            <div v-show="isshow">
                <el-form :model="form" class="clearfix" :rules="rules" ref="form" label-width="70px" size="mini">
                    <el-form-item label="报警条目" prop="alarmId" style="width: 310px">
                        <el-select v-model="form.alarmId" placeholder="请选择报警条目" size="mini" :loading="alarmLoading" no-data-text="请先添加报警条目">
                            <el-option
                            v-for="item in alarmOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="通知频率" prop="cycle" style="width: 310px;margin-left:30px">
                        <el-select v-model="form.cycle" placeholder="请选择通知频率" size="mini" no-data-text="请先添加通知频率">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="通知对象" prop="puserIds" style="width: 310px">
                        <el-select v-model="form.puserIds" multiple placeholder="请选择通知对象" size="mini" :loading="userLoading" no-data-text="请先添加通知对象">
                            <el-option
                            v-for="item in userOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="通知方式" prop="notifyTypes" style="width: 310px;margin-left:30px">
                        <el-select v-model="form.notifyTypes" placeholder="请选择通知方式" size="mini" no-data-text="请先添加通知方式">
                            <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  style="width: 140px;padding-top:5px" class="pull-right">
                        <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">保存</el-button>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-checkbox v-model="form.status" >已启用</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
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
                <el-table-column align="center" label="通知频率">
                    <template slot-scope="scope">
                        <span>{{scope.row.cycle}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="60">
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="80" style="float:right">
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
  import {mapGetters} from "vuex";
  import {remote} from "@/api/dict";
  import {addObj, delObj, editObj, getAlarmObj, getObj, getUserObj} from "@/api/device/notify";

  export default {
    props:['dataInfo'],
    data(){
        var validataAlarmId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择报警条目'));
            }else {
                callback();
            }
        };
        var validataPuserIds = (rule, value, callback) => {
            if (value.length == 0) {
                callback(new Error('请选择通知对象'));
            }else {
                callback();
            }
        };
        var validataCycle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知频率'));
            }else {
                callback();
            }
        };
        var validataNotifyTypes = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知方式'));
            }else {
                callback();
            }
        };
        return {
            rules: {
                alarmId: [{ validator: validataAlarmId, trigger: 'change' }],
                puserIds: [{ validator: validataPuserIds, trigger: 'change' }],
                cycle: [{ validator: validataCycle, trigger: 'change' }],
                notifyTypes: [{ validator: validataNotifyTypes, trigger: 'change' }],
            },
            isshow:false,
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
            this.listLoading = true
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
            //this.resetTem()
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
            this.$refs.form.validate(valid => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    data.deviceId = this.dataInfo.id
                    data.puserIds = data.puserIds.join()
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList(this.listQuery)
                        this.$parent.$parent.$parent.$parent.alertNotify('添加')
                        this.cancelEdit()
                    })
                }
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
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
            this.isshow = false
            this.$refs.form.resetFields()
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
    margin-bottom: 15px
}
.addBtn{
    position: absolute;
    top: 20px;
    left: 120px;
  }
</style>
