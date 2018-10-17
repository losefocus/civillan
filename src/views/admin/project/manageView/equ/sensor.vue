<template>
    <div>
        <div style="padding-bottom:10px;">设 备 : {{dataInfo.name}}</div>
        <el-form :model="form" class="clearfix" ref="form" :rules="rules" label-width="0" size="small" style="margin-bottom:10px;">
            <el-form-item label="" prop="type" style="width: 100px;margin-right:5px">
                <el-select v-model="form.type" placeholder="选择类型" size="mini" no-data-text="请先添加变量类型">
                    <el-option
                    v-for="item in dicts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="name" style="width: 140px;margin-right:5px">
                <el-input v-model="form.name" size="mini" auto-complete="off" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="" prop="label" style="width: 100px;margin-right:5px">
                <el-input v-model="form.label" size="mini" auto-complete="off" placeholder="标识"></el-input>
            </el-form-item>
            <el-form-item label="" prop="max_value" style="width: 100px;margin-right:5px" v-show="form.type == 'float' || form.type == '1' || form.type == 'integer' || form.type == '2' || form.type == 'double' || form.type == '4'">
                <el-input v-model="form.maxValue" size="mini" auto-complete="off" placeholder="最大值"></el-input>
            </el-form-item>
            <el-form-item label="" prop="min_value" style="width: 100px;margin-right:5px" v-show="form.type == 'float' || form.type == '1' || form.type == 'integer' || form.type == '2' || form.type == 'double' || form.type == '4'">
                <el-input v-model="form.minValue" size="mini" auto-complete="off" placeholder="最小值"></el-input>
            </el-form-item>
            <el-form-item label="" style="width: 60px;margin-right:5px">
                <el-input v-model="form.sort" size="mini" auto-complete="off" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item  :style="flag == 'add'?'width: 80px':'width: 150px'" class="pull-right">
                <div v-if="flag == 'add'">
                    <el-button size="mini" type="primary" class="pull-right" @click="handleAdd('form')" :loading="createdLoading">添加</el-button>
                </div>
                <div v-else >
                    <el-button size="mini" type="info" class="pull-right" style="margin-left:10px" @click="cancelEdit('form')">取消</el-button>
                    <el-button size="mini" type="primary" class="pull-right" @click="handleEdit('form')" :loading="createdLoading">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item style="width: 70px;margin-left:5px" class="pull-right">
                <el-checkbox v-model="form.status" >已启用</el-checkbox>
            </el-form-item>
        </el-form>
        <div style="margin-bottom:10px;" class="clearfix">
            <download-btn :header="header" :data="data" class="pull-left" style="margin-right:10px">导出</download-btn> 
            <!-- <el-button @click="importexcel" size="mini">导出excel</el-button> -->
            <el-upload
                class="upload-demo pull-left"
                ref="upload"
                :headers="headers"
                action="/device/device_sensor/import"
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
            <el-table :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%;margin-bottom:20px;margin-top:10px">
                <el-table-column type="selection" align="center" width="50">
                </el-table-column>
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
                <el-table-column align="center" label="类型" >
                    <template slot-scope="scope">
                        <span>{{scope.row.type}}</span>
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
                        <el-button size="mini" type="" plain @click="deleteList(scope.row)" style="margin-left:0">删除</el-button>
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
  import {mapGetters} from "vuex";
  import {remote} from "@/api/dict";
  import {getToken} from "@/util/auth";
  import {findByvalue} from "@/util/util";
  import {addObj, delObj, download, editObj, getObj} from "@/api/device/sensor";
  import downloadBtn from "./downloadBtn"

  export default {
    components:{downloadBtn},
    props:['dataInfo'],
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
                callback(new Error('请输入名称'));
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
                type: [{ validator: validateType,trigger: 'change' }],
                name: [{ validator: validateName,trigger: 'blur' }],
                label: [{ validator: validateLabel,trigger: 'blur' }],
            },
            header:[],
            data:[],
            listLoading:false,
            createdLoading:false,
            dicts:[],
            form:{
                name:'',
                label:'',
                sort:0,
                type:'',
                maxValue:0,
                minValue:0,
                status:true
            },
            flag:'add',
            listQuery:{
                deviceId:this.dataInfo.id,
                page_index: 1,
                page_size: 10
            },
            total:null,
            list:null,
            originalList:[],
            listSelection : [],
            headers:{Authorization: "Bearer " + getToken()},
            params:{device_id:this.dataInfo.id},
        }
    },
    created() {
        remote("data_type").then(response => {
            this.dicts = response.data.result;
        });
    },
    mounted() {
        this.getList()
    },
    computed: {
        ...mapGetters(["sensorList"]),
    },
    methods:{
        handleSelectionChange(val) {
            this.listSelection = val;
            this.header = [{label:'标识',prop:'label'},{label:'变量名称',prop:'name'},{label:'类型',prop:'type'}]
            this.data = val
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
            getObj(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.list.forEach(ele => {
                    ele.type = findByvalue(this.dicts,ele.type)
                });
                this.list.sort((a,b)=>{
                    return parseInt(a.sort) - parseInt(b.sort)
                })
                this.total = res.data.result.total
                this.listLoading = false
                this.resetTem()
            })
        },
        updateList(row){
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = this.form.status==1?true:false
        },
        deleteList(row){
            this.$confirm(
                "此操作将永久删除该变量(变量名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(res => {
                    this.getList(this.listQuery)
                    this.$parent.$parent.$parent.$parent.alertNotify('删除')
                })
            })
            
        },
        handleAdd(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = Object.assign({},this.form)
                    data.sort = (data.sort == "" || data.sort == undefined)?0:data.sort
                    data.status = data.status?1:0
                    data.deviceId = this.dataInfo.id
                    this.createdLoading = true
                    addObj(data).then(res => {
                        this.getList(this.listQuery)
                        this.$parent.$parent.$parent.$parent.alertNotify('添加')
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
                    data.sort = (data.sort == "" || data.sort == undefined)?0:data.sort
                    data.status = data.status?1:0
                    editObj(data).then(res => {
                        this.getList(this.listQuery)
                        this.$parent.$parent.$parent.$parent.alertNotify('修改')
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
                name:'',
                label:'',
                sort:0,
                type:'',
                maxValue:0,
                minValue:0,
                status:true
            }
            this.createdLoading = false
            this.$refs.form.resetFields()
        },
        importexcel() {　
        　　require.ensure([], () => {　　　　　　　　
                const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　
                const tHeader = ['变量名称', '标识', '类型']; //将对应的属性名转换成中文
                //const tHeader = [];　
                const filterVal = ['name', 'label', 'type'];//table表格中对应的属性名　　　　　 　　　
                const list = this.listSelection;　　　　
                if(list.length == 0){
                    this.$message({
                        message: '请选择导出数据',
                        type: 'warning'
                    });
                    return
                }　　　　
                const data = this.formatJson(filterVal, list);　　　　　　　　
                export_json_to_excel(tHeader, data, 'excel文件');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        uploadSuccess(response, file, fileList){
            this.$parent.$parent.$parent.$parent.alertNotify('上传')
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

</style>
