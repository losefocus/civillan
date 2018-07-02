<template>
    <div class="app-container calendar-list-container clearfix" id="product">
        <div class="filter-container">
            <el-button class="filter-item" style="" size="small" type="primary" icon="edit" >添加产品</el-button>
            <el-button class="filter-item" style="" size="small" type="primary" icon="edit" >分类管理</el-button>
        </div>
        <div class="clearfix">
            <div v-loading="listLoading" class="pull-left"  style="width:calc(100% - 320px)">
                <el-table :data="list" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;margin-bottom:10px">
                    <el-table-column align="center" label="缩略图">
                        <template slot-scope="scope">
                            <img style="width:50px;height:50px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="产品名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="别名/型号" width="85">
                        <template slot-scope="scope">
                            <span>{{scope.row.alias}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属分类">
                        <template slot-scope="scope">
                            <span>{{scope.row.category}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="Product key" width="95">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top">
                                <el-button size="small" class="copy_key" :data-clipboard-text="scope.row.key" @click="copy">key</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <span>{{(scope.row.status === 1)?'已启用':'未启用'}}</span>
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
                    
                    <el-table-column align="center" label="操作">
                        <template slot-scope="pro">

                            <el-dropdown trigger="click" @command="handleCommand">
                                <el-button type="primary" size="small">
                                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="product_btn_variable_template" :command="composeValue('variableTemplateVisible',pro.row)">变量</el-dropdown-item>
                                    <el-dropdown-item v-if="product_btn_alert_template" :command="composeValue('alarmTemplatVisible',pro.row)">报警</el-dropdown-item>
                                    <el-dropdown-item divided v-if="product_btn_edit" :command="composeValue('edit',pro.row)">修改</el-dropdown-item>
                                    <el-dropdown-item v-if="product_btn_del" :command="composeValue('del',pro.row)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                            <!-- <el-button size="small" type="success" plain @click="variableTemplate(pro.row)">变量模板</el-button>
                            <el-button size="small" type="success" plain @click="alarmTemplat(pro.row)">报警模板</el-button>
                            <el-button size="small" type="success" plain @click="updataProduct(pro.row)" v-if="product_btn_edit" >修改</el-button>
                            <el-button size="small" type="danger" plain @click="delProduct(pro.row)" v-if="product_btn_del">删除</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>    
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
            <div class="pull-right addNewProject">
                <h3>{{(flag == 'add')?'添加':'修改'}}产品</h3>
                <el-form label-width="55px" :model="form" :rules="rules" ref="form">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" size="small" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" prop="alias">
                        <el-input v-model="form.alias" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="category">
                        <el-input v-model="form.category" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="thumbnailUrl">
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
                        <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailUrl+form.thumbnailPath" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="form.status">已启用</el-checkbox>                    
                    </el-form-item>
                    <el-form-item v-if="flag == 'add'">
                        <el-button type="primary" @click="submitForm('form')" size="small" :loading="createLoading" style="width:90px;" :disabled="!product_btn_add" >添加</el-button>
                    </el-form-item>
                    <el-form-item v-else>
                        <el-button type="primary" @click="updataForm('form')" size="small" :loading="createLoading" style="width:90px;">保存</el-button>
                        <el-button type="info" @click="cancelForm('form')" size="small" style="width:90px;">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog id="variable" title="变量模板"  :visible.sync="variableTemplateVisible" width='690px'>
            <!-- <variable :product-info="productData" :template-info="templateData"></variable> -->
            <div class="clearfix">
                <div >
                    产 品 : {{productData.name}} 
                </div>
                <el-input style="padding:20px 0" type="textarea" :rows="10" placeholder="请输入内容" v-model="templateData.content"></el-input>
                <el-button class="pull-right" size="small" type="primary" @click="setTemplate" :loading="tempCreateloading">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog id="alarm" title="报警模板"  :visible.sync="alarmTemplatVisible" width='690px'>
            <!-- <alarm :product-info="productData" :template-info="templateData"></alarm> -->
            <div class="clearfix" v-loading="temploading">
                <div >
                    产 品 : {{productData.name}} 
                </div>
                <el-input style="padding:20px 0" type="textarea" :rows="10" placeholder="请输入内容" v-model="templateData.content"></el-input>
                <el-button class="pull-right" size="small" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import variable from "./variable";
import alarm from "./alarm";
import { getToken} from "@/util/auth";
import { fetchList,addObj,delObj,updataObj,get_templateObj,set_templateObj} from "@/api/product";
export default {
    components:{
        variable,
        alarm,
    },
    data(){
        return {
            rules: {
                name: [
                    { required: true, message: '请输入产品名称', trigger: 'blur' }
                ],
                alias: [
                    { required: true, message: '请输入产品型号', trigger: 'blur' },
                ],
                category: [
                    { required: true, message: '请输入产品分类', trigger: 'blur' },
                ],
                thumbnailUrl: [
                    { required: true, message: '请添加图片', trigger: 'blur' }
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
                category:null,
                thumbnailPath:'',
                thumbnailUrl:'',
                status:false
            },
            imageName:'',
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            flag:'add',
            variableTemplateVisible:false,
            alarmTemplatVisible:false,
            productData:{name:null},
            templateData:{content:''},
            temploading:false,
            tempCreateloading:false,
            product_btn_add:false,
            product_btn_edit:false,
            product_btn_del:false,
            product_btn_variable_template:false,
            product_btn_alert_template:false,
        }
    },
    created() {
        this.getList()
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
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        handleSizeChange(){
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(){
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
                    this.$notify({
                        title: "成功",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                })
            })
        },
        updataProduct(row){
            this.flag = 'updata'
            this.form = Object.assign({},row)
            this.form.status = this.form.status === 1?true:false
        },
        updataForm(formName){
            this.createLoading = true
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            updataObj(data).then(res => {
                this.getList();
                this.resetTemp()
                this.flag = 'add'
                this.createLoading = false
                this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                });
            })
        },
        cancelForm(formName){
            this.resetTemp()
            this.flag = 'add'
            this.createLoading = false
        },
        submitForm(formName){
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            data.category = 1
            this.createLoading = true
            addObj(data).then(res => {
                this.getList();
                this.createLoading = false;
                this.resetTemp()
                this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success",
                    duration: 2000
                });
            })
        },
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailUrl = response.result.baseUrl
            this.imageName = response.result.name
            this.fileList = []
        },
        resetTemp() {
            this.form = {
                name:'',
                alias:'',
                category:null,
                thumbnailPath:'',
                thumbnailUrl:'',
                status:false
            }
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
            let id
            row.productTemplate.forEach(element => {
                if(element.type === 1)id = element.id
            });
            this.getContent(id) 
        },
        //报警模板
        alarmTemplat(row){
            this.alarmTemplatVisible = true
            this.productData = row
            let id
            row.productTemplate.forEach(element => {
                if(element.type === 2)id = element.id
            });
            this.getContent(id)
        },
        getContent(id){          
            this.temploading = true
            get_templateObj(id).then(res => {
                this.templateData = res.data.result
                // this.templateData.content = ('content' in res.data.result)?JSON.stringify(res.data.result.content):''
                this.temploading = false
            })
        },
        setTemplate(){
            let data = this.templateData
            // data.content = eval('(' + data.content + ')')
            delete data.handler
            delete data.hibernateLazyInitializer
            this.tempCreateloading = true
            set_templateObj(data).then(res => {
                this.variableTemplateVisible = false
                this.$notify({
                    title: "成功",
                    message: "保存成功",
                    type: "success",
                    duration: 2000
                });
                this.tempCreateloading = false
            })
        },
        copy() {  
            var clipboard = new this.Clipboard('.copy_key');  
            clipboard.on('success', e => {  
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
                    // 释放内存  
                clipboard.destroy()  
            })  
            clipboard.on('error', e => {  
                // 不支持复制  
                this.$message({
                    message: '该浏览器不支持自动复制',
                    type: 'warning'
                });
                // 释放内存  
                clipboard.destroy()  
            })  
        },
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 203px;
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
    height: 203px;
    line-height: 203px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 203px;
    height: 203px;
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
.el-dialog__body{
    padding-top: 0 !important
}
</style>
