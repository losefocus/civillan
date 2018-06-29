<template>
    <div>
        <h3>{{flag == 'add'?'添加':'修改'}}设备</h3>
        <el-form label-width="60px" :model="form"  ref="form" :rules="rules">
            <el-form-item label="项目" >
                <el-input v-model="projectInfo.name" size="small" placeholder="请输入内容" disabled></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="productId">
                <el-select v-model="form.productId" size="small" placeholder="请选择" :disabled="disabled">
                    <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分组" prop="deviceGroup.id">
                <!-- <el-input v-model="form.deviceGroup.id" size="small" placeholder="请输入内容"></el-input> -->
                <el-cascader
                    size="small" placeholder="请选择上级分组"
                    :options="groupOptions"
                    v-model="form.deviceGroup.id"
                    :show-all-levels="false"
                    change-on-select>
                </el-cascader>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="固件" prop="firmware">
                <el-input v-model="form.firmware" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="thumbnailBaseUrl">
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
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" class="pull-right" @click="submitForm('form')" size="small" style="width:85px;" :disabled="!device_btn_add">添加</el-button>
                <div v-else class="clearfix">
                    <el-button  type="primary" :loading="createLoading" class="pull-left" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
                    <el-button  type="info" class="pull-right" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
                </div>                 
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { toTree } from "@/util/util";
import {addObj,fetchProductList,updataObj,getGroupObj} from "@/api/project_equ";
export default {
    props:['projectInfo'],
    data(){
        return {
            rules: {
                productId: [
                    { required: true, message: '请选择父级项目', trigger: 'change' },
                ],
                'deviceGroup.id': [
                    { required: true, message: '请选择分组', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                thumbnailBaseUrl: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
                ],
                firmware: [
                    { required: true, message: '请输入固件', trigger: 'blur' }
                ],
                comment: [
                    { required: false, message: '请输入备注', trigger: 'blur' }
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
                    id:[]
                }
            },
            // groupOptions:[],
            disabled:false,
            productHash:{},
            imageName:'',
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            flag:'add',
            productOptions:[],
            device_btn_add :false,
        }
    },
    created() {
        this.getProductList()
        this.getGroupList()
        this.device_btn_add = this.permissions["device_btn_add"];
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions","groupOptions"])
    },
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
                    let item = {value:ele.id, label:ele.alias}
                    this.productOptions.push(item)
                    this.productHash[ele.id] = ele.alias
                });
            })
        },
        getGroupList(){
            getGroupObj(this.projectInfo.id).then(res => {
                let groupOptions = toTree(res.data.result.items)
                this.$store.commit("SET_GROUPOPTIONS", groupOptions);
            })
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.projectId = this.projectInfo.id
            data.status = data.status?1:0
            data.alias = this.productHash[data.productId]
            // data.deviceGroup.id = data.deviceGroup.id[data.deviceGroup.id.length-1]
            data.deviceGroup={id:data.deviceGroup.id[data.deviceGroup.id.length-1]} 
            data.protocol = "string"
            data.passage = "string"
            console.log(data)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addObj(data).then( res => {
                        this.createLoading = false
                        this.$parent.$refs.equ.getList()
                        this.resetTemp()
                        this.$parent.$parent.alertNotify('添加')
                    })
                }
            })
            
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.status = this.form.status?1:0
                    this.form.alias = this.productHash[data.productId]
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
                    id:[]
                }
            }
            this.disabled = false
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 200px;
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
    width: 198px;
    height: 198px;
    line-height: 198px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
.avatar {
    width: 198px;
    height: 198px;
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
