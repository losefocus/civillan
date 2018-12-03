<template>
    <div>
        <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}设备</h3><span>{{(flag == 'add')?'Add':'Edit'}} Equipment</span></div>
        <el-form label-width="55px" :model="form"  ref="form" :rules="rules" label-position="left">
            <el-form-item label="分组" prop="deviceGroup.id">
                <el-select v-model="deviceGroup" size="small" placeholder="请选择分组" no-data-text="请先添加设备分组" @change="changeGroup" :disabled="disabled">
                    <el-option
                    v-for="item in groupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id+'_'+ item.code"
                    :disabled="item.parentId == 0">
                        <span v-if="item.parentId == 0">{{ item.name }}</span>
                        <span v-else style="padding-left:20px;">{{ item.name }}</span>
                    </el-option>
                </el-select>
                <!-- <el-cascader
                    size="small" placeholder="请选择分组"
                    :options="groupOptions"
                    :props="props"
                    v-model="deviceGroups"
                    :show-all-levels="false"
                    change-on-select
                    @change="changeGroup">
                </el-cascader> -->
            </el-form-item>
            <el-form-item label="产品" prop="product.id">
                <el-select v-model="productName" filterable :filter-method="productSearch" size="small" placeholder="请选择产品" :disabled="disabled" no-data-text="请先添加产品" @change="changeProduct">
                    <el-option
                    v-for="item in productOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    <!-- <el-pagination layout="prev, pager, next"
                    @current-change="productCurrentChange"
                    :current-page="productListQuery.page_index"
                    :page-size="productListQuery.page_size"
                    :total="productTotal">
                    </el-pagination> -->
                </el-select>
            </el-form-item>
            
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" size="small" placeholder="请输入设备显示名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="固件" prop="firmware">
                <el-input v-model="form.firmware" size="small" placeholder="请输入固件版本号"></el-input>
            </el-form-item> -->
            <el-form-item label="key" prop="key">
                <el-input v-model="form.key" size="small" placeholder="请输入设备唯一标识"></el-input>
            </el-form-item>
            <el-form-item label="位置" prop="position">
                <el-input v-model="form.position" size="small" readonly placeholder="点击打开地图选点" @focus="positionPicker"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="thumbnailBaseUrl">
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
            <!-- <el-form-item>
                <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
            </el-form-item> -->
            <el-form-item>
                <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;" :disabled="!device_btn_add">添加</el-button>
                <el-button v-else type="primary" :loading="createLoading" @click="updataForm('form')" size="small" style="width:85px;">保存</el-button>
                <el-button  type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="positionVisible" id="mapPosition" :append-to-body="true">
            <map-position v-if="positionVisible == true"></map-position>
        </el-dialog>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {getToken} from "@/util/auth";
  import {toTree} from "@/util/util";
  import {addObj, productCategoryList, getGroupObj, updataObj} from "@/api/project_equ";
  import mapPosition from "../mapPosition";

  export default {
    components:{
        mapPosition
    },
    props:['projectInfo'],
    data(){
        var validataProductId = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请选择产品'));
            }else{
                callback()
            }
        }
        var validataGroupId = (rule, value, callback) => {
            if(value.length === '' || value== undefined){
                callback(new Error('请选择分组'));
            }else{
                callback()
            }
        }
        var validataName = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入名称'));
            }else{
                callback()
            }
        }
        var validataFirmware = (rule, value, callback) => {
            if(value === '' || value== undefined){
                callback(new Error('请输入固件'));
            }else{
                callback()
            }
        }
        return {
            rules: {
                'product.id': [
                    { validator: validataProductId, trigger: 'change' },
                ],
                'deviceGroup.id': [
                    { validator: validataGroupId, trigger: 'change' },
                ],
                name: [
                    { validator: validataName, message: '请输入名称', trigger: 'blur' }
                ],
                firmware: [
                    { validator: validataFirmware, message: '请输入固件', trigger: 'blur' }
                ],
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
                product:{id:''},
                name:'',
                position:'',
                firmware:'V1.0',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
                comment:'',
                status:0,
                deviceGroup:{
                    id:''
                }
            },
            deviceGroup:'',
            productName:'',
            positionVisible:false,
            disabled:false,
            productHash:{},
            imageName:'',
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            flag:'add',
            productOptions:[],
            productListQuery:{
                page_index: 1,
                page_size: 10
            },
            productTotal:null,
            device_btn_add :false,
            groupListQuery:{
                page_index: 1,
                page_size: 999
            },
            groupOptions:[],
            deviceGroups:[],
            props:{
                label:'name',
                value:'id'
            }
        }
    },
    created() {
        this.getGroupList()
        this.device_btn_add = this.permissions["device_btn_add"];
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions"])
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
                this.imageName = response.result.name
                this.fileList = []
            }
            this.uploadLoaing = false
        },
        getProductList(){
            productCategoryList(this.productListQuery).then(res => {
                let data = res.data.result.items[0].productList
                this.productTotal = res.data.result.total
                this.productOptions = []
                data.forEach(ele => {
                    let item = {value:ele.id, label:ele.name+'('+ele.alias+')'}
                    this.productOptions.push(item)
                    this.productHash[ele.id] = ele.alias
                });
            })
        },
        productSearch(val){
            this.productListQuery.name = val;
            this.productListQuery.page_index = 1
            this.getProductList()
        },
        productCurrentChange(val){
            this.productListQuery.page_index = val;
            this.getProductList()
        },
        getGroupList(){
            this.groupListQuery.projectId = this.projectInfo.id
            this.groupListQuery.sort_by = 'sort'
            this.groupListQuery.direction = 'asc'
            getGroupObj(this.groupListQuery).then(res => {
                let arr = []
                res.data.result.items.forEach(r => {
                    if(r.parentId == 0){
                        arr.push(r)
                        if(r.childrenList.length !=0){
                            r.childrenList.forEach(l => {
                                arr.push(l)
                            })
                        }
                    }
                })
                this.groupOptions = arr
            })
        },
        changeGroup(val){
            this.form.deviceGroup={id:val.split('_')[0]}
            this.productListQuery.code = val.split('_')[1]
            this.getProductList()
        },
        changeProduct(val){
            this.form.product={id:val}
        },
        positionPicker(){
            this.positionVisible = true
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.projectId = this.projectInfo.id
            data.protocol = "string"
            data.passage = "string"
            
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    addObj(data).then( res => {
                        this.cancel()
                        if(res.data.success == true){
                            this.$parent.$parent.$refs.equ.getList()
                            this.$parent.$parent.$parent.alertNotify('添加')
                        }else{
                            this.$notify({
                                title: '失败',
                                message: '添加设备失败',
                                type: 'error'
                            });
                        }
                        
                    }).catch(err => {
                        this.createLoading = false
                    })
                }
            })
            
        },
        updataForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    this.createLoading = true
                    updataObj(data).then(res => {
                            this.cancel()
                        if(res.data.success == true){
                            this.$parent.$parent.$refs.equ.getList()
                            this.$parent.$parent.$parent.alertNotify('修改')
                        }else{
                            this.$notify({
                                title: '失败',
                                message: '修改设备失败',
                                type: 'error'
                            });
                        }
                    }).catch(err => {
                        this.createLoading = false
                    })
                }
            });
        },
        cancel(){
            this.flag = 'add'
            this.resetTemp()
            this.$parent.$parent.cardVisibel = false
        },
        resetTemp() {
            this.createLoading = false
            this.form={
                projectId:'',
                product:{id:''},
                name:'',
                position:'',
                firmware:'',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
                comment:'',
                status:0,
                deviceGroup:{id:''}
            }
            this.deviceGroup=''
            this.disabled = false
            this.$refs.form.resetFields()
        }
    }
}
</script>
<style scoped>
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
