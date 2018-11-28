<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}监控</h3><span>{{(flag == 'add')?'Add':'Edit'}} Monitoring</span></div>
        <el-form label-width="55px" :model="form" :rules="rules"  ref="forms" label-position="left">
            <el-form-item label="分类" prop="categoryId">
                <el-select v-model="form.categoryId" size="small" placeholder="请选择分类" no-data-text="请先添加分类">
                    <el-option
                    v-for="item in moniCategoryOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input v-model="form.url" size="small" placeholder="请输入url地址"></el-input>
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
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('forms')" size="small" style="width:85px;">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updateForm('forms')" size="small" style="width:85px;">保存</el-button>
                <el-button  type="info" @click="cancel('forms')" size="small" style="width:85px;">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
  import {mapGetters,mapState} from "vuex";
  import {getToken} from "@/util/auth";
  import {addObj, updateObj} from "@/api/project_monitoring";

  export default {
    props:['projectInfo'],
    data(){
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入名称'));
            }else{
                callback()
            }
        }
        var validatacategoryId = (rule, value, callback) => {
            if(value== undefined || value.length == 0){
                callback(new Error('请选择分类'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                categoryId: [
                    { validator: validatacategoryId, trigger: 'change' },
                ],
                name: [
                    {  validator: validataName, trigger: 'blur' },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
                ],
            },
            form:{
                status:true
            },
            duplication_username:false,
            duplication_phone:false,
            usernameDisabled:false,
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            role:'',
            flag:'add',
            organOptions:[],
            createLoading:false,
            userPhone:null,
            userName:null,
        }
    },
    created() {
        
    },
    mounted() {

    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
        ...mapGetters(["moniCategoryOptions"]),
    },
    methods:{
        beforeUpload(file){
            const isLt3M = file.size / 1024 / 1024 < 3; //文件大小3M
            if(!isLt3M){
                this.$message.error('上传图片大小不能超过 3MB!');
            }else{
                this.uploadLoaing = true
            }
            return isLt3M;
        },
        uploadSuccess(response, file, fileList){
            if(response.success == false){
                this.$notify.error({
                    title: '错误',
                    message: '图片获取失败'
                });
            }else{
                this.form.thumbnailPath = response.result.path
                this.form.thumbnailBaseUrl = response.result.baseUrl
            }
            this.uploadLoaing = false
        },
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.projectId = this.projectInfo.id
                    data.status = data.status?1:0
                    this.createLoading = true
                    addObj(data).then((res) => {
                        if(res.data.success == true){
                            this.$parent.$parent.$refs.monitoring.getList()
                            this.cancel()
                            this.$parent.$parent.$parent.alertNotify('添加')
                        }else{
                            this.$notify({
                                title: '错误',
                                message: res.data.message,
                                type: 'error'
                            });
                            this.createLoading = false
                        }
                        
                    });
                } else {
                    return false;
                }
            });
        },
        updateForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = this.form.status?1:0
                    this.createLoading = true
                    updateObj(data).then(response => {
                        this.$parent.$parent.$refs.monitoring.getList()
                        this.cancel()
                        this.$parent.$parent.$parent.alertNotify('修改')
                    })
                }
            });
        },
        cancel(formName){
            this.flag = 'add'
            this.resetTemp()
            this.$parent.$parent.cardVisibel = false
        },
        resetTemp() {
            this.createLoading = false
            this.form={
                status:true
            }
            this.$refs.forms.resetFields()
        },

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
