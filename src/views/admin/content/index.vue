<template>
    <div class="app-container calendar-list-container" id="messageContent">
        <el-form :model="form" class="clearfix" label-width="80px" ref="form" :rules="rules" label-position="left">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url" class="pull-left" style="width:45%">
                <el-input v-model="form.url" placeholder="URL"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="articleId" class="pull-right" style="width:45%">
                <!-- <el-input v-model="form.articleId" placeholder="分类"></el-input> -->
                <el-select v-model="form.articleId" size="small" placeholder="请选择分类">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="auther" class="pull-left" style="width:45%">
                <el-input v-model="form.auther" placeholder="作者"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="thumbnailBaseUrl" class="pull-right" style="width:45%">
                <el-upload
                class="avatar-uploader"
                ref="upload"
                :headers="headers"
                action="/file/attachment/upload"
                :limit="10"
                :data="params"
                name="uploadFile"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :auto-upload="true">
                <img v-if="form.thumbnailBaseUrl!='' && form.thumbnailBaseUrl!=undefined" :src="form.thumbnailBaseUrl+form.thumbnailPath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="标签" prop="tag" class="pull-left" style="width:45%">
                <el-input v-model="form.tag" placeholder="标签"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content" class="pull-left" style="width:100%">
                <my-editor ref="myeditor" :editor-content="form.content"></my-editor>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-button v-if="flag=='add'" type="primary" @click="onSubmit('form')" size="small" style="width:100px" :loading="createLoading">添加</el-button>
                <div v-else>
                    <el-button type="primary" @click="updataForm('form')" size="small" style="width:100px" :loading="createLoading">修改</el-button>
                    <el-button type="info" @click="cancelForm('form')" size="small" style="width:100px">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="classifyTemplatVisible = true">分类管理</el-button>
        <el-dialog title="分类管理" :visible.sync="classifyTemplatVisible" width='690px'>
            <classify @showCategoryOptions="getParentOptions" @showCategoryHash="getParentHash"></classify>
        </el-dialog>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="图片">
                    <template slot-scope="scope">
                        <div style="height:50px">
                        <img style="width:50px;height:50px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标题">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="URL">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类">
                    <template slot-scope="scope">
                        <span>{{categoryHash.get(scope.row.articleId)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="作者">
                    <template slot-scope="scope">
                        <span>{{scope.row.auther}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标签">
                    <template slot-scope="scope">
                        <span>{{scope.row.tag}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" style="margin-left: 0px;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>    
</template>
<script>
import {fetchList,delObj,addObj,updataObj,fetchCategoryList} from "@/api/content";
import myEditor from './editor'
import classify from "./classify";
import { getToken} from "@/util/auth";
import { toTree } from "@/util/util";
let Base64 = require('js-base64').Base64;
export default {
    components: {
        myEditor,
        classify
    },
    data() {
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息标题'));
            } else {
                callback();
            }
        };
        var validateMessage = (rule, value, callback) => {
            let val = this.$refs.myeditor.content
            if (val === '' || val== undefined) {
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
          url:'',
          articleId:'',
          auther:'',
          thumbnailBaseUrl:'',
          thumbnailPath:'',
          tag:'',
          content: '',
        },
        flag:'add',
        createLoading:false,
        headers:{Authorization: "Bearer " + getToken()},
        params:{component :'project'},
        classifyTemplatVisible:false,
        categoryOptions:null,
        categoryHash:null,
        list:[],
        loading:false,
        listQuery:{
            page_index: 1,
            page_size: 10
        },
        total:null
      }
    },
    created(){
        this.getAllList()
    },
    methods: {
        handleSizeChange(val){
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val){
            this.listQuery.page_index = val;
            this.getList();
        },
        getAllList(){
            this.listLoading = true
            Promise.all([fetchList(),fetchCategoryList()]).then(results => {
                let res1 = results[0],res2 = results[1]
                //产品列表
                this.list = res1.data.result.items
                this.total = res1.data.result.total
                //分类处理
                let data = res2.data.result.items
                let newMap = new Map();
                newMap.set(0,'无')
                for (let i=0; i<data.length; i++) {
                    newMap.set(data[i].id,data[i].name)
                }
                this.categoryHash = newMap
                this.categoryOptions = toTree(data)
                this.categoryOptions.unshift({value:0,label:'无'})
                this.listLoading = false
            });
        },
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                this.list = response.data.result.items;
                this.listLoading = false;
            });
        },
        getParentOptions(msg) {
            this.categoryOptions = msg
        },
        getParentHash(msg) {
            this.categoryHash = msg
        },
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailBaseUrl = response.result.baseUrl
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该产品, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList();
                    this.$notify({
                        title: "删除",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                })
            })
        },
        onSubmit(formName) {
            this.form.content = this.$refs.myeditor.content
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
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.$refs.myeditor.content = Base64.decode(row.content)
            this.form.status = this.form.status === 1?true:false
            this.cardVisibel = true
        },
        updataForm(formName){
            this.form.content = this.$refs.myeditor.content
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
            this.flag = 'add'
            this.form = {
                title: '',
                url:'',
                articleId:'',
                auther:'',
                thumbnailBaseUrl:'',
                thumbnailPath:'',
                tag:'',
                content: '',
            }
            this.$refs.myeditor.content = ''
            this.createLoading = false
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 100px;
     width: 100%
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    /* position: relative; */
    overflow: hidden;
    width: 100%
  }
  .el-upload.el-upload--text{
      width: 100%
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 100%;
    height: 100px;
    display: block;
    border-radius: 4px;
  }
</style>
