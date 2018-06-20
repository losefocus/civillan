<template>
    <div class="app-container calendar-list-container clearfix" >
        
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
                    <el-table-column align="center" label="别名/型号" >
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
                                <el-button size="small">key</el-button>
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
                    
                    <el-table-column align="center" label="操作" width="350">
                        <template slot-scope="pro">
                            <el-button size="small" type="success" plain @click="toInfo(pro.row)">变量模板</el-button>
                            <el-button size="small" type="success" plain @click="toInfo(pro.row)">报警模板</el-button>
                            <el-button size="small" type="success" plain @click="updataProduct(pro.row)">修改</el-button>
                            <el-button size="small" type="danger" plain @click="delProduct(pro.row)">删除</el-button>
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
                    <el-form-item label="名称" prop="parentId">
                        <el-input v-model="form.name" size="small" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="型号" prop="alias">
                        <el-input v-model="form.alias" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="category">
                        <el-input v-model="form.category" size="small" placeholder="请输入内容"></el-input>
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
                        <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailUrl+form.thumbnailPath" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="form.status">已启用</el-checkbox>                    
                    </el-form-item>
                    <el-form-item v-if="flag == 'add'">
                        <el-button type="primary" @click="submitForm('form')" size="small" :loading="createLoading" style="width:90px;">保存</el-button>
                    </el-form-item>
                    <el-form-item v-else>
                        <el-button type="primary" @click="updataForm('form')" size="small" :loading="createLoading" style="width:90px;">保存</el-button>
                        <el-button type="info" @click="cancelForm('form')" size="small" style="width:90px;">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
    </div>
</template>
<script>
import { getToken} from "@/util/auth";
import { fetchList,addObj,delObj,updataObj} from "@/api/product";
export default {
    data(){
        return {
            rules:{

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
            flag:'add'
        }
    },
    created() {
        this.getList()
    },
    mounted() {
        
    },
    computed: {},
    methods:{
        handleSizeChange(){
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(){
            this.listQuery.page_index = val;
            this.getList();
        },
        toInfo(){},
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
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
                })
            })
            
        },
        updataProduct(row){
            this.flag = 'updata'
            this.form = Object.assign({},row)
            this.form.status = this.form.status === 1?true:false
        },
        updataForm(formName){
            let data = Object.assign({},this.form)
            data.status = data.status?1:0
            updataObj(data).then(res => {
                console.log(res)
                this.getList();
                this.resetTemp()
                this.flag = 'add'
                this.createLoading = false
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
        }
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
</style>
