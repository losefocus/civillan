<template>
    <div class="app-container calendar-list-container" style="min-height: 741px;overflow:hidden">
        <div v-show="showView === 'index'"  class="clearfix">
            <div class="pull-left"  style="width:100%">
                <div class="filter-container">
                    <el-button size="small" type="primary" @click="handleAdd">添加项目</el-button>
                    <el-button style="" @click="toProjectMap"  size="small" type="primary">项目地图</el-button>
                    <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
                    <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="项目名称" v-model="listQuery.name"></el-input>
                    <el-select v-model="adminer_" clearable class="pull-right" placeholder="按项目管理员筛选" style="width:150px!important;margin-right:10px" size="small"  @change="handleFilter">
                        <el-option
                        v-for="item in adminerOptions_"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div v-loading="listLoading" >
                    <el-table :data="list" fit style="width: 100%;margin-bottom:25px;margin-top:15px;" :row-class-name="setClassName" ref="projectTable">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" ref="subTable" id="subTable" size="mini">
                                    <el-table-column align="left" label="项目名称" min-width="250">
                                        <template slot-scope="pro">
                                            <div style="white-space:nowrap;width:100%;height:45px;padding-left:20px;">
                                                <img v-if="pro.row.thumbnailUrl&&pro.row.thumbnailUrl!=''" style="height:45px;width:60px;" class="pull-left" :src="pro.row.thumbnailUrl+pro.row.thumbnailPath">
                                                <img v-else style="width:60px;height:45px" class="pull-left" src="../../../assets/img/no_pic.png">
                                                <el-tooltip class="item" effect="dark" :content="pro.row.name" placement="top-start" :open-delay="300">
                                                    <span style="white-space:nowrap;cursor: pointer;"><a style="overflow: hidden;text-overflow:ellipsis;line-height:45px;padding:0 10px;width:calc(100% - 80px)" @click="toInfo(pro.row)">{{pro.row.name}}</a></span>
                                                </el-tooltip>
                                            </div>
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="left" label="工期" min-width="170">
                                        <template slot-scope="scope">
                                            <span style="padding-left:20px;">{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                                        </template>
                                    </el-table-column>        
                                    <el-table-column align="left" label="管理员">
                                        <template slot-scope="pro">
                                            <span style="padding-left:20px;">{{adminerHash[pro.row.adminer]}}</span>
                                        </template>
                                    </el-table-column>      
                                    <el-table-column align="center" label="操作" class-name="lastTd" min-width="80">
                                        <template slot-scope="pro">
                                            <el-dropdown trigger="click" @command="handleCommand" placement="bottom" style="padding-left:20px;">
                                                <span style="cursor:pointer">
                                                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                                                </span >
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :command="composeValue('info',pro.row)">项目详情</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_institutions" :command="composeValue('org',pro.row)">机构设置</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_personnel" :command="composeValue('per',pro.row)">人员管理</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_device" :command="composeValue('equ',pro.row)">设备管理</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_doc" :command="composeValue('doc',pro.row)">文档资料</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_doc" :command="composeValue('media',pro.row)">现场影像</el-dropdown-item>
                                                    <el-dropdown-item v-if="project_btn_doc" :command="composeValue('config',pro.row)">作业配置</el-dropdown-item>
                                                    <!-- <el-dropdown-item divided v-if="project_btn_add" :command="composeValue('add',pro.row)">添加子项</el-dropdown-item> -->
                                                    <el-dropdown-item divided v-if="project_btn_edit" :command="composeValue('edit',pro.row)">修改项目</el-dropdown-item>
                                                    <el-dropdown-item  v-if="project_btn_del" :command="composeValue('del',pro.row)">删除项目</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="项目名称" min-width="250">
                            <template slot-scope="scope">
                                <div style="white-space:nowrap;width:100%;height:45px">
                                    <img v-if="scope.row.thumbnailUrl&&scope.row.thumbnailUrl!=''" style="height:45px;width:60px;" class="pull-left" :src="scope.row.thumbnailUrl+scope.row.thumbnailPath">
                                    <img v-else style="width:60px;height:45px" class="pull-left" src="../../../assets/img/no_pic.png">
                                    <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start" :open-delay="300">
                                        <span style="white-space:nowrap;">
                                            <span v-if="scope.row.children==0" style="cursor: pointer;overflow: hidden;text-overflow:ellipsis;line-height:45px;padding:0 10px;width:calc(100% - 80px)" @click="toInfo(scope.row)">{{scope.row.name}}</span>
                                            <span v-else style="cursor: pointer;overflow: hidden;text-overflow:ellipsis;line-height:45px;padding:0 10px;width:calc(100% - 80px)" @click="expendTableRow(scope.row)">{{scope.row.name}}</span>
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="工期" min-width="170">
                            <template slot-scope="scope">
                                <span>{{scope.row.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{scope.row.endAt | parseTime('{y}-{m}-{d}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="管理员" min-width="130">
                            <template slot-scope="scope">
                                <span>{{adminerHash[scope.row.adminer]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" min-width="80">
                            <template slot-scope="pro" >
                                <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                                    <span style="cursor:pointer;">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span >
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :disabled="pro.row.children.length!=0" :command="composeValue('info',pro.row)">项目详情</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_institutions" :command="composeValue('org',pro.row)">机构设置</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_personnel" :command="composeValue('per',pro.row)">人员管理</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_device" :disabled="pro.row.children.length!=0" :command="composeValue('equ',pro.row)">设备管理</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_doc" :command="composeValue('doc',pro.row)">文档资料</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_doc" :command="composeValue('media',pro.row)">现场影像</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_doc" :disabled="pro.row.children.length!=0" :command="composeValue('config',pro.row)">作业配置</el-dropdown-item>
                                        <el-dropdown-item divided v-if="project_btn_add" :command="composeValue('add',pro.row)">添加子项</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_edit" :command="composeValue('edit',pro.row)">修改项目</el-dropdown-item>
                                        <el-dropdown-item v-if="project_btn_del" :command="composeValue('del',pro.row)">删除项目</el-dropdown-item>
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
            <el-card class="pull-right addNewProject" :class="{'show':cardVisibel}">
                <div class="tit"><h3>{{(flag == 'add')?'添加':'修改'}}项目</h3><span>{{(flag == 'add')?'Add':'Edit'}} Project</span><i class="closeBtn el-icon-close" @click="cardVisibel = false"></i></div>
                <el-form label-width="55px" :model="form" :rules="rules" ref="form" status-icon label-position="left">
                    <el-form-item label="上级" prop="parentId" >
                        <el-select v-model="form.parentId" size="small" :loading='listLoading' placeholder="请选择" :disabled="flag=='edit'">
                            <el-option
                            v-for="item in parentIdOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" size="small" placeholder="请输入项目名称"></el-input>
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
                        <el-select v-model="form.adminer" size="small" placeholder="请选择项目管理员" :loading="adminerOptionsloading" no-data-text="请先添加项目管理员">
                            <el-option
                            v-for="item in adminerOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                    </el-form-item>
                    <el-form-item label="位置" prop="position">
                        <el-input v-model="form.position" size="small" readonly placeholder="点击打开地图选点" @focus="positionPicker"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="thumbnailPath">
                        <el-upload
                        v-loading='uploadLoaing'
                        class="avatar-uploader"
                        ref="upload"
                        :headers="headers"
                        action="/file/attachment/upload"
                        :limit="999"
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
                        :autosize="{ minRows: 4, maxRows: 4}"
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
        <div v-if="showView == 'mapView'" >
            <map-view :station-data="mapList"></map-view>
        </div>
        <div v-show="showView == 'manage'">
            <project-manage ref="proManage" :view-data='viewData'></project-manage>
        </div>
        <el-dialog :visible.sync="positionVisible" id="mapPosition">
            <map-position v-if="positionVisible == true"></map-position>
        </el-dialog>
    </div>
</template>

<script>
  import {getToken} from "@/util/auth";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  import {addObj, delObj, editObj, fetchAdminList, fetchList, uploadImg} from "@/api/project";
  import {mapGetters} from "vuex";
  import mapView from "./map";
  import projectManage from "./manage";
  import mapPosition from "./mapPosition";

  export default {
    directives: {
        waves
    },
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
        var validateParentId = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请选择管理员'));
            } else {
                callback();
            }
        };
        return {
            rules: {
                parentId: [
                    {validator: validateParentId, message: '请选择上级', trigger: 'change' }
                ],
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
            adminer_:'',
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            listLoading:false,
            mapList:[],
            list:[],
            total:null,
            showView:'index',
            viewData:null,
            parentIdOptions:[],
            adminerOptions:[],
            adminerOptions_:[],
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
                status:false,
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
            project_btn_institutions:false,
            project_btn_personnel:false,
            project_btn_device:false,
            project_btn_doc:false,
            cardVisibel:false,
            expandRow:null,
        }
    },
    created() {
        this.getList();
        this.getRoleList();
    },
    mounted() {
        this.project_btn_add = this.permissions["project_btn_add"];
        this.project_btn_edit = this.permissions["project_btn_edit"];
        this.project_btn_del = this.permissions["project_btn_del"];
        this.project_btn_institutions = this.permissions["project_btn_institutions"];
        this.project_btn_personnel = this.permissions["project_btn_personnel"];
        this.project_btn_device = this.permissions["project_btn_device"];
        this.project_btn_doc = this.permissions["project_btn_doc"];
        if(this.projectState.data != undefined){
            this.toInfo(this.projectState.data)
        }
    },
    computed: {
        ...mapGetters(["permissions","adminerHash","projectState"])
    },
    methods:{
        toInfo(info){
            this.showView = 'manage'
            this.$refs.proManage.tabView = 'info'
            this.viewData = info
        },
        expendTableRow(row){
            this.$refs.projectTable.toggleRowExpansion(row);
        },
        handleAdd(row){
            this.cardVisibel = true
            this.flag = 'add'
            this.form.parentId = row.parentId?row.id:0
            this.expandRow = row
            //this.$refs.projectTable.toggleRowExpansion(this.expandRow,true);
        },
        setClassName({row, index}){
            return row.children.length != 0 ? '' : 'expand';
        },
        //管理员列表
        getRoleList(){
            function isProjectAdmin(value){ 
                return value.roleCode == "ROLE_PROJECT_ADMIN";
            }
            this.adminerOptionsloading = true
            let data_ = {
                page_index: 1,
                page_size: 9999,
            }
            fetchAdminList(data_).then(response => {
                let datas = response.data.result.items;
                let options = []
                let hash ={}
                for (let i=0; i<datas.length; i++) {
                    let rolelist = datas[i].roleList
                    if(rolelist.some(isProjectAdmin)){  //若rolelist数组中存在project_admin，则返回true
                        let label = datas[i].name?datas[i].name+'('+datas[i].username+')':datas[i].username
                        options.push({value:datas[i].id,label:label}) 
                    }
                    hash[datas[i].id] =datas[i].name!=''?datas[i].name+'('+datas[i].username+')':datas[i].username
                } 
                
                this.adminerOptions = options
                this.adminerOptions_ = options.concat()
                this.adminerOptions_.unshift({value:0,label:'全部项目管理员'})
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
                treeArray[i].children = [];
                if("parentId" in treeArray[i] && treeArray[i].parentId == 0){
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
                    }).catch(err => {
                        this.createLoading = false
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
                    }).catch(err => {
                        this.createLoading = false
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
                status:false,
            }
            this.tm=[]
            this.imageName=''
            this.fileList=[]
            this.createLoading = false
            this.uploadLoaing = false
            this.$refs[formName].resetFields();
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            if(this.adminer_ == 0){
                delete this.listQuery.adminer
            }else{
                this.listQuery.adminer = this.adminer_
            }
            // if(this.listQuery.adminer === '') delete this.listQuery.adminer
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
            if(command.value == 'add') this.handleAdd(command.row)
            else if(command.value == 'del') this.delProject(command.row)
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
    },

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
    width: 300px;
    padding-top: 0 ;
    position: absolute;
    top: -1px;
    right: -315px;
    min-height: 740px;
    z-index: 9;
}
.addNewProject.show{
    right: -1px;
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
    background: #409eff;
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

