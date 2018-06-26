<template>
    <div>
        <h3>{{flag == 'add'?'添加':'修改'}}设备</h3>
        <el-form label-width="40px" :model="form"  ref="form">
            <el-form-item label="项目" >
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="productId_alias">
                <el-select v-model="productId_alias" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分组" prop="deviceGroup">
                <el-input v-model="form.deviceGroup.id" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="固件" prop="firmware">
                <el-input v-model="form.firmware" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="图片">
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
            <el-form-item label="备注" prop="comment">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="form.comment">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
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
import {addObj,fetchProductList,updataObj} from "@/api/project_equ";
export default {
    props:['projectInfo'],
    data(){
        return {
            rules: {
                parentId: [
                    { required: false, message: '请选择父级项目', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                tm: [
                    { required: true, message: '请选择工期', trigger: 'blur' }
                ],
                adminer: [
                    { required: true, message: '请选择管理员', trigger: 'change' }
                ],
                thumbnailPath: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '请选择位置', trigger: 'blur' }
                ],
                comment: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            listLoading:false,
            createLoading:false,
            listQuery:{
                page_index:1,
                page_size:20,
            },
            list:[],
            total:null,
            form:{
                projectId:'',
                productId:'',
                alias:'',
                name:'',
                firmware:'',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
                comment:'',
                status:0,
                deviceGroup:{
                    id:''
                }
            },
            productId_alias:'',
            imageName:'',
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            flag:'add',
            productOptions:[],
        }
    },
    created() {
        this.getProductList()
    },
    mounted() {

    },
    computed: {},
    methods:{
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailBaseUrl = response.result.baseUrl
            this.imageName = response.result.name
            this.fileList = []
        },
        getProductList(){
            fetchProductList().then(res => {
                let data = res.data.result.items
                this.productOptions = []
                data.forEach(ele => {
                    let item = {value:ele.id +','+ele.alias, label:ele.alias}
                    this.productOptions.push(item)
                });
                console.log(this.productOptions)
            })
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.projectId = this.projectInfo.id
            data.status = data.status?1:0
            data.deviceGroup.id = 1
            data.productId = this.productId_alias.split(',')[0],
            data.alias = this.productId_alias.split(',')[1],
            data.protocol = "string",
            data.passage = "string",
            addObj(data).then( res => {
                this.createLoading = false
                this.$parent.$refs.equ.getList()
                this.resetTemp()
                this.$parent.$parent.alertNotify('添加')
            })
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.status = this.form.status?1:0
                    this.form.productId = this.productId_alias.split(',')[0],
                    this.form.alias = this.productId_alias.split(',')[1],
                    console.log(this.form)
                    this.createLoading = true
                    updataObj(this.form).then(response => {
                        this.createLoading = false
                        this.$parent.$refs.equ.getList()
                        this.resetTemp()
                        this.$parent.$parent.alertNotify('修改')
                    })
                }
            });
        },
        cancel(formName){
            this.flag = 'add'
            this.resetTemp()
            this.createLoading = false
        },
        resetTemp() {
            this.form={
                projectId:'',
                productId:'',
                alias:'',
                name:'',
                firmware:'',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
                comment:'',
                status:0,
                deviceGroup:{
                    id:''
                }
            }
            this.productId_alias = ''
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 218px;
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
    width: 218px;
    height: 218px;
    line-height: 218px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
.avatar {
    width: 218px;
    height: 218px;
    display: block;
    border-radius: 4px;
}
.el-form-item{
    margin-bottom: 15px
}
.addNewProject{
    width: 260px;
    border: 1px solid #ebeef5;
    padding: 10px 20px 0 20px
}
.el-form-item__error{
    padding-top: 0 !important
}
</style>
