<template>
    <div class="app-container calendar-list-container clearfix" id="product">
        
        <div  style="width:100%">
            <div class="filter-container">
                <el-button  size="small" type="primary" @click="handleAdd">添加产品</el-button>
                <el-button  size="small" type="primary" @click="classifyTemplatVisible=true">类型管理</el-button>
                <el-button  size="small" type="primary" @click="dictTemplatVisible=true">参数字典</el-button>
                <el-button class="pull-right" type="primary" size="small" v-waves @click="handleFilter">搜索</el-button>
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="产品名称   " v-model="listQuery.name"></el-input>
                <el-select v-model="listQuery.productCategory" clearable class="pull-right" placeholder="按分类筛选" style="width:150px !important;margin-right:10px" size="small"  @change="handleFilter">
                    <el-option
                    v-for="item in categoryOptions_"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-table v-loading="listLoading"   :data="list" fit highlight-current-row style="width: 100%;margin-bottom:25px;margin-top:15px">
                <el-table-column align="center" label="缩略图" width="80">
                    <template slot-scope="scope">
                        <div style="height:40px">
                            <img v-if="scope.row.thumbnailUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                            <img v-else style="width:60px;height:40px" src="../../../assets/img/no_pic.png">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="产品名称" min-width="130">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start" :open-delay="300">
                            <span style="white-space:nowrap;cursor: pointer;">{{scope.row.name}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="型号">
                    <template slot-scope="scope">
                        <span>{{scope.row.alias}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属类型" prop="productCategory.name">
                </el-table-column>
                <el-table-column align="center" label="产品标识" width="95">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top" :open-delay="300">
                            <i style="cursor:pointer;color:#30a487" class="iconfont icon-fuzhi copy_key" :data-clipboard-text="scope.row.key" @click="copy"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="60">
                    <template slot-scope="scope">
                        <span>
                            <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                            <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" label="创建日期" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column align="center" label="操作" width="90">
                    <template slot-scope="pro">
                        <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                            <span style="cursor:pointer">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span >
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="product_btn_variable_template" :command="composeValue('variableTemplateVisible',pro.row)">变量模板</el-dropdown-item>
                                <el-dropdown-item v-if="product_btn_alert_template" :command="composeValue('alarmTemplatVisible',pro.row)">警报模板</el-dropdown-item>
                                <el-dropdown-item divided v-if="product_btn_edit" :command="composeValue('edit',pro.row)">修改产品</el-dropdown-item>
                                <el-dropdown-item v-if="product_btn_del" :command="composeValue('del',pro.row)">删除产品</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>    
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-card class="addNewProject" :style="cardHeight" :class="{'show':cardVisibel}">
            <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}产品</h3><span>{{(flag == 'add')?'Add':'Edit'}} Product</span><i class="closeBtn el-icon-close" @click="cardVisibel = false"></i></div>
            <el-form label-width="40px" :model="form" :rules="rules" ref="form" label-position="left">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" size="small" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="型号" prop="alias">
                    <el-input v-model="form.alias" size="small" placeholder="请输入产品型号"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="productCategory.id">
                    <el-select v-model="form.productCategory.id" size="small" placeholder="请选择产品分类">
                        <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="thumbnailUrl">
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
                    <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailUrl+form.thumbnailPath" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="form.status">已启用</el-checkbox>                    
                </el-form-item>
                <el-form-item>
                    <el-button v-if="flag == 'add'" type="primary" @click="submitForm('form')" size="small" :loading="createLoading" style="width:90px;" :disabled="!product_btn_add" >添加</el-button>
                    <el-button v-else type="primary" @click="updataForm('form')" size="small" :loading="createLoading" style="width:90px;">保存</el-button>
                    <el-button type="info" @click="cancelForm('form')" size="small" style="width:90px;">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog id="variable" title="变量模板"  :visible.sync="variableTemplateVisible" width='690px'>
            <variable v-if="variableTemplateVisible == true" :product-info="productData"></variable>
        </el-dialog>
        <el-dialog id="alarm" title="警报模板"  :visible.sync="alarmTemplatVisible" width='690px'>
            <alarm v-if="alarmTemplatVisible == true" :product-info="productData"></alarm>
        </el-dialog>
        <el-dialog title="分类管理" :visible.sync="classifyTemplatVisible" width='690px'>
            <category v-if="classifyTemplatVisible == true" @showCategoryOptions="getParentOptions" @showCategoryHash="getParentHash"></category>
        </el-dialog>
        <el-dialog title="参数字典" :visible.sync="dictTemplatVisible" width='690px'>
            <dict v-if="dictTemplatVisible == true"></dict>
        </el-dialog>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  import variable from "./variable";
  import alarm from "./alarm";
  import category from "./category";
  import dict from "./dict";
  import {getToken} from "@/util/auth";
  import {toTree} from "@/util/util";
  import {addObj, delObj, fetchCategoryList, fetchList, updataObj} from "@/api/product";

  export default {
    directives: {
        waves
    },
    components:{
        variable,
        alarm,
        category,
        dict
    },
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入产品名称'));
            } else {
                callback();
            }
        };
        var validateAlias = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入产品型号'));
            } else {
                callback();
            }
        };
        var validateCategory = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入产品分类'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                name: [
                    { validator: validateName, message: '请输入产品名称', trigger: 'blur' }
                ],
                alias: [
                    { validator: validateAlias, message: '请输入产品型号', trigger: 'blur' },
                ],
                category: [
                    { validator: validateCategory, message: '请输入产品分类', trigger: 'change' },
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
                name:'',
                alias:'',
                productCategory:{id:null},
                thumbnailPath:'',
                thumbnailUrl:'',
                status:true
            },
            categoryOptions:[],
            categoryOptions_:[],
            categoryHash:{},
            imageName:'',
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            flag:'add',
            variableTemplateVisible:false,
            alarmTemplatVisible:false,
            classifyTemplatVisible:false,
            dictTemplatVisible:false,
            productData:{name:null},
            templateData:{content:''},
            temploading:false,
            tempCreateloading:false,
            product_btn_add:false,
            product_btn_edit:false,
            product_btn_del:false,
            product_btn_variable_template:false,
            product_btn_alert_template:false,
            cardHeight:{'height':null},
            cardVisibel:false,
        }
    },
    created() {
        this.getAllList()
        this.getCardHeight()
        this.product_btn_add = this.permissions["product_btn_add"];
        this.product_btn_edit = this.permissions["product_btn_edit"];
        this.product_btn_del = this.permissions["product_btn_del"];
        this.product_btn_variable_template = this.permissions["product_btn_variable_template"];
        this.product_btn_alert_template = this.permissions["product_btn_alert_template"];
    },
    mounted() {
        
    },
    computed: {
        ...mapGetters(["permissions"])
    },
    methods:{
        getCardHeight(){
            this.cardHeight.height = document.body.clientHeight - 107  - 30 + 'px'
        },
        handleAdd(){
            this.cardVisibel = true
            this.flag = 'add'
            this.form = {
                name:'',
                alias:'',
                productCategory:{id:null},
                thumbnailPath:'',
                thumbnailUrl:'',
                status:true
            }
        },
        getAllList(){
            this.listLoading = true
            Promise.all([fetchList(this.listQuery),fetchCategoryList()]).then(results => {
                let res1 = results[0],res2 = results[1]
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
                this.categoryOptions_ = toTree(data)
                this.categoryOptions.unshift({value:0,label:'无'})
                this.listLoading = false
            });
        },
        getParentOptions(msg) {
            this.categoryOptions = msg
        },
        getParentHash(msg) {
            this.categoryHash = msg
        },
        classifyManage(){
            this.classifyTemplatVisible = true
        },
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            this.listQuery.page_index = 1;
            this.getList()
        },
        handleSizeChange(val){
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val){
            this.listQuery.page_index = val;
            this.getList();
        },
        delProduct(row){
            this.$confirm(
                "此操作将永久删除该产品(产品名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList();
                    this.alertNotify('删除');
                })
            }).catch(() => {});
        },
        updataProduct(row){
            this.flag = 'updata'
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
                        this.alertNotify('修改');
                    })
                }
            })    
            
        },
        cancelForm(formName){
            this.resetTemp()
            this.flag = 'add'
            this.createLoading = false
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.status = data.status?1:0
                    this.createLoading = true
                    addObj(data).then(res => {
                        this.getList();
                        this.createLoading = false;
                        this.resetTemp()
                        this.alertNotify('添加');
                    })
                }
            })
            
        },
        
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
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailUrl = response.result.baseUrl
            this.imageName = response.result.name
            this.fileList = []
            this.uploadLoaing = false
        },
        resetTemp() {
            this.cardVisibel = false
            this.form = {
                name:'',
                alias:'',
                productCategory:{id:null},
                thumbnailPath:'',
                thumbnailUrl:'',
                status:true
            }
            this.$refs.form.resetFields();
        },
        handleCommand(command){
            if(command.value == 'del') this.delProduct(command.row)
            else if(command.value == 'edit') this.updataProduct(command.row)
            else if(command.value == 'variableTemplateVisible') this.variableTemplate(command.row)
            else if(command.value == 'alarmTemplatVisible') this.alarmTemplat(command.row)
        },
        composeValue(item,row){
             return {
                'value': item,
                'row': row
            }
        },
        //变量模板
        variableTemplate(row){
            this.variableTemplateVisible = true
            this.productData = row
        },
        //报警模板
        alarmTemplat(row){
            this.alarmTemplatVisible = true
            this.productData = row
        },
        copy() {  
            var clipboard = new this.Clipboard('.copy_key');  
            clipboard.on('success', e => {  
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });   
                clipboard.destroy()   // 释放内存 
            })  
            clipboard.on('error', e => {  
                this.$message({
                    message: '该浏览器不支持自动复制',
                    type: 'warning'
                });  
                clipboard.destroy()  
            })  
        },
        alertNotify(str){
            this.$notify({
                title: str,
                message: str+"成功",
                type: "success",
                duration: 2000
            });
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 120px;
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
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 218px;
    height: 120px;
    display: block;
    border-radius: 4px;
  }
