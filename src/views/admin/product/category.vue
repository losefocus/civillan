<template>
    <div>
        <el-form :model="form" class="clearfix" ref="form" :rules="rules" size="small" label-width="50px">
            <el-form-item label="上级" prop="parentId" style="width: 170px;margin-right:5px">
                <el-select v-model="form.parentId" size="mini" placeholder="请选择上级分类">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name" style="width: 170px;margin-right:5px" >
                <el-input v-model="form.name" size="mini" auto-complete="off" placeholder="名称" @blur="checkName"></el-input>
            </el-form-item>
            <el-form-item label="标识" prop="code" style="width: 170px;" >
                <el-input v-model="form.code" size="mini" auto-complete="off" placeholder="标识" @blur="checkCode"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 130px;">
                <el-input v-model="form.sort" size="mini" auto-complete="off" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="width: 170px;">
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
            <el-form-item  style="width: 300px;padding-top:50px" class="pull-right">
                <el-button v-if="flag == 'add'" size="mini" type="primary" class="pull-right" style="margin-left:10px"  @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
                <el-checkbox v-model="form.status" class="pull-right">已启用</el-checkbox>
            </el-form-item>
        </el-form>

        <div class="filterCategory clearfix">
            <span class="pull-left" style="margin-right:20px;">按分类筛选</span>
            <div class="pull-left" style="width:150px">
                <el-select v-model="listQuery.parentId" size="mini" placeholder="请选择分类" no-data-text="请先添加产品分类" @change="handleCategoryChange">
                    <el-option
                    v-for="item in categoryOptions_"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                        <span v-if="item.parentId == 0 || item.id == ''">{{ item.name }}</span>
                        <span v-else style="padding-left:20px;">{{ item.name }}</span>
                    </el-option>
                </el-select>
            </div>
        </div>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="缩略图" width="80">
                    <template slot-scope="scope">
                        <div style="height:40px">
                            <img v-if="scope.row.thumbnailBaseUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                            <img v-else style="width:60px;height:40px" src="../../../assets/img/no_pic.png">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上级分类">
                    <template slot-scope="scope">
                        <span v-if="'parentCategory' in scope.row">{{scope.row.parentCategory.name}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标识" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.code}}</span>
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
                <el-table-column align="center" label="操作" width="140" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" style="margin-left: 0px;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
  import {getToken} from "@/util/auth";
  import {toTree} from "@/util/util";
  import {mapGetters} from "vuex";
  import {addObj, delObj, editObj, fetchList} from "@/api/product_category";

  export default {
    props:['dataInfo'],
    data(){
        var validateParentId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择上级分类'));
            } else {
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入名称'));
            }else if(this.isName == true){
                callback(new Error('名称不能重复'));
            } else {
                callback();
            }
        };
        var validateCode = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入标识'));
            }else if(this.isCode == true){
                callback(new Error('标识不能重复'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                parentId: [{ validator: validateParentId, message: '请选择上级分类', trigger: 'change' }],                
                name: [{ validator: validateName, trigger: 'blur' }],
                code: [{ validator: validateCode, trigger: 'blur' }],
            },
            listLoading:false,
            createdLoading:false,
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            form:{
                parentId:0,
                name:'',
                sort:0,
                status:true,
                thumbnailPath:'',
                thumbnailBaseUrl:''
            },
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            categoryOptions:[],
            categoryOptions_:[],
            categoryHash:{0:'无'},
            isName:false,
            isCode:false,
        }
    },
    created() {
        this.getList();
        this.getAlllList()
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["alarmList"]),
    },
    methods:{
        checkName(){
            let data = {name:this.form.name}
            fetchList(data).then(res => {
                this.isName = (res.data.result.total != 0)?true:false    
                this.$refs.form.validateField('name')
            })
        },
        checkCode(){
            let data = {code:this.form.code}
            fetchList(data).then(res => {
                this.isCode = (res.data.result.total != 0)?true:false    
                this.$refs.form.validateField('code')
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
            if(response.success == false){
                this.$notify.error({
                    title: '错误',
                    message: '图片获取失败'
                });
            }else{
                this.form.thumbnailPath = response.result.path
                this.form.thumbnailBaseUrl = response.result.baseUrl
            }
            this.uploadLoaing = false
        },
        handleCategoryChange(){
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
        getList(){
            this.listLoading = true
            this.listQuery.sort_by = 'sort'
            this.listQuery.direction = 'asc' //desc
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
            })
        },
        getAlllList(){
            let query = {
                page_index: 1,
                page_size: 999,
                sort_by:'sort',
                direction:'asc',
                parentId:0,
            }
            fetchList(query).then(res => {
                let list = res.data.result.items
                let arr = [],allArr = []
                list.forEach(r => {
                    if(r.parentId == 0){
                        arr.push(r)
                        allArr.push(r)
                        if(r.childrenList.length !=0){
                            r.childrenList.forEach(l => {
                                allArr.push(l)
                            })
                        }
                    }
                })
                this.categoryOptions = arr 
                this.categoryOptions_ = [...arr]
                this.categoryOptions.unshift({id:0,name:'无'})
                this.categoryOptions_.unshift({id:'',name:'全部分类'})
                this.$emit('showCategoryOptions',allArr);

            })
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该分类(分类名:" + row.name + "), 是否继续?",
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
                    this.getAlllList()
                })
            }).catch(() => {});
        },
        handleAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    data.status = data.status?1:0
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList()
                        this.$parent.$parent.alertNotify('添加')
                        this.getAlllList()
                        this.resetTem()
                    }).catch(err => {
                        this.createdLoading = false
                    })
                }
            })
        },
        handleEdit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.createdLoading = true
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    data.status = data.status?1:0
                    delete data.parentCategory
                    delete data.childrenList
                    editObj(data).then(res => {
                        this.getList()
                        this.$parent.$parent.alertNotify('修改')
                        this.getAlllList()
                        this.cancelEdit()
                    }).catch(err => {
                        this.createdLoading = false
                    })
                }
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                parentId:0,
                name:'',
                sort:0,
                status:true,
                thumbnailPath:'',
                thumbnailBaseUrl:''
            }
            this.createdLoading = false
            this.$refs.form.resetFields();
        }
    },
    watch:{
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px;
    margin-bottom: 15px
}
.avatar-uploader{
     height: 80px;
     width: 120px;
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
    width: 120px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box
  }
  .avatar {
    width: 120px;
    height: 80px;
    display: block;
    border-radius: 4px;
  }
</style>
