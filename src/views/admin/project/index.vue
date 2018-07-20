<template>
    <div class="app-container calendar-list-container">
        <div v-show="showView === 'index'"  class="clearfix">
            <div class="pull-left"  style="width:100%">
                <div class="filter-container">
                    <el-button size="small" type="primary" @click="handleAdd">添加项目</el-button>
                    <el-button style="" @click="toProjectMap"  size="small" type="primary">项目地图</el-button>
                    <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="项目搜索" v-model="listQuery.keyword"></el-input>
                </div>
                <div v-loading="listLoading" >
                    <el-table :data="list" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%;margin-bottom:25px;margin-top:15px;" :row-class-name="setClassName">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children"  border ref="subTable" id="subTable" size="mini">
                                    <el-table-column align="center" label="缩略图">
                                        <template slot-scope="pro">
                                            <div style="height:30px">
                                            <img style="width:40px;height:30px" :src="pro.row.thumbnailUrl+pro.row.thumbnailPath">
                                            </div>
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="left" label="项目名称" min-width="250">
                                        <template slot-scope="pro">
                                            <el-tooltip class="item" effect="dark" :content="pro.row.name" placement="top-start">
                                                <span style="white-space:nowrap;cursor: pointer;padding-left:20px;"><a>{{pro.row.name}}</a></span>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>      
                                    <!-- <el-table-column align="center" label="开始时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.beginAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="结束时间" min-width="100">
                                        <template slot-scope="pro">
                                            {{pro.row.endAt | parseTime('{y}-{m}-{d}')}}
                                        </template>
                                    </el-table-column>    -->
                                    <el-table-column align="center" label="工期" min-width="170">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                                        </template>
                                    </el-table-column>        
                                    <el-table-column align="center" label="管理员">
                                        <template slot-scope="pro">
                                            {{adminerHash[pro.row.adminer]}}
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="操作" class-name="lastTd" min-width="80">
                                        <template slot-scope="pro">
                                            <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                                                <span style="cursor:pointer">
                                                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                                                </span >
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item 
                                                    v-for="(item,index) in btnList" 
                                                    :key="index" 
                                                    :disabled="!item.flag"
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
                                <div style="height:40px">
                                    <img v-if="scope.row.children.length==0" style="width:60px;height:40px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                                    <i v-else class="iconfont icon-wenjianjia" style="font-size:30px;line-height:40px;"></i>
                                </div>
                                <!-- <img style="width:30px;height:30px" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath"> -->
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="项目名称" min-width="250">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start">
                                    <span style="white-space:nowrap;cursor: pointer;font-weight: bold;"><a>{{scope.row.name}}</a></span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="工期" min-width="170">
                            <template slot-scope="scope">
                                <span style="font-weight: bold;">{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="管理员">
                            <template slot-scope="scope">
                                <span style="font-weight: bold;">{{adminerHash[scope.row.adminer]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" min-width="80">
                            <template slot-scope="pro" >
                                <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                                    <span style="cursor:pointer;font-weight: bold;">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span >
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                        v-if="pro.row.children.length ==0"
                                        v-for="(item,index) in btnList" 
                                        :key="index"
                                        :disabled="!item.flag"
                                        :command="composeValue(item.value,pro.row)">
                                        {{item.label}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :divided="pro.row.children.length == 0" v-if="project_btn_edit" :command="composeValue('edit',pro.row)">修改</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_del" :command="composeValue('del',pro.row)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>    
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <el-card class="pull-right addNewProject" :style="cardHeight" :class="{'show':cardVisibel}">
                <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}项目</h3><span>{{(flag == 'add')?'Add':'Edit'}} Project</span><i class="closeBtn el-icon-close" @click="cardVisibel = false"></i></div>
                <el-form label-width="55px" :model="form" :rules="rules" ref="form" status-icon label-position="left">
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
                        style="width:205px"
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
                    <el-form-item label="位置" prop="position">
                        <el-input v-model="form.position" size="small" readonly placeholder="请选择位置" @focus="positionPicker"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="thumbnailPath">
                        <el-upload
                        v-loading='uploadLoaing'
                        class="avatar-uploader"
                        ref="upload"
                        :headers="headers"
                        action="/file/attachment/upload"
                        :limit="10"
                        :data="params"
                        name="uploadFile"
                        :show-file-list ="false"
                        :before-upload='beforeUpload'
                        :on-success="uploadSuccess"
                        :file-list="fileList"
                        :auto-upload="true">
                            <img v-if="form.thumbnailUrl!='' && form.thumbnailUrl!=undefined" :src="form.thumbnailUrl+form.thumbnailPath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
                        <el-checkbox label="已启用" v-model="form.status" size="small"></el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="flag == 'add'" type="primary" :loading="createLoading" @click="submitForm('form')" size="small" style="width:85px;" :disabled="!project_btn_add">添加</el-button>
                        <el-button v-else  type="primary" :loading="createLoading" @click="handleUpdata('form')" size="small" style="width:85px;">保存</el-button>
                        <el-button  type="info" @click="cancel('form')" size="small" style="width:85px;">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div v-if="showView === 'mapView'" >
            <map-view :station-data="mapList"></map-view>
        </div>
        <div v-show="showView === 'manage'">
            <project-manage ref="proManage" :view-data='viewData'></project-manage>
        </div>
        <el-dialog :visible.sync="positionVisible" id="mapPosition">
            <map-position v-if="positionVisible == true"></map-position>
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
            let val = this.tm
            if (val === '' || val== undefined) {
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
                status:true,
            },
            tm:[],
            imageName:'',
            fileList: [],
            flag:'add',
            headers:{Authorization: "Bearer " + getToken()},
            params:{component :'project'},
            uploadLoaing:false,
            positionVisible:false,
            createLoading:false,
            project_btn_add:false,
            project_btn_edit :false,
            project_btn_del :false,
            cardHeight:{'height':null},
            cardVisibel:false,
        }
    },
    created() {
        this.getList();
        this.getRoleList();
        this.getCardHeight()
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
        getCardHeight(){
            this.cardHeight.height = document.body.clientHeight - 107  - 30 + 'px'
        },
        handleAdd(){
            this.cardVisibel = true
            this.flag = 'add'
            this.resetForm()
        },
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
        beforeUpload(){
            this.uploadLoaing = true
        },
        uploadSuccess(response, file, fileList){
            if(response.success == false){
                this.$notify.error({
                    title: '错误',
                    message: '图片获取失败'
                });
            }else{
                this.form.thumbnailPath = response.result.path
                this.form.thumbnailUrl = response.result.baseUrl
                this.imageName = response.result.name
                this.fileList = []
            }
            this.uploadLoaing = false
            
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
                    addObj(formData).then(response => {
                        this.createLoading = false
                        this.getList()
                        this.cancel(formName)
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
                if(row.children && row.children.length>0){
                    this.$notify({
                        title: "错误",
                        message: "请先删除子项目",
                        type: "error",
                        duration: 2000
                    });
                }else{
                    delObj(row.id).then(response => {
                        this.getList()
                        this.alertNotify('删除')
                    })
                }
            })   
        },
        updataForm(row){
            this.flag = 'edit'
            this.cardVisibel = true
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
                        this.cancel(formName)
                        this.alertNotify('修改')
                    })
                }
            })
        },
        cancel(formName){
            this.flag = 'add'
            this.resetForm(formName)
            this.cardVisibel = false
        },
        resetForm(formName){
            this.form={
                parentId:0,
                name:'',
                adminer:'',
                thumbnailPath:'',
                thumbnailUrl:'',
                position:'',
                comment:'',
                status:true,
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
.avatar-uploader{
     height: 110px;
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
    height: 110px;
    line-height: 110px;
    text-align: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .avatar {
    width: 203px;
    height: 110px;
    display: block;
    border-radius: 4px;
  }
.app-container{
    position: relative;
}
.el-form-item{
    margin-bottom: 15px;
}
.addNewProject{
    background: #fff;
    /* height: 500px; */
    width: 300px;
    padding-top: 0 ;
    position: absolute;
    top: -16px;
    right: -315px;
    z-index: 9
}
.addNewProject.show{
    right: -8px;
}
.addNewProject .tit{
    margin-top:-20px;
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    position: relative;
    margin-bottom: 20px;
}
.addNewProject h3{
    float: left;
    line-height: 60px;
    padding-left:20px;
    font-weight: bold;
}
.addNewProject .tit::before{
    display: block;
    content: '';
    width: 4px;
    background: #30a487;
    height:20px;
    position: absolute;
    left: 0;
    top: 20px;
}
.addNewProject span{
    line-height: 70px;
    color: #cacaca;
    font-size: 12px;
    padding-left: 20px;
    letter-spacing: 1px;
}
.closeBtn{
    cursor: pointer;
    float: right;
    margin-top: 22px;
    color: #6b6b6b;
    transition: transform .3s ease-out 0s,-webkit-transform .3s ease-out 0s;
}
.closeBtn:hover{
    transform: rotate(180deg)
}
</style>

