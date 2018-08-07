<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}影像</h3><span>{{(flag == 'add')?'Add':'Edit'}} Document</span></div>
        <el-form label-width="55px" :model="form" ref="form" :rules="rules" label-position="left">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入标题"></el-input>
            </el-form-item>
            <!-- <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择" size="small">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="地址" prop="url">
                <el-input v-model="form.url" size="small" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="缩略图" prop="thumbnailBaseUrl">
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
            <el-form-item label="备注" prop="comment">
                <el-input
                style="margin-top:4px"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="公开" v-model="form.status" size="small"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
                <el-button type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getToken } from "@/util/auth";
import {addObj,updataObj} from "@/api/project_moni";

export default {
    props:['projectInfo'],
    data(){
        var validataFileBaseUrl = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请添加文件'));
            }else{
                callback()
            }
        }
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入项目名称'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                fileBaseUrl: [
                    {  validator: validataFileBaseUrl, trigger: 'blur' }
                ],
                name: [
                    {  validator: validataName, trigger: 'blur' }
                ]
            },
            typeOptions:[
                {
                value: 1,
                label: '图片资料'
                },{
                value: 2,
                label: '视频资料'
                },{
                value: 3,
                label: '全景图片'
                }
            ],
            form:{
                name:'',
                url:'',
                comment:'',
                status:true
            },
            createLoading:false,
            fileName:'',
            fileList:[],
            flag:'add',
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            uploadLoaing_:false,
        }
    },
    created() {},
    mounted() {},
    computed: {},
    methods:{
        beforeUpload(){
            this.uploadLoaing = true
        },
        uploadSuccess(response, file, fileList){
            if(this.form.type == 3){
                this.url = response.result.baseUrl + response.result.path
            }else{
                this.form.thumbnailPath = response.result.path
                this.form.thumbnailBaseUrl = response.result.baseUrl
            }
            this.uploadLoaing = false
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    data.projectId = this.projectInfo.id
                    this.createLoading = true
                    addObj(data).then(res => {
                        this.$parent.$parent.$refs.moni.getList();
                        this.$parent.$parent.$parent.alertNotify('添加')
                        this.cancel()
                    })
                }else{
                    
                }
            })
            
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.createLoading = true
                    console.log(data)
                    updataObj(data).then(res => {
                        this.$parent.$parent.$refs.moni.getList();
                        this.$parent.$parent.$parent.alertNotify('修改')
                        this.cancel()
                    })
                }
            })
            
        },
        cancel(){
            this.flag = 'add'
            this.createLoading = false
            this.resetTemp()
            this.$parent.$parent.cardVisibel = false
        },
        resetTemp() {
            this.form = {
                name:'',
                url:'',
                comment:'',
                status:true
            }
            this.uploadLoaing = false
            this.$refs.form.resetFields()
        }
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
.avatar-uploader{
     height: 110px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 203px;
    height: 110px;
    line-height: 110px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 203px;
    height: 110px;
    display: block;
    border-radius: 4px;
  }
</style>
