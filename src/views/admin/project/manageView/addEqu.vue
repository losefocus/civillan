<template>
    <div>
        <h3>添加机构</h3>
        <el-form label-width="65px" :model="form"  ref="form">
            <el-form-item label="项目" >
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="分组" prop="address">
                <el-input v-model="form.address" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="contact">
                <el-input v-model="form.contact" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="固件" prop="phone">
                <el-input v-model="form.phone" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="thumbnailPath">
                <el-upload
                class="upload-demo"
                ref="upload"
                :headers="headers"
                action="/file/attachment/upload"
                :limit="10"
                :data="params"
                name="uploadFile"
                :show-file-list ="false"
                :on-success="uploadSuccess"
                :file-list="form.fileList"
                :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选取</el-button>
                    <el-input v-model="form.imageName" style="width:135px" size="small" placeholder="请选取图片"></el-input>
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
                </div>                 </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getToken } from "@/util/auth";
import {addObj} from "@/api/project_equ";
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
            form:{
                parentId:null,
                name:'',
                tm:'',
                adminer:'',
                thumbnailPath:'',
                thumbnailUrl:'',
                imageName:'',
                position:'',
                comment:'',
                status:0,
                fileList: []
            },
            parentIdOptions:[],
            createLoading:false,
            flag:'add',
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
        }
    },
    created() {},
    mounted() {

    },
    computed: {},
    methods:{
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailUrl = response.result.baseUrl
            this.form.imageName = response.result.name
            this.form.fileList = []
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.projectId = this.projectInfo.id
            console.log(data)
            addObj(data).then( res => {
                console.log(res)
            })
        },
        updataForm(formName){

        },
        cancel(formName){

        },
    }
}
</script>
<style scoped>

</style>
