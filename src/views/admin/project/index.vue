<template>
    <div class="app-container calendar-list-container">
        <div v-show="showView === 'index'"  class="clearfix">
            <div class="pull-left"  style="width:calc(100% - 320px)">
                <div class="filter-container">
                    <el-button class="filter-item" style="" @click="toProjectMap"  size="small" type="primary" icon="edit" >项目地图
                    </el-button>
                    <div class="pull-right">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" suffix-icon="el-icon-search" class="filter-item" placeholder="项目搜索" v-model="listQuery.keyword">
                        </el-input>
                    </div>
                </div>
                <div v-loading="listLoading" >
                    <el-table :data="list" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;margin-bottom:10px" :row-class-name="setClassName">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children"  border ref="subTable" id="subTable">
                                    <el-table-column align="center" label="缩略图">
                                        <template slot-scope="pro">
                                            <img style="width:50px;height:50px" :src="pro.row.thumbnailUrl+pro.row.thumbnailPath" :alt="pro.row.name">
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="left" label="项目名称" min-width="170">
                                        <template slot-scope="pro">
                                            <el-tooltip class="item" effect="dark" :content="pro.row.name" placement="top-start">
                                                <span class="nameBox"><a>{{pro.row.name}}</a></span>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="开始时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.beginAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="结束时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.endAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>           
                                    <el-table-column align="center" label="管理员">
                                        <template slot-scope="pro">
                                            {{adminerHash[pro.row.adminer]}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="操作" class-name="lastTd" width="80">
                                        <template slot-scope="pro">
                                            <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                                                <span style="cursor:pointer">
                                                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                                                </span >
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item 
                                                    v-for="(item,index) in btnList" 
                                                    :key="index" 
                                                    v-if="item.flag"
                                                    :command="composeValue(item.value,pro.row)">
                                                    {{item.label}}
                                                    </el-dropdown-item>
                                                    <el-dropdown-item divided v-if="project_btn_edit" :command="composeValue('edit',pro.row)">修改</el-dropdown-item>
                                                    <el-dropdown-item  v-if="project_btn_del" :command="composeValue('del',pro.row)">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="缩略图">
                            <template slot-scope="scope">
                                <div style="height:50px">
                                    <img style="width:50px;height:50px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                                </div>
                                <!-- <img style="width:30px;height:30px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath"> -->
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="项目名称" min-width="170">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start">
                                    <span class="nameBox"><a>{{scope.row.name}}</a></span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="开始时间" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="结束时间" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="管理员">
                            <template slot-scope="scope">
                                <span>{{adminerHash[scope.row.adminer]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="80">
                            <template slot-scope="pro" >
                                <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                                    <span style="cursor:pointer">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span >
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                        v-if="pro.row.children.length !=0"
                                        v-for="(item,index) in btnList" 
                                        :key="index" 
                                        :disabled="item.flag"
                                        :command="composeValue(item.value,pro.row)">
                                        {{item.label}}
                                        </el-dropdown-item>
                                        <el-dropdown-item divided v-if="project_btn_edit" :command="composeValue('edit',pro.row)">修改</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_del" :command="composeValue('del',pro.row)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <!-- <el-button size="small" type="danger" plain @click="delProject(pro.row)" v-if="project_btn_del">删除</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>    
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div class="pull-right addNewProject">
                <h3>添加项目</h3>
                <el-form label-width="65px" :model="form" :rules="rules" ref="form" status-icon>
                    <el-form-item label="上级" prop="parentId" >
                        <el-select v-model="form.parentId" size="small" :loading='listLoading' placeholder="请选择">
                            <el-option
                            v-for="item in parentIdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" size="small" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="工期" prop="beginAt">
                        <el-date-picker
                        style="width:195px"
                        size="small"
                        v-model="tm"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yy-MM-dd"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="管理员" prop="adminer">
                        <el-select v-model="form.adminer" size="small" placeholder="请选择" :loading="adminerOptionsloading">
                            <el-option
                            v-for="item in adminerOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                    </el-form-item>
                    <el-form-item label="图片" prop="thumbnailPath">
                        <el-upload
                        class="avatar-uploader"
                        ref="upload"
                        :headers="headers"
                        action="/file/attachment/upload"
                        :limit="10"
                        :data="params"
                        name="uploadFile"
                        :show-file-list ="false"
                        :on-success="uploadSuccess"
                        :file-list="fileList"
                        :auto-upload="true">
                            <!-- <el-button slot="trigger" size="small" type="primary">选取</el-button>
                            <el-input v-model="imageName" style="width:135px" size="small" placeholder="请选取图片"></el-input> -->
                            <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailUrl+form.thumbnailPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="位置" prop="position">
                        <el-input v-model="form.position" size="small" readonly placeholder="请选择位置" @focus="positionPicker"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="comment">
                        <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="form.comment">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
                        <el-button type="primary" class="pull-right" @click="submitForm('form')" size="small" :loading="createLoading" style="width:90px;" :disabled="!project_btn_add">添加</el-button> -->
                        <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
                        <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" class="pull-right" @click="submitForm('form')" size="small" style="width:85px;" :disabled="!project_btn_add">添加</el-button>
                        <div v-else class="clearfix">
                            <el-button  type="primary" :loading="createLoading" class="pull-left" @click="handleUpdata('form')" size="small" style="width:85px;">保存</el-button>
                            <el-button  type="info" class="pull-right" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
                        </div> 
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-if="showView === 'mapView'" >
            <map-view :station-data="mapList"></map-view>
        </div>
        <div v-show="showView === 'manage'">
            <project-manage ref="proManage" :view-data='viewData'></project-manage>
        </div>
        <el-dialog :visible.sync="positionVisible" id="mapPosition">
            <map-position></map-position>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from "@/util/auth";
import { fetchList,fetchAdminList,addObj,uploadImg,delObj,editObj} from "@/api/project";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js";
import mapView from "./map";
import projectManage from "./manage";
import mapPosition from "./mapPosition";

export default {
    components:{
        mapView,
        projectManage,
        mapPosition
    },
    data(){
        var validateName = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入项目名称'));
            } else {
                callback();
            }
        };
        var validateBeginAt = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择工期'));
            } else {
                callback();
            }
        };
        var validateAdminer = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择管理员'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                name: [
                    {validator: validateName, message: '请输入项目名称', trigger: 'blur' }
                ],
                beginAt: [
                    { validator: validateBeginAt, message: '请选择工期', trigger: 'blur' }
                ],
                adminer: [
                    { validator: validateAdminer, message: '请选择管理员', trigger: 'change' }
                ],

            },
            sys_user_upd:true,
            sys_user_del:true,
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            listLoading:false,
            mapList:[],
            list:[],
            total:null,
            btnList:[
                {
                    value:'org',
                    label:'机构',
                    btn:'project_btn_institutions',
                    flag:false
                },{
                    value:'per',
                    label:'人员',
                    btn:'project_btn_personnel',
                    flag:false
                },{
                    value:'equ',
                    label:'设备',
                    btn:'project_btn_device',
                    flag:false
                },{
                    value:'doc',
                    label:'文档',
                    btn:'project_btn_doc',
                    flag:false
                },
            ],
            showView:'index',
            viewData:null,
            parentIdOptions:[],
            adminerOptions:[],
            adminerOptionsloading:false,
            form:{
                parentId:0,
                name:'',
                beginAt:null,
                adminer:'',
                thumbnailPath:'',
                thumbnailUrl:'',
                position:'',
                comment:'',
                status:0,
            },
            tm:[],
            imageName:'',
            fileList: [],
            flag:'add',
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            positionVisible:false,
            createLoading:false,
            project_btn_add:false,
            project_btn_edit :false,
            project_btn_del :false,
        }
    },
    created() {
        this.getList();
        this.getRoleList();
        this.project_btn_add = this.permissions["project_btn_add"];
        this.project_btn_edit = this.permissions["project_btn_edit"];
        this.project_btn_del = this.permissions["project_btn_del"];
        this.btnList.forEach(element => {
            element.flag = this.permissions[element.btn]
        });
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions","adminerHash"])
    },
    methods:{
        setClassName({row, index}){
            return row.children.length != 0 ? '' : 'expand';
        },
        //管理员列表
        getRoleList(){
            this.adminerOptionsloading = true
            fetchAdminList().then(response => {
                let datas = response.data.result.items;
                let options = []
                let hash ={}
                for (let i=0; i<datas.length; i++) {
                    options.push({value:datas[i].id,label:datas[i].username}) 
                    hash[datas[i].id] = datas[i].username
                } 
                this.adminerOptions = options
                this.$store.commit("SET_ADMINERHASH",hash);
                this.adminerOptionsloading = false
            })
        },
        //项目列表
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                let datas = response.data.result.items;
                this.mapList = datas
                this.list = this.arrayToJson(datas);
                this.list.expand = true
                console.log(this.list)
                this.total = response.data.result.total;
                this.listLoading = false;
            });
        },
        //数组转为树结构
        arrayToJson(treeArray){
            var r = [];
            var tmpMap ={};
            let options = []
            options.push({value:0,label:'无'})
            for (let i=0; i<treeArray.length; i++) {
                if("parentId" in treeArray[i] && treeArray[i].parentId == 0){
                    treeArray[i].children = [];
                    tmpMap[treeArray[i].id]= treeArray[i]; 
                    options.push({value:treeArray[i].id,label:treeArray[i].name})
                }
            } 
            this.parentIdOptions = options
            for (let i=0; i<treeArray.length; i++) {
                if("parentId" in treeArray[i]) {
                    var key=tmpMap[treeArray[i].parentId];
                    if (key) {
                        key["children"].push(treeArray[i]);
                    } else {
                        r.push(treeArray[i]);
                    }
                }
            }
            return r
                
        },
        uploadSuccess(response, file, fileList){
            this.form.thumbnailPath = response.result.path
            this.form.thumbnailUrl = response.result.baseUrl
            this.imageName = response.result.name
            this.fileList = []
        },  
        positionPicker(){
            this.positionVisible = true
        },
        // 新增项目
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let formData = Object.assign({}, this.form);
                    formData.beginAt = Math.round(new Date(this.tm[0]).getTime()/1000);
                    formData.endAt = Math.round(new Date(this.tm[1]).getTime()/1000);
                    formData.adminer = formData.adminer
                    formData.status = formData.status?1:0
                    // delete formData.tm
                    // delete formData.fileList
                    // delete formData.imageName
                    addObj(formData).then(response => {
                        this.createLoading = false
                        this.getList()
                        this.resetForm(formName)
                        this.alertNotify('添加')
                    })
                }
            });
        },
        // 删除项目
        delProject(row){
            this.$confirm(
                "此操作将永久删除该项目(项目名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                delObj(row.id).then(response => {
                    this.getList()
                    this.alertNotify('删除')
                })
            })  
        },
        updataForm(row){
            console.log(row)
            this.flag = 'edit'
            this.form = Object.assign({},row)
            this.form.status = row.status == 1?true:false
            this.form.adminer = parseInt(row.adminer) 
            this.tm = [new Date(row.beginAt*1000),new Date(row.endAt*1000)]
        },
        handleUpdata(formName){ 
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.createLoading = true
                    let data = Object.assign({},this.form)
                    data.beginAt = Math.round(new Date(this.tm[0]).getTime()/1000);
                    data.endAt = Math.round(new Date(this.tm[1]).getTime()/1000);
                    data.status = data.status?1:0
                    delete data.children
                    // delete data.tm
                    editObj(data).then(res => {
                        this.createLoading = false
                        this.getList()
                        this.resetForm(formName)
                        this.alertNotify('修改')
                    })
                }
            })
        },
        cancel(formName){
            this.flag = 'add'
            this.resetForm(formName)
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
            this.form={
                parentId:0,
                name:'',
                adminer:'',
                thumbnailPath:'',
                thumbnailUrl:'',
                position:'',
                comment:'',
                status:0,
            }
            this.tm=[]
            this.imageName=''
            this.fileList=[]
        },
        handleFilter(){
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
        //地图
        toProjectMap(){ 
            this.showView = 'mapView'
        },
        handleCommand(command){
            if(command.value == 'del') this.delProject(command.row)
            else if(command.value == 'edit') this.updataForm(command.row)
            else{
                this.showView = 'manage'
                this.$refs.proManage.tabView = command.value
                this.viewData = command.row
            }
        },
        composeValue(item,row){
             return {
                'value': item,
                'row': row
            }
        },
        alertNotify(str){
            this.$notify({
                title: str,
                message: str+"成功",
                type: "success",
                duration: 2000
            });
        }
    }
}
</script>

<style scoped>
.nameBox{
    white-space:nowrap;
    cursor: pointer;
}
.avatar-uploader{
     height: 193px;
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
    width: 193px;
    height: 193px;
    line-height: 193px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 193px;
    height: 193px;
    display: block;
    border-radius: 4px;
  }

.el-form-item{
    margin-bottom: 15px;
}
.addNewProject{
    width: 260px;
    border: 1px solid #ebeef5;
    padding: 10px 20px 0 20px
}

</style>

