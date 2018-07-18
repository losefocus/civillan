<template>
    <div>
        <el-form :model="form" class="clearfix" ref="form" size="small" label-width="80px">
            <el-form-item label="名称" style="width: 215px">
                <el-input v-model="form.name" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" style="width: 220px;" label-width="75px">
                <el-select v-model="form.parentId" size="mini" placeholder="请选择分类">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序" style="width: 215px;">
                <el-input v-model="form.sort" size="mini" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="thumbnailUrl" style="width: 215px;">
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
                <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailBaseUrl+form.thumbnailPath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="备注" style="width: 215px;" label-width="75px">
                <el-input type="textarea" :rows="1"></el-input>
            </el-form-item>
            <el-form-item  class="pull-right" style="padding-top:5px;width: 350px">
                
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" style="margin-left:20px" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" style="margin-left:20px" :loading="createdLoading">保存</el-button>
                </div>
                <el-checkbox v-model="form.status" class="pull-right">已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="图片">
                    <template slot-scope="scope">
                        <div style="height:50px">
                        <img style="width:50px;height:50px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上级分类">
                    <template slot-scope="scope">
                        <span>{{categoryHash.get(scope.row.parentId)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                        <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" style="margin-left: 0px;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { getToken } from "@/util/auth";
import { toTree } from "@/util/util";
import { mapGetters } from "vuex";
import {fetchList,addObj,delObj,editObj} from "@/api/content_classify";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            form:{
                parentId:'',
                name:'',
                sort:'',
                status:'',
            },
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            categoryOptions:[],
            categoryHash:{0:'无'}
        }
    },
    created() {
        this.getList();
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["alarmList"]),
    },
    methods:{
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.thumbnailPath
            this.form.thumbnailBaseUrl = response.result.thumbnailBaseUrl
        },
        getList(){
            this.resetTem()
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                let newMap = new Map();
                newMap.set(0,'无')
                for (let i=0; i<this.list.length; i++) {
                    newMap.set(this.list[i].id,this.list[i].name)
                }
                this.categoryHash = newMap
                this.categoryOptions = toTree(this.list)
                this.categoryOptions.unshift({value:0,label:'无'})
                this.$emit('showCategoryOptions',this.categoryOptions);
                this.$emit('showCategoryHash',this.categoryHash);
            })
        },
        updateList(row){
            console.log(row)
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该配置(配置名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.alertNotify('删除')
                })
            })
        },
        handleAdd(){
            let data = Object.assign({},this.form)
            data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            this.createdLoading = true
            addObj(data).then(res => {
                this.getList()
                this.alertNotify('添加')
                this.resetTem()
            })
        },
        handleEdit(){
            this.createdLoading = true
            let data = Object.assign({},this.form)
            data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            editObj(data).then(res => {
                this.getList()
                this.alertNotify('修改')
                this.cancelEdit()
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                parentId:'',
                name:'',
                sort:'',
                status:'',
            }
            this.createdLoading = false
        },
        alertNotify(str){
            this.$notify({
                title: str,
                message: str+"成功",
                type: "success",
                duration: 2000
            });
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
    margin-bottom: 10px
}
.avatar-uploader{
    float: left;
     height: 80px;
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
    width: 132px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 132px;
    height: 80px;
    display: block;
    border-radius: 4px;
  }
</style>
