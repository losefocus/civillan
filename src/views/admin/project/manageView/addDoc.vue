<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}文件</h3><span>{{(flag == 'add')?'Add':'Edit'}} Document</span></div>
        <el-form label-width="55px" :model="form" ref="form" :rules="rules" label-position="left">
            <el-form-item label="标题" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文件" prop="fileBaseUrl" >
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="headers"
                    action="/project/project_file/upload"
                    :limit="999"
                    :data="params"
                    name="uploadFile"
                    :show-file-list ="false"
                    :before-upload='beforeUpload'
                    :on-success="uploadSuccess"
                    :file-list="fileList"
                    :auto-upload="true">
                        <el-input class="pull-left" v-model="fileName" style="width:135px" size="small" placeholder="请选择文件" disabled></el-input>
                        <el-button slot="trigger" style="margin:4px 0 0 10px" size="small" type="primary">选择</el-button>
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
  import {getToken} from "@/util/auth";
  import {addObj, updataObj} from "@/api/project_doc";

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
            form:{
                name:'',
                fileBaseUrl:'',
                filePath:'',
                comment:'',
                status:true
            },
            createLoading:false,
            fileName:'',
            fileList:[],
            flag:'add',
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project',project_id:this.projectInfo.id},
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
        selectParentId(){},
        selectAdminer(){},
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    data.projectId = this.projectInfo.id
                    this.createLoading = true
                    addObj(data).then(res => {
                        this.$parent.$parent.$refs.doc.getList();
                        this.$parent.$parent.$parent.alertNotify('添加')
                        this.cancel()
                    }).catch(err => {
                        this.createLoading = false
                    })
                }else{
                    
                }
            })
            
        },
        beforeUpload(file){
            const isLt3M = file.size / 1024 / 1024 < 3; //文件大小3M
            if(!isLt3M){
                this.$message.error('上传文件大小不能超过 3MB!');
            }else{
                // this.uploadLoaing = true
            }
            return isLt3M;
        },
        uploadSuccess(response, file, fileList){
            if(response.success == false){
                this.$notify.error({
                    title: '错误',
                    message: '文件获取失败'
                });
            }else{
                this.form.fileBaseUrl = response.result.baseUrl
                this.form.filePath = response.result.path
                // this.fileName = response.result.name
                this.fileName = file.name
                this.fileList = []
            }
        }, 
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.createLoading = true
                    updataObj(data).then(res => {
                        this.$parent.$parent.$refs.doc.getList();
                        this.$parent.$parent.$parent.alertNotify('修改')
                        this.cancel()
                    }).catch(err => {
                        this.createLoading = false
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
                fileBaseUrl:'',
                filePath:'',
                comment:'',
                status:true
            }
            this.fileName = ''
            this.$refs.form.resetFields()
        }
    }
}
</script>
<style scoped>
.el-form-item{
    margin-bottom: 15px
}
.addNewProject{
    width: 260px;
    border: 1px solid #dcdfe6;
    padding: 10px 20px 0 20px
}
.el-form-item__error{
    padding-top: 0 !important
}
</style>
