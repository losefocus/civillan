<template>
    <div>
        <div class="clearfix addBtn" style="padding-bottom:20px;">
            <el-button type="primary" size="mini" v-show="!isshow"  class="pull-left" @click="isshow = !isshow" >添加</el-button>
            <el-button type="info" size="mini" v-show="isshow" class="pull-left" @click="cancelEdit" style="margin-left:0">取消</el-button>
        </div>
        <div style="padding-bottom:10px;">设备名称: {{dataInfo.name}}</div>
        <el-collapse-transition>
            <div v-show="isshow">
                <el-form :model="form" class="clearfix" ref="form" :rules="rules" label-width="70px" size="mini">
                    <el-form-item label="报警标题" prop="title" style="width: 310px">
                        <el-input v-model="form.title" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="报警周期" prop="cycle" style="width: 310px;;margin-left:30px">
                        <el-select v-model="form.cycle" placeholder="请选择" size="mini" style="width:100%" no-data-text="请先添加报警周期">
                            <el-option
                            v-for="item in dicts"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报警内容" prop="triggerMessage" style="width: 310px">
                        <el-input v-model="form.triggerMessage" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="恢复内容" prop="recoverMessage" style="width: 310px;margin-left:30px">
                        <el-input v-model="form.recoverMessage" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="触发条件" prop="condition" style="width: 310px;">
                        <el-input v-model="form.condition" type="textarea" :rows="2" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="报警级别" prop="level" style="width: 310px;margin-left:30px;margin-bottom:38px">
                        <el-select v-model="form.level" placeholder="请选择" size="mini" style="width:100%" no-data-text="请先添加报警级别">
                            <el-option
                            v-for="item in alarmDicts"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" style="width: 310px;">
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
                    <el-form-item class="pull-right" style="padding-top:5px;">
                        <el-checkbox v-model="form.status" >已启用</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
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
                <el-table-column align="center" label="报警级别" width="90">
                    <template slot-scope="scope">
                        <span>{{levelMap.get(scope.row.level)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="60">
                    <template slot-scope="scope">
                        <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" style="margin-left:0">删除</el-button>
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
  import {findByvalue} from "@/util/util";
  import {addObj, delObj, editObj, getObj} from "@/api/device/alarm";

  export default {
    props:['dataInfo'],
    data(){
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入报警标题'));
            } else {
                callback();
            }
        };
        var validateCycle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择报警周期'));
            } else {
                callback();
            }
        };
        var validateTrigger = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入报警内容'));
            } else {
                callback();
            }
        };
        var validateRecover = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入恢复内容'));
            } else {
                callback();
            }
        };
        var validateCondition = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入触发条件'));
            } else {
                callback();
            }
        };
        var validateLevel = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择报警级别'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                title: [{ validator: validateTitle,trigger: 'blur' }],
                cycle: [{ validator: validateCycle,trigger: 'change' }],
                triggerMessage: [{ validator: validateTrigger,trigger: 'blur' }],
                recoverMessage: [{ validator: validateRecover,trigger: 'blur' }],
                condition: [{ validator: validateCondition,trigger: 'blur' }],
                level: [{ validator: validateLevel,trigger: 'change' }],
            },
            isshow:false,
            listLoading:false,
            createdLoading:false,
            dicts:[],
            alarmDicts:[],
            form:{
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
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
            levelMap:null,
        }
    },
    created() {
        remote("cycle").then(response => {
            this.dicts = response.data.result;
        });
        remote("alarm_level").then(response => {
            this.alarmDicts = response.data.result;
            this.levelMap = new Map()
            this.alarmDicts.forEach(res=>{
                this.levelMap.set(res.value,res.label)
            })
        });
    },
    mounted() {
        this.getList()
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
            this.listLoading = true
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
            this.resetTem()
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
            this.form.cycle = this.form.cycle+''
            this.isshow = true
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该警报(警报标题:" + row.title + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList(this.listQuery)
                    this.$notify({
                        title: '成功',
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                })
            })
        },
        handleAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    // data.sort = parseInt(data.sort)
                    data.status = data.status?1:0
                    data.deviceId = this.dataInfo.id
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList(this.listQuery)
                        this.$notify({
                            title: '成功',
                            message: "添加成功",
                            type: "success",
                            duration: 2000
                        });
                        this.resetTem()
                    }).catch(err => {
                        this.createdLoading = false
                    })
                }
            })
        },
        handleEdit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.createdLoading = true
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    editObj(data).then(res => {
                        this.getList(this.listQuery)
                        this.$notify({
                            title: '成功',
                            message: "修改成功",
                            type: "success",
                            duration: 2000
                        });
                        this.cancelEdit()
                    }).catch(err => {
                        this.createdLoading = false
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
                title:'',
                condition:'',
                triggerMessage:'',
                recoverMessage:'',
                comment:'',
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