#product{
    position: relative;
}
.el-form-item{
    margin-bottom: 20px
}
.el-card__body{
    padding-top: 0 !important;
}
.addNewProject{
    background: #fff;
    /* height: 500px; */
    width: 300px;
    padding-top: 0 ;
    position: absolute;
    top: -1px;
    right: -315px;
    z-index: 9
}
.addNewProject.show{
    right: -1px;
}
.addNewProject .tit{
    margin-top:-20px;
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    position: relative;
    margin-bottom: 20px;
}
.addNewProject h3{
    float: left;
    line-height: 60px;
    padding-left:20px;
    font-weight: bold;
}
.addNewProject .tit::before{
    display: block;
    content: '';
    width: 4px;
    background: #30a487;
    height:20px;
    position: absolute;
    left: 0;
    top: 20px;
}
.addNewProject span{
    line-height: 70px;
    color: #cacaca;
    font-size: 12px;
    padding-left: 20px;
    letter-spacing: 1px;
}
/* .el-form-item__error{
    padding-top: 0 !important
} */
.el-dialog__body{
    padding-top: 0 !important
}
.closeBtn{
    cursor: pointer;
    float: right;
    margin-top: 22px;
    color: #6b6b6b;
    transition: transform .3s ease-out 0s,-webkit-transform .3s ease-out 0s;
}
.closeBtn:hover{
    transform: rotate(180deg)
}
</style>
