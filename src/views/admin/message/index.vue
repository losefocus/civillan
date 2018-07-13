<template>
    <div class="app-container calendar-list-container">
        <el-form :model="form" class="clearfix" label-width="80px" ref="form" :rules="rules">
            <el-form-item label="消息标题" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="消息内容" prop="message">
                <el-input v-model="form.message" type="textarea" :rows="3" placeholder="内容"></el-input>
            </el-form-item>
            <el-form-item label="通知对象" prop="pushObject" class="pull-left" style="width:45%">
                <el-select v-model="form.pushObject" placeholder="通知对象">
                    <el-option label="后台用户" value="1"></el-option>
                    <el-option label="前台用户" value="2"></el-option>
                    <el-option label="设备" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知方式" prop="pushType" class="pull-right" style="width:45%">
                <el-select v-model="form.pushType" placeholder="通知对象">
                    <el-option label="web" value="1"></el-option>
                    <el-option label="app" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-button type="primary" @click="onSubmit('form')" size="small" style="width:100px">推送</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" border style="width: 100%" v-loading="listLoading">
            <el-table-column align="center" label="消息标题" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="消息内容" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.message }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推送时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推送人">
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="通知对象">
                <template slot-scope="scope">
                    <span>{{ scope.row.pushObject }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" plain @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container" style="margin-top:20px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>    
</template>
<script>
import {fetchList,pushObj,delObj,fetchUserList} from "@/api/notification";
export default {
    data() {
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息标题'));
            } else {
                callback();
            }
        };
        var validateMessage = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息内容'));
            } else {
                callback();
            }
        };
        var validateObject = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知对象'));
            } else {
                callback();
            }
        };
        var validateType = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择通知方式'));
            } else {
                callback();
            }
        };
    return {
        pushObjectOptions:[{
            value:1,
            label:'后台用户'
        },{
            value:2,
            label:'前台用户'
        },{
            value:3,
            label:'设备'
        },],
        rules:{
            title: [
                { validator: validateTitle, message: '请输入消息标题', trigger: 'blur' },
            ],
            message: [
                { validator: validateMessage, message: '请输入消息内容', trigger: 'blur' }
            ],
            pushObject: [
                { validator: validateObject, message: '请选择通知对象', trigger: 'change' }
            ],
            pushType: [
                { validator: validateType, message: '请选择通知方式', trigger: 'change' }
            ],
        },
        form: {
          title: '',
          message: '',
          pushObject:null,
          pushType:null
        },
        listQuery:{
            page_index:1,
            page_size:10,
        },
        total:null,
        listLoading:false,
        list:[],
        userIds:[]
      }
    },
    created(){
        this.getUserList()
        this.getList()
        
    },
    methods: {
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        getUserList(){
            this.userId = []
            fetchUserList().then(res => {
                res.data.result.items.forEach(element => {
                    this.userIds.push(element.id)
                });
                
            })
        },
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                this.restTemp()
            })
        },
        handleDel(row){
            this.$confirm(
                "此操作将永久删除该项目(项目名:" + row.title + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.$notify({
                        title: "删除",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                    this.getList()
                })
            })
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.pushObject = parseInt(data.pushObject)
                    if(data.pushObject === 2){
                        if(this.userIds.length !=0)data.userIds = this.userIds.join(',')
                        else {
                            this.$message({
                                message: '缺少前台用户信息',
                                type: 'warning'
                            });
                            return
                        }
                    }
                    pushObj(data).then(res => {
                        this.getList()
                    })
                }
            })
        },
        restTemp(){
            this.form = {
                title: '',
                message: '',
                pushObject:null,
                pushType:null
            }
        }
    }
}
</script>
<style scoped>

</style>
