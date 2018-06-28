<template>
    <div>
        <h3>{{flag == 'add'?'添加':'修改'}}文件</h3>
        <el-form label-width="65px" :model="form" ref="form" :rules="rules">
            <el-form-item label="项目" prop="parentId">
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="文件" prop="fileBaseUrl">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="headers"
                    action="/project/project_file/upload"
                    :limit="10"
                    :data="params"
                    name="uploadFile"
                    :show-file-list ="false"
                    :on-success="uploadSuccess"
                    :file-list="fileList"
                    :auto-upload="true">
                        <el-button slot="trigger" size="small" type="primary">上传</el-button>
                        <el-input v-model="fileName" style="width:135px" size="small" placeholder="请上传文件" disabled></el-input>
                </el-upload>
            </el-form-item>
            <el-form-item label="标题" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>

                <el-checkbox label="公开" v-model="form.status" size="small"></el-checkbox>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" class="pull-right" @click="submitForm('form')" size="small" style="width:85px;">添加</el-button>
                <div v-else class="clearfix">
                    <el-button  type="primary" :loading="createLoading" class="pull-left" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
                    <el-button  type="info" class="pull-right" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getToken } from "@/util/auth";
import {addObj,updataObj} from "@/api/project_doc";

export default {
    props:['projectInfo'],
    data(){
        return {
            rules: {
                
                fileBaseUrl: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                comment: [
                    { required: false, message: '请输入备注', trigger: 'blur' }
                ]
            },
            form:{
                name:'',
                fileBaseUrl:'',
                filePath:'',
                comment:'',
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
                        this.$parent.$refs.doc.getList();
                        this.$parent.$parent.alertNotify('添加')
                        this.cancel()
                    })
                }else{
                    
                }
            })
            
        },
        uploadSuccess(response, file, fileList){
            this.form.fileBaseUrl = response.result.baseUrl
            this.form.filePath = response.result.path
            // this.fileName = response.result.name
            this.fileName = file.name
            this.fileList = []
        }, 
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.createLoading = true
                    updataObj(data).then(res => {
                        this.$parent.$refs.doc.getList();
                        this.$parent.$parent.alertNotify('修改')
                        this.cancel()
                    })
                }
            })
            
        },
        cancel(){
            this.flag = 'add'
            this.form = {
                name:'',
                fileBaseUrl:'',
                filePath:'',
                comment:'',
            }
            this.fileName = ''
            this.createLoading = false
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
