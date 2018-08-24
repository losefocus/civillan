<template>
    <div class="clearfix">
        <div>产 品 : {{productInfo.name}} </div>
        <el-form :model="form" class="clearfix" ref="form" :rules="rules" label-width="0" size="mini" style="padding-top:10px;">
            <el-form-item label="" prop="type" style="width: 100px;margin-right:5px">
                <el-select v-model="form.type" placeholder="类型" size="mini">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="name" style="width: 140px;margin-right:5px">
                <el-input v-model="form.name" size="mini" auto-complete="off" placeholder="变量名称"></el-input>
            </el-form-item>
            <el-form-item label="" prop="label" style="width: 100px;margin-right:5px">
                <el-input v-model="form.label" size="mini" auto-complete="off" placeholder="标识"></el-input>
            </el-form-item>
            <el-form-item label="" prop="sort" style="width: 60px;margin-right:5px">
                <el-input v-model="form.sort" size="mini" auto-complete="off" placeholder="排序"></el-input>
            </el-form-item>
            
            <el-form-item  :style="flag == 'add'?'width: 80px':'width: 150px'" class="pull-right">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else >
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item style="width: 70px;margin-left:5px" class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div style="padding-bottom:10px;">
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="headers"
                action="/product/product/import"
                :limit="999"
                :data="params"
                name="file"
                :show-file-list ="false"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :auto-upload="true">
                    <el-button slot="trigger" size="mini" type="">导入</el-button>
            </el-upload>
        </div>
        <div v-loading="listLoading">
            <el-table :data="list" border fit highlight-current-row style="width: 100%;margin-bottom:20px">
                <el-table-column align="left" label="变量名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标识">
                    <template slot-scope="scope">
                        <span>{{scope.row.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型">
                    <template slot-scope="scope">
                        <span>{{type_map.get(parseInt(scope.row.type))}}</span>
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
                        <i v-else class="el-icon-circle-close" style="font-size:18px;color:#f56c6c"></i>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="140" style="float:right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" plain @click="updateList(scope.$index, list)">修改</el-button>
                        <el-button size="mini" type="" plain @click="deleteList(scope.$index, list)" style="margin-left:0">删除</el-button>
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
import { getToken } from "@/util/auth";
import { remote } from "@/api/dict";
import { findByvalue } from "@/util/util";
import {get_templateObj,set_templateObj} from "@/api/product";
export default {
    props:['productInfo'],
    data(){
        var validateType = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择类型'));
            } else {
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入变量名称'));
            } else {
                callback();
            }
        };
        var validateLabel = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入标识'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                type: [{ validator: validateType, trigger: 'change' }],
                name: [{ validator: validateName, trigger: 'blur' }],
                label: [{ validator: validateLabel, trigger: 'blur' }],
            },
            listLoading:false,
            flag:'add',
            textareax:'',
            originalList:[],
            list:[],
            listQuery:{
                page_index: 1,
                page_size: 10
            },
            total:null,
            templateData:null,
            options:[],
            headers:{Authorization: "Bearer " + getToken()},
            params:{product_id:this.productInfo.id},
            form:{
                name:'',
                label:'',
                sort:'',
                type:'',
                status:true
            },
            createdLoading:false,
            editIndex:null,
            type_map:null,
        }
    },
    created() {
        remote("data_type").then(response => {
            this.options = response.data.result;
            this.type_map = new Map()
            this.options.forEach(ele => {
                this.type_map.set(parseInt(ele.value),ele.label)
            });
        });
    },
    mounted() {
        this.getList()
    },
    computed: {},
    methods:{
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
            let id
            this.productInfo.productTemplate.forEach(element => {
                if(element.type === 1)id = element.id
                this.params.id = id
            });
            get_templateObj(id).then(res => {
                let data_ = res.data.result
                this.templateData = data_
                this.list = []
                this.originalList = []
                this.total = 0
                if(data_.content && data_.content !=''){
                    this.originalList = JSON.parse(data_.content.replace(new RegExp("'",'gi'),'"'))
                    this.list = JSON.parse(data_.content.replace(new RegExp("'",'gi'),'"'))
                    // this.list.forEach(ele => {
                    //     ele.type = findByvalue(this.options,ele.type)
                    // });
                    this.list.sort((a,b)=>{
                        if(parseInt(a.sort) != parseInt(b.sort)){
                            return parseInt(a.sort) - parseInt(b.sort)
                        }else{
                            return a.status - b.status
                        }
                    })
                    this.originalList.sort((a,b)=>{
                        if(parseInt(a.sort) != parseInt(b.sort)){
                            return parseInt(a.sort) - parseInt(b.sort)
                        }else{
                            return a.status - b.status
                        }
                    })
                    this.total = this.list.length
                }
                this.listLoading = false
            })
        },
        handleAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let obj = Object.assign({},this.form)
                    obj.status = obj.status?1:0
                    obj.sort = (obj.sort == "" || obj.sort == undefined)?0:obj.sort
                    let [...dataList] = this.originalList
                    dataList.push(obj)
                    this.templateData.content = JSON.stringify(dataList)
                    this.createdLoading = true
                    this.setContent()
                }
            })
        },
        deleteList(index,rows){
            this.$confirm(
                "此操作将永久删除该变量模板, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                rows.splice(index, 1);
                let content = (rows.length!=0)?JSON.stringify(rows):''
                this.templateData.content = content
                this.setContent()
            }).catch(() => {});
        },
        updateList(index,rows){
            this.flag = 'edit'
            this.form = Object.assign({},rows[index])
            this.form.status = this.form.status==1?true:false
            this.editIndex = index
        },
        handleEdit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let obj = Object.assign({},this.form)
                    obj.status = obj.status?1:0
                    obj.sort = (obj.sort == "" || obj.sort == undefined)?0:obj.sort
                    let [...dataList] = this.originalList
                    dataList.splice(this.editIndex, 1,obj)
                    this.templateData.content = JSON.stringify(dataList)
                    this.createdLoading = true
                    this.setContent()
                }
            })
            
        },
        // 保存变量
        setContent(){
            set_templateObj(this.templateData).then(res => {
                if(res.data.success == true){
                    this.getList()
                    this.cancelEdit()
                    this.$notify({
                        title: '成功',
                        message: "保存成功",
                        type: "success",
                        duration: 2000
                    });
                }else{
                    this.$notify({
                        title: '失败',
                        message: "保存失败",
                        type: "error",
                        duration: 2000
                    });
                }
            })
        },
        cancelEdit(){
            this.flag = 'add'
            this.resetTem()
        },
        resetTem(){
            this.form={
                name:'',
                label:'',
                sort:'',
                type:'',
                status:true
            }
            this.createdLoading = false
            this.$refs.form.resetFields();
        },
        uploadSuccess(response, file, fileList){
            this.$notify({
                title: '成功',
                message: "导入成功",
                type: "success",
                duration: 2000
            });
            this.getList()
        },
        uploadError(){
            this.$notify.error({
                title: '错误',
                message: '导入失败，请检查文件是否正确'
            });
        },
        beforeAvatarUpload(file){
            const isJPG = file.type === 'application/vnd.ms-excel';
            // const isLt2M = file.size / 1024 / 1024 < 2; 文件大小2M
            if (!isJPG) {
            this.$message.error('只允许上传 CSV 格式文件!');
            }
            return isJPG;
        }
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>
