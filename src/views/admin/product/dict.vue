<template>
    <div>
        <el-form :model="form" class="clearfix" ref="form" :rules="rules" size="small" label-width="45px">
            <el-form-item label="分类" prop="categoryId" style="width: 180px;">
                <el-select v-model="form.categoryId" size="mini" placeholder="请选择分类" no-data-text="请先添加产品分类" >
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.parentId == 0">
                        <span v-if="item.parentId == 0">{{ item.name }}</span>
                        <span v-else style="padding-left:20px;">{{ item.name }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="label" style="width: 180px;">
                <el-input v-model="form.label" size="mini" auto-complete="off" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="标识" prop="code" style="width: 180px;">
                <el-input v-model="form.code" size="mini" auto-complete="off" placeholder="标识"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 110px;">
                <el-input v-model="form.sort" size="mini" auto-complete="off" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item  style="width: 300px;" class="pull-right">
                <el-button v-if="flag == 'add'" size="mini" type="primary" class="pull-right" v-waves style="margin-left:10px"  @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" v-waves style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" v-waves @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
                <el-checkbox v-model="form.status" class="pull-right">已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div class="filterCategory clearfix" style="margin-top:-20px;">
            <span class="pull-left" style="margin-right:20px;">按分类筛选</span>
            <div class="pull-left" style="width:150px">
                <el-select v-model="listQuery.categoryId" size="mini" placeholder="请选择分类" no-data-text="请先添加产品分类" @change="handleCategoryChange">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.parentId == 0">
                        <span v-if="item.parentId == 0">{{ item.name }}</span>
                        <span v-else style="padding-left:20px;">{{ item.name }}</span>
                    </el-option>
                </el-select>
            </div>
            <!-- <el-radio-group v-model="categoryId" size="mini" @change="handleCategoryChange">
                <el-radio-button v-for="item in categoryOptions_" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
            </el-radio-group> -->
        </div>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="显示名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标识">
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
  import {toTree} from "@/util/util";
  import {mapGetters} from "vuex";
  import {addObj, categoryList, delObj, editObj, fetchList} from "@/api/product_dict";

  export default {
    props:['dataInfo'],
    data(){
        var validateCategoryId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择类型'));
            } else {
                callback();
            }
        };
        var validateLabel = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入名称'));
            } else {
                callback();
            }
        };
        var validateCode = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入名称'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                categoryId: [{ validator: validateCategoryId, message: '请选择分类', trigger: 'change' }],
                label: [{ validator: validateLabel, message: '请输入名称', trigger: 'blur' }],
                code: [{ validator: validateCode, message: '请输入名称', trigger: 'blur' }],
            },
            listLoading:false,
            createdLoading:false,
            form:{
                categoryId:'',
                label:'',
                code:'',
                sort:0,
                status:true,
            },
            flag:'add',
            categoryId:'0',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            categoryOptions:[],
            categoryOptions_:[],
            categoryHash:{0:'无'}
        }
    },
    created() {
        this.getList();
        this.getCategoryList();
    },
    mounted() {

    },
    computed: {
        ...mapGetters([]),
    },
    methods:{
        getCategoryList(){
            let query = {
                page_index: 1,
                page_size: 999,
                // sort_by: 'sort',
                // direction: 'asc',
            }
            categoryList(query).then(res => {
                let list = res.data.result.items
                let newMap = new Map();
                for (let i=0; i<list.length; i++) {
                    newMap.set(list[i].id,list[i].name)
                }
                this.categoryHash = newMap
                this.categoryOptions = list
                let [...list_] = list
                this.categoryOptions_ = list_
                this.categoryOptions_.unshift({id:'',name:'全部分类'})
            })
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
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该参数(参数名:" + row.label + "), 是否继续?",
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
                    editObj(data).then(res => {
                        this.getList()
                        this.$parent.$parent.alertNotify('修改')
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
                categoryId:'',
                label:'',
                code:'',
                sort:0,
                status:true,
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
     width: 170px;
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
    width: 170px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box
  }
  .avatar {
    width: 170px;
    height: 80px;
    display: block;
    border-radius: 4px;
  }
</style>
