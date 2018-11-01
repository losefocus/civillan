<template>
    <div>
        <div class="clearfix addBtn" style="padding-bottom:20px;">
            <el-button type="primary" size="mini" v-show="!isshow"  class="pull-left" @click="isshow = !isshow" >添加</el-button>
            <el-button type="info" size="mini" v-show="isshow" class="pull-left" @click="cancelEdit" style="margin-left:0">取消</el-button>
        </div>
        <el-collapse-transition>
            <div v-show="isshow">
                <el-form :model="form" class="clearfix" ref="form" :rules="rules" label-width="50px" size="mini">
                    <el-form-item label="上级" prop="parentId" style="width: 210px">
                        <el-select v-model="form.parentId" size="mini" placeholder="请选择上级分组">
                            <el-option
                            v-for="item in parentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- <el-cascader
                            size="mini" placeholder="请选择上级分组"
                            :options="parentOptions"
                            v-model="form.parentId"
                            :show-all-levels="false"
                            change-on-select>
                        </el-cascader> -->
                    </el-form-item>
                    <el-form-item label="名称" prop="name" style="width: 210px;margin-left:10px">
                        <el-input v-model="form.name" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" style="width: 210px;margin-left:10px">
                        <el-input v-model="form.sort" size="mini" auto-complete="off"></el-input>
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
                            <img v-if="form.thumbnailBaseUrl!='' && form.thumbnailBaseUrl!=undefined" :src="form.thumbnailBaseUrl+form.thumbnailPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="备注" style="width: 430px;margin-left:10px">
                        <el-input v-model="form.comment" type="textarea" :rows="3" size="mini" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item  :style="flag == 'add'?'width: 140px':'width: 220px'" class="pull-right" style="padding-top:5px">
                        <div v-if="flag == 'add'">
                            <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">保存</el-button>
                        </div>
                        <div v-else>
                            <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                            <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="pull-right">
                        <el-checkbox v-model="form.status" >已启用</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column align="center" label="缩略图" width="80">
                    <template slot-scope="scope">
                        <div style="height:40px">
                            <img v-if="scope.row.thumbnailBaseUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                            <img v-else style="width:60px;height:40px" src="../../../../../assets/img/no_pic.png">
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
                        <span>{{parentHash.get(scope.row.parentId)}}</span>
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
                        <el-button size="mini" type="" plain @click="updateList(scope.row)" :disabled="scope.row.createdBy === 0">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" :disabled="scope.row.createdBy === 0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
  import {getToken} from "@/util/auth";
  import {toTree} from "@/util/util";
  import {mapGetters} from "vuex";
  import {addObj, delObj, editObj, getObj} from "@/api/device/group";

  export default {
    props:['dataInfo'],
    data(){
        var validataParentId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择机构'));
            }else {
                callback();
            }
        };
        var validataName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择机构'));
            }else {
                callback();
            }
        };
        return {
            rules: {
                parentId: [{ validator: validataParentId, trigger: 'change' }],
                name: [{ validator: validataName, trigger: 'blur' }],
            },
            isshow:false,
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
                parentId:0,
                name:'',
                sort:0,
                comment:'',
                status:true,
                thumbnailPath:'',
                thumbnailBaseUrl:'',
            },
            selectedOptions2:[],
            fileList:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            flag:'add',
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            parentOptions:[],
            parentHash:null
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
                this.fileList = []
            }
            this.uploadLoaing = false
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
            this.listQuery.projectId = this.$parent.$parent.projectInfo.id
            this.listQuery.sort_by = 'sort'
            this.listQuery.direction = 'asc'
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                let newMap = new Map();
                newMap.set(0,'无')
                for (let i=0; i<this.list.length; i++) {
                    newMap.set(this.list[i].id,this.list[i].name)
                }
                this.parentHash = newMap
                this.parentOptions = toTree(this.list)
                let [...groupOptions] = this.parentOptions
                this.$store.commit("SET_GROUPOPTIONS", groupOptions);
                this.parentOptions.unshift({value:0,label:'无'})
            })
        },
        updateList(row){
            this.flag = 'edit'
            this.isshow = true
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
            this.$refs.form.resetFields()
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该分组(分组名称:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList()
                    this.$notify({
                        title: '成功',
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                })
            }).catch(() => {})
        },
        handleAdd(){
            this.$refs.form.validate(valid => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    data.status = data.status?1:0
                    data.projectId = this.$parent.$parent.projectInfo.id
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList()
                        this.$notify({
                            title: '成功',
                            message: "添加成功",
                            type: "success",
                            duration: 2000
                        });
                        this.resetTem()
                    }).catch(err => {
                        this.createdLoading = false
                    })
                }
            })
        },
        handleEdit(){
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.createdLoading = true
                    let data = Object.assign({},this.form)
                    data.sort = parseInt(data.sort)
                    data.status = data.status?1:0
                    delete data.projectDevices
                    editObj(data).then(res => {
                        this.getList()
                        this.$notify({
                            title: '成功',
                            message: "修改成功",
                            type: "success",
                            duration: 2000
                        });
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
                comment:'',
                status:true,
                thumbnailPath:'',
                thumbnailBaseUrl:'',
            }
            this.createdLoading = false
            this.isshow = false
            this.$refs.form.resetFields()
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
  .addBtn{
    position: absolute;
    top: 20px;
    left: 120px;
  }
</style>
