<template>
    <div class="app-container calendar-list-container">
        <!-- <el-form :model="form" class="clearfix" label-width="80px" ref="form" :rules="rules" label-position="left">
            <el-form-item label="常见问题" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input v-model="form.content" type="textarea" :rows="5" placeholder="内容"></el-input>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-button v-if="flag == 'add'" type="primary" @click="onSubmit('form')" size="small" style="width:100px" :loading="createLoading">添加</el-button>
                <div v-else>
                    <el-button type="primary" @click="updataForm('form')" size="small" style="width:100px" :loading="createLoading">修改</el-button>
                    <el-button type="info" @click="cancelForm('form')" size="small" style="width:100px">取消</el-button>
                </div>
            </el-form-item>
        </el-form> -->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading">
            <el-table-column align="center" label="标题" >
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="内容" >
                <template slot-scope="scope">
                    <span>{{ scope.row.content }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="创建人">
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="标签">
                <template slot-scope="scope">
                    <span>{{ scope.row.tag }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="" plain @click="handleUpdata(scope.row)">修改</el-button>
                    <el-button size="mini" type="" plain @click="handleDel(scope.row)" style="margin-left:0">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container" style="margin-top:20px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>    
</template>
<script>
import {fetchList,addObj,delObj,updataObj} from "@/api/help";
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
            content: [
                { validator: validateMessage, message: '请输入消息内容', trigger: 'blur' }
            ],
        },
        form: {
          title: '',
          content: '',
        },
        listQuery:{
            page_index:1,
            page_size:10,
        },
        total:null,
        listLoading:false,
        createLoading:false,
        list:[],
        userIds:[],
        flag:'add'
      }
    },
    created(){
        this.getList()
    },
    methods: {
        handleSizeChange(){
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(){
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
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
                    this.createLoading = true
                    addObj(data).then(res => {
                        this.getList()
                        this.cancelForm()
                        this.$notify({
                            title: "添加",
                            message: "添加成功",
                            type: "success",
                            duration: 2000
                        });
                    })
                }
            })
        },
        handleUpdata(row){
            this.flag = 'updata'
            this.form = Object.assign({},row)
            this.form.status = this.form.status === 1?true:false
            this.cardVisibel = true
            this.$router.push({ path: '/admin/content' ,query: {contentInfo: this.form}})
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    updataObj(data).then(res => {
                        this.getList();
                        this.cancelForm()
                        this.$notify({
                            title: "修改",
                            message: "修改成功",
                            type: "success",
                            duration: 2000
                        });
                    })
                }
            })    
            
        },
        cancelForm(){
            this.form = {
                title: '',
                content: '',
            }
            this.flag = 'add'
            this.createLoading = false
        }
    }
}
</script>
<style scoped>

</style>
