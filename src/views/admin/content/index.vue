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
                <el-input v-model="form.articleId" placeholder="分类"></el-input>
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
                <!-- <el-input v-model="form.content" type="textarea" :rows="5" placeholder="内容"></el-input> -->
                <my-editor ref="myeditor" :editor-content="form.content"></my-editor>
            </el-form-item>
            
            <el-form-item class="pull-right">
                <el-button type="primary" @click="onSubmit('form')" size="small" style="width:100px" :loading="createLoading">添加</el-button>
                <!-- <div> -->
                    <el-button type="primary" @click="updataForm('form')" size="small" style="width:100px" :loading="createLoading">修改</el-button>
                    <el-button type="info" @click="cancelForm('form')" size="small" style="width:100px">取消</el-button>
                <!-- </div> -->
            </el-form-item>
        </el-form>
    </div>    
</template>
<script>
import {fetchList,delObj} from "@/api/content";
import myEditor from './editor'
import { getToken} from "@/util/auth";
export default {
    components: {
        myEditor
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
        createLoading:false,
        headers:{Authorization: "Bearer " + getToken()},
        params:{component :'project'},
      }
    },
    created(){
        if(this.$route.query.contentInfo!=undefined)this.form = this.$route.query.contentInfo
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
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailUrl = response.result.baseUrl
            this.imageName = response.result.name
            this.fileList = []
        },
        onSubmit(formName) {
            this.content = this.$refs.myeditor.content
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
            this.form = Object.assign({},row)
            this.form.status = this.form.status === 1?true:false
            this.cardVisibel = true
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
