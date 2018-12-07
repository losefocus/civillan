<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加监控</el-button>
            <el-button class="filter-item" style="" @click="objectTypeVisible = true" size="small" type="primary" icon="edit" >分类管理</el-button>
            <!-- <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="人员姓名" v-model="listQuery.name"></el-input> -->
            <!-- <el-select v-model="listQuery.roleId" clearable class="pull-right" placeholder="按角色筛选" style="width:150px;margin-right:10px" size="small"  @change="handleFilter">
                <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
        </div>
        <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 99%;margin-bottom:20px">
            <el-table-column align="center" label="缩略图" width="80px">
                <template slot-scope="scope">
                    <div style="height:45px">
                        <img v-if="scope.row.thumbnailBaseUrl&&scope.row.thumbnailBaseUrl!=''" style="width:60px;height:45px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        <img v-else style="width:60px;height:45px" src="../../../../assets/img/no_pic.png">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" min-width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分类">
                <template slot-scope="scope">
                    <span>{{scope.row.category.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="地址" min-width="170">
                <template slot-scope="scope">
                    <span><a>{{scope.row.url}}</a></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="添加时间" min-width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="添加人" min-width="170">
                <template slot-scope="scope">
                    <span>{{adminerHash[scope.row.createdBy]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="140">
                <template slot-scope="scope" >
                    <el-button size="mini" type="" plain @click="updatePer(scope.row)">修改</el-button>
                    <el-button size="mini" type="" plain @click="deletePer(scope.row)" style="margin-left:0px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog id="orgType" title="分类管理"  :visible.sync="objectTypeVisible" width='690px'>
            <el-form :model="categoryForm" class="clearfix" :rules="rules" ref="categoryForm" size="mini" label-width="50px">
                <el-form-item label="上级" prop="parentId" style="width: 210px">
                        <el-select v-model="categoryForm.parentId" size="mini" placeholder="请选择上级分组">
                            <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name" style="width: 210px;margin-left:10px">
                        <el-input v-model="categoryForm.name" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" style="width: 210px;margin-left:10px">
                        <el-input v-model="categoryForm.sort" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" style="width: 210px;">
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
                            <img v-if="categoryForm.thumbnailBaseUrl!='' && categoryForm.thumbnailBaseUrl!=undefined" :src="categoryForm.thumbnailBaseUrl+categoryForm.thumbnailPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="备注" style="width: 430px;margin-left:10px">
                        <el-input v-model="categoryForm.comment" type="textarea" :rows="3" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                        <div v-if="flag == 'add'">
                            <el-button size="mini" type="primary" class="pull-right" @click="addCategory('categoryForm')" :loading="createdCategoryLoading">保存</el-button>
                        </div>
                        <div v-else>
                            <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('categoryForm')">取消</el-button>
                            <el-button size="mini" type="primary" class="pull-right" @click="handleEditCategory('categoryForm')" :loading="createdCategoryLoading">保存</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-checkbox v-model="categoryForm.status" >已启用</el-checkbox>
                    </el-form-item>
            </el-form>
            <div v-loading="roleListLoading">
                <el-table :data="categoryList" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                    <el-table-column align="center" label="缩略图" width="80">
                        <template slot-scope="scope">
                            <div style="height:40px">
                                <img v-if="'thumbnailBaseUrl' in scope.row && scope.row.thumbnailBaseUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                                <img v-else style="width:60px;height:40px" src="../../../../assets/img/no_pic.png">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="上级">
                        <template slot-scope="scope">
                            <span>{{scope.row.parentId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="排序" width="60">
                        <template slot-scope="scope">
                            <span>{{scope.row.sort}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" width="60">
                        <template slot-scope="scope">
                            <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                            <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="160" style="float:right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="" plain @click="updateCategory(scope.row)" :disabled="scope.row.createdBy === 0">修改</el-button>
                            <el-button size="mini" type="" plain @click="deleteCategory(scope.row)" :disabled="scope.row.createdBy === 0">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!roleListLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange_role" @current-change="handleCurrentChange_role" :current-page.sync="roleListQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="roleListQuery.page_size" layout="total, prev, pager, next, jumper" :total="categoryTotal">
                    </el-pagination>
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {fetchList,delObj,fetchCategoryList,addCategoryObj,updataCategoryObj,delCategoryObj} from "@/api/project_monitoring";
  import {getToken} from "@/util/auth";
  export default {
    props:['projectInfo'],
    data(){
        var validataRole = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入名称'));
            }else {
                callback();
            }
        };
        return {
            rules: {
                name: [{ validator: validataRole, trigger: 'blur' }],
            },
            listLoading:false,
            roleListLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20,
                sort_by:'createdAt',
                direction:'desc',
            },
            total:null,
            objectTypeVisible:false,
            categoryForm:{
                parentId:0,
                status:true,
                sort:0
            },
            categoryList:[],
            roleOptions:[],
            roleListQuery: {
                page_index: 1,
                page_size: 10,
                sort_by:'sort',
                direction:'asc',
            },
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            categoryTotal:null,
            flag:'add',
            createdCategoryLoading:false
        }
    },
    created() {
        this.getList()
        this.getCategoryList()
    },
    mounted() {
    },
    computed: {
        ...mapGetters(["adminerHash"])
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
                this.categoryForm.thumbnailPath = response.result.path
                this.categoryForm.thumbnailBaseUrl = response.result.baseUrl
                this.fileList = []
            }
            this.uploadLoaing = false
        },
        handleAdd(){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addMonitoring.flag = 'add'
            this.$parent.$refs.addMonitoring.resetTemp()
        },
        getList(){
            this.listLoading = true
            this.listQuery.projectId = this.projectInfo.id
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            if(this.listQuery.adminer == '') delete this.listQuery.adminer
            this.listQuery.page_index = 1;
            this.getList()
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        updatePer(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addMonitoring.flag = 'edit'
            this.$parent.$refs.addMonitoring.form = Object.assign({},row)
            this.$parent.$refs.addMonitoring.form.status = (row.status == 1)?true:false
        },
        deletePer(row){
            this.$confirm(
                "此操作将永久删除该机构类型(类型名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.$parent.$parent.alertNotify('删除')
                })
            }).catch(() => {});
            
        },
        getCategoryList(){
            this.roleListQuery.projectId = this.projectInfo.id
            this.roleListLoading = true
            fetchCategoryList(this.roleListQuery).then(res => {
                this.categoryList = res.data.result.items
                this.categoryTotal = res.data.result.total
                let [...roleOptions] = res.data.result.items
                this.roleOptions = roleOptions
                this.roleOptions.unshift({id:0,name:'无'})
                this.$store.commit("SET_MONICATEGORYOPTIONS",this.categoryList);
                this.roleListLoading = false
            })
        },
        
        handleSizeChange_role(val) {
            this.roleListQuery.page_size = val;
            this.getCategoryList();
        },
        handleCurrentChange_role(val) {
            this.roleListQuery.page_index = val;
            this.getCategoryList();
        },
        addCategory(formName){
            let data = Object.assign({}, this.categoryForm);
            data.parentId = parseInt(data.parentId)
            data.projectId = this.projectInfo.id
            data.status = data.status?1:0
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createdCategoryLoading = true
                    addCategoryObj(data).then( res => {
                        if(res.data.success == true){
                            this.getCategoryList()
                            this.categoryForm = {status:true};
                            this.$parent.$parent.alertNotify('添加')
                            this.createdCategoryLoading = false
                        }
                    })
                }
            })
        },
        updateCategory(row){
            this.flag = 'edit'
            this.categoryForm= Object.assign({}, row);
            this.categoryForm.status = (this.categoryForm.status == 1)?true:false
        },
        handleEditCategory(formName){
            let data = Object.assign({}, this.categoryForm);
            data.status = data.status?1:0
            data.sort = parseInt(data.sort)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createdCategoryLoading = true
                    updataCategoryObj(data).then( res => {
                        if(res.data.success == true){
                            this.getCategoryList()
                            this.cancelEdit();
                            this.$parent.$parent.alertNotify('修改')
                            this.createdCategoryLoading = false
                        }
                    })
                }
            })
        },
        deleteCategory(row){
            this.$confirm(
                "此操作将永久删除该角色(角色名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delCategoryObj(row.id).then(res => {
                    this.getCategoryList()
                    this.$parent.$parent.alertNotify('删除')
                })
            }).catch(() => {});
            
        },
        cancelEdit(){
            this.flag = 'add'
            this.categoryForm = {status:true,parentId:0,sort:0}
            this.createdCategoryLoading = false
        }
    }
}
</script>
<style scoped>
.avatar-uploader{
     height: 64px;
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
    width: 158px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 158px;
    height: 64px;
    display: block;
    border-radius: 4px;
  }
.el-form-item{
    float: left;
    width:80px
}
</style>
