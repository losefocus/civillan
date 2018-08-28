<template>
    <div class="app-container calendar-list-container" id="messageContent">
        <el-collapse-transition>
        <div v-show="isshow">
            <el-form  :model="form" class="clearfix" label-width="80px" ref="form" :rules="rules" label-position="left">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="categoryId" class="pull-left" style="width:45%">
                    <el-select v-model="form.categoryId" placeholder="请选择分类" >
                        <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="URL" prop="url" class="pull-right" style="width:45%">
                    <el-input v-model="form.url" placeholder="URL"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author" class="pull-left" style="width:45%">
                    <el-input v-model="form.author" placeholder="作者"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="thumbnailBaseUrl" class="pull-right" style="width:45%">
                    <el-upload
                    v-loading='uploadLoaing'
                    class="avatar-uploader"
                    ref="upload"
                    :headers="headers"
                    action="/file/attachment/upload"
                    :limit="999"
                    :data="params"
                    name="uploadFile"
                    :show-file-list="false"
                    :before-upload='beforeUpload'
                    :on-success="uploadSuccess"
                    :auto-upload="true">
                    <img v-if="form.thumbnailBaseUrl!='' && form.thumbnailBaseUrl!=undefined" :src="form.thumbnailBaseUrl+form.thumbnailPath" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="标签" prop="tagIds" class="pull-left" style="width:45%">
                    <el-select v-model="tagIds" multiple placeholder="请选择" @change="changeTag">
                        <el-option
                        v-for="item in tagOptions"
                        :key="item.id"
                        :label="item.tagName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content" class="pull-left" style="width:100%">
                    <my-editor ref="myeditor" :editor-content="form.content"></my-editor>
                </el-form-item>
                <el-form-item class="pull-right">
                    <el-button v-if="flag=='add'" type="primary" @click="onSubmit('form')" size="small" :loading="createLoading">保存</el-button>
                    <div v-else>
                        <el-button type="primary" @click="updataForm('form')" size="small" :loading="createLoading">修改</el-button>
                        <el-button type="info" @click="cancelForm('form')" size="small" >取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        </el-collapse-transition>
        <el-button type="primary" size="small" @click="classifyTemplatVisible = true">分类管理</el-button>
        <el-button type="primary" size="small" @click="tagTemplatVisible = true">标签管理</el-button>
        <el-button type="primary" size="small" v-show="!isshow"  class="pull-right" @click="isshow = !isshow" style="width:80px;">添加</el-button>
        <el-button type="info" size="small" v-show="isshow" class="pull-right" @click="cancelForm" style="width:80px;">取消</el-button>
        
        <div v-loading="listLoading">
            <el-table :data="list" fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="图片" width="90">
                    <template slot-scope="scope">
                        <div style="height:40px">
                        <img v-if="scope.row.thumbnailBaseUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        <img v-else style="width:60px;height:40px" src="../../../assets/img/no_pic.png">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="标题" min-width="120">
                    <template slot-scope="scope">
                        <span style="white-space:nowrap;cursor: pointer;">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="URL" min-width="120">
                    <template slot-scope="scope">
                        <span style="white-space:nowrap;cursor: pointer;">{{scope.row.url}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类">
                    <template slot-scope="scope">
                        <span>{{categoryHash.get(scope.row.categoryId)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="作者">
                    <template slot-scope="scope">
                        <span>{{scope.row.author}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标签">
                    <template slot-scope="scope">
                        <el-tag type="info" size="mini" style="margin-left:5px" v-for="(item,index) in scope.row.articleTags" :key="index">{{item.tagName}}</el-tag>
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
        <el-dialog title="分类管理" :visible.sync="classifyTemplatVisible" width='690px'>
            <classify v-if="classifyTemplatVisible" @showCategoryOptions="getParentOptions" @showCategoryHash="getParentHash"></classify>
        </el-dialog>
        <el-dialog title="标签管理" :visible.sync="tagTemplatVisible" width='690px'>
            <tag v-if="tagTemplatVisible" @showTagOptions="getTagOptions" @showTagHash="getTagHash"></tag>
        </el-dialog>
    </div>    
</template>
<script>
  import {addObj, delObj, fetchCategoryList, fetchList, fetchTagList, getObj, updataObj} from "@/api/content";
  import myEditor from './editor'
  import classify from "./classify";
  import tag from "./tag";
  import {getToken} from "@/util/auth";
  import {toTree} from "@/util/util";

  let Base64 = require('js-base64').Base64;
export default {
    components: {
        myEditor,
        classify,
        tag
    },
    data() {
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息标题'));
            } else {
                callback();
            }
        };
        var validateCategory = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择分类'));
            } else {
                callback();
            }
        };
        var validateTag = (rule, value, callback) => {
            if (value.length === 0 ) {
                callback(new Error('请选择标签'));
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
        isshow:false,
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
            categoryId:[
                 { validator: validateCategory, message: '请选择分类', trigger: 'blur' },
            ],
            tagIds:[
                 { validator: validateTag, message: '请选择标签', trigger: 'change' },
            ],
            content: [
                { validator: validateMessage, message: '请输入消息内容', trigger: 'blur' }
            ],
        },
        form: {
          title: '',
          url:'',
          categoryId:'',
          author:'',
          thumbnailBaseUrl:'',
          thumbnailPath:'',
          tagIds:[],
          content: '',
        },
        tagIds:[],
        flag:'add',
        createLoading:false,
        headers:{Authorization: "Bearer " + getToken()},
        params:{component :'project'},
        uploadLoaing:false,
        classifyTemplatVisible:false,
        tagTemplatVisible:false,
        categoryOptions:null,
        categoryHash:null,
        tagOptions:null,
        tagHash:null,
        list:[],
        loading:false,
        listQuery:{
            page_index: 1,
            page_size: 20
        },
        total:null,
        allListQuery:{
            page_index: 1,
            page_size: 99999
        }
      }
    },
    created(){
        this.getAllList()
        
    },
    methods: {
        changeTag(){
            this.form.tagIds = this.tagIds
        },
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
            this.listQuery.sort_by = "created_at";
            this.listQuery.direction = 'asc';
            Promise.all([fetchList(this.listQuery),fetchCategoryList(this.allListQuery),fetchTagList(this.allListQuery)]).then(results => {
                let res1 = results[0],res2 = results[1],res3 = results[2]
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
                // 标签
                this.tagOptions = res3.data.result.items
            });
        },
        getList(){
            this.listLoading = true
            this.listQuery.sort_by = "created_at";
            this.listQuery.direction = 'asc';
            fetchList(this.listQuery).then(response => {
                this.list = response.data.result.items;
                this.total = response.data.result.total
                this.listLoading = false;
            });
        },
        getParentOptions(msg) {
            this.categoryOptions = msg
        },
        getParentHash(msg) {
            this.categoryHash = msg
        },
        getTagOptions(msg) {
            this.tagOptions = msg
        },
        getTagHash(msg) {
            this.tagHash = msg
        },
        beforeUpload(){
            this.uploadLoaing = true
        },
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailBaseUrl = response.result.baseUrl
            this.uploadLoaing = false
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
                    data.tagIds = this.tagIds
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
            this.isshow = true
            this.form = Object.assign({},row)
            let tags = this.form.articleTags
            this.tagIds = []
            tags.forEach(ele => {
                this.tagIds.push(ele.id)
            });
            this.form.tagIds = this.tagIds
            getObj(this.form.id).then(res => {
                this.$refs.myeditor.content = Base64.decode(res.data.result.content)
            })
        },
        updataForm(formName){
            this.form.content = this.$refs.myeditor.content
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let data = Object.assign({},this.form)
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
                categoryId:'',
                author:'',
                thumbnailBaseUrl:'',
                thumbnailPath:'',
                tagIds:[],
                content: '',
            }
            this.tagIds = []
            this.$refs.myeditor.content = ''
            this.createLoading = false
            this.isshow = false
            this.$refs.form.resetFields();
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 100px;
     width: 180px
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    /* position: relative; */
    overflow: hidden;
    width: 180px
  }
  .el-upload.el-upload--text{
      width: 180px
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 180px;
    height: 100px;
    display: block;
    border-radius: 4px;
  }
</style>
