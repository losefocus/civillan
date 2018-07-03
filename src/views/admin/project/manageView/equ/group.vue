<template>
    <div>
        <el-form :model="form" class="clearfix" ref="form" label-width="50px">
            <el-form-item label="上级" style="width: 210px">
                <!-- <el-select v-model="form.parentId" size="small" placeholder="请选择">
                    <el-option
                    v-for="item in parentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> -->
                <el-cascader
                    size="small" placeholder="请选择上级分组"
                    :options="parentOptions"
                    v-model="form.parentId"
                    :show-all-levels="false"
                    change-on-select>
                </el-cascader>
            </el-form-item>
            <el-form-item label="名称" style="width: 210px;margin-left:10px">
                <el-input v-model="form.name" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 210px;margin-left:10px">
                <el-input v-model="form.sort" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="width: 210px;">
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
            <el-form-item label="备注" style="width: 430px;margin-left:10px">
                <el-input v-model="form.comment" type="textarea" :rows="5" size="small" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                <div v-if="flag == 'add'">
                    <el-button size="small" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else>
                    <el-button size="small" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="small" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div v-loading="listLoading">
            <el-table :data="list" element-loading-text="给我一点时间" stripe border fit highlight-current-row style="width: 100%;margin-bottom:10px" height="250">
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上级">
                    <template slot-scope="scope">
                        <span>{{parentHash[scope.row.parentId]}}</span>
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
                        <el-button size="small" type="success" plain @click="updateList(scope.row)">修改</el-button>
                        <el-button size="small" type="danger" plain @click="deleteList(scope.row)">删除</el-button>
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
import {getObj,addObj,delObj,editObj} from "@/api/project/group";

export default {
    props:['dataInfo'],
    data(){
        return {
            listLoading:false,
            createdLoading:false,
            options:[
                {
                    value: 0,
                    label: '从不通知'
                },{
                    value: 1,
                    label: '仅一次'
                },{
                    value: 5,
                    label: '每隔5分钟'
                },{
                    value: 30,
                    label: '每隔30分钟'
                },{
                    value: 60,
                    label: '每隔1小时'
                },{
                    value: 1440,
                    label: '每隔1天'
                }
            ],
            form:{
                parentId:[0],
                name:'',
                sort:'',
                comment:'',
                status:'',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
            },
            selectedOptions2:[],
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            parentOptions:[],
            parentHash:{0:'无'}
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
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailBaseUrl = response.result.baseUrl
            this.fileList = []
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
            this.resetTem()
            this.listLoading = true
            this.listQuery.projectId = this.$parent.$parent.projectInfo.id
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                for (let i=0; i<this.list.length; i++) {
                    this.parentHash[this.list[i].id] = this.list[i].name
                }
                this.parentOptions = toTree(this.list)
                let [...groupOptions] = this.parentOptions
                this.$store.commit("SET_GROUPOPTIONS", groupOptions);
                this.parentOptions.unshift({value:0,label:'无'})
            })
        },
        updateList(row){
            console.log(row)
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
            this.form.parentId = [this.form.parentId]
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
                    this.$parent.$parent.$parent.$parent.alertNotify('删除')
                })
            })
        },
        handleAdd(){
            let data = Object.assign({},this.form)
            data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            data.parentId = data.parentId[data.parentId.length-1]
            data.projectId = this.$parent.$parent.projectInfo.id
            this.createdLoading = true
            addObj(data).then(res => {
                this.getList()
                this.$parent.$parent.$parent.$parent.alertNotify('添加')
                this.resetTem()
            })
        },
        handleEdit(){
            this.createdLoading = true
            let data = Object.assign({},this.form)
            data.sort = parseInt(data.sort)
            data.status = data.status?1:0
            data.parentId = data.parentId[data.parentId.length-1]
            editObj(data).then(res => {
                this.getList()
                this.$parent.$parent.$parent.$parent.alertNotify('修改')
                this.cancelEdit()
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                parentId:[0],
                name:'',
                sort:'',
                comment:'',
                status:'',
                thumbnailPath:'',
                thumbnailBaseUrl:'',
            }
            this.createdLoading = false
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
     height: 107px;
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
    width: 107px;
    height: 107px;
    line-height: 107px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 107px;
    height: 107px;
    display: block;
    border-radius: 4px;
  }
</style>
