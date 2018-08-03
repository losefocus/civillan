<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加设备</el-button>
            <el-button class="filter-item" style="" @click="handleGroup" size="small" type="primary" icon="edit" >分组管理</el-button>
            <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="设备名称" v-model="listQuery.name"></el-input>
            <el-select v-model="listQuery.deviceGroup" clearable class="pull-right" placeholder="按所在分组筛选" style="width:150px;margin-right:10px" size="small"  @change="handleFilter">
                <el-option
                v-for="item in groupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 99%;margin-bottom:20px">
            <el-table-column align="center" label="缩略图" width="80px">
                <template slot-scope="scope">
                    <div style="height:40px">
                        <img v-if="scope.row.thumbnailBaseUrl!=''" style="width:60px;height:40px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        <img v-else style="width:60px;height:40px" src="../../../../assets/img/no_pic.png">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left" label="设备名称">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;cursor:pointer;"><a>{{scope.row.name}}</a></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在分组">
                <template slot-scope="scope">
                    <span>{{scope.row.deviceGroup.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="key" >
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top" :open-delay="300">
                        <i style="cursor:pointer;color:#30a487" class="iconfont icon-fuzhi copy_key" :data-clipboard-text="scope.row.key" @click="copy()" ></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.secret" placement="top" :open-delay="300">
                        <i style="cursor:pointer;color:#30a487" class="iconfont icon-fuzhi copy_key" :data-clipboard-text="scope.row.secret" @click="copy()" ></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="固件版本">
                <template slot-scope="scope">
                    <span>{{scope.row.firmware}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="激活日期" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <!-- <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span> -->
                    <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope" >
                    <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                        <span style="cursor:pointer">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span >
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  v-if="device_btn_config" :command="composeValue('configVisible',scope.row)">设备配置</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_variable" :command="composeValue('sensorVisible',scope.row)">变量管理</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_alert" :command="composeValue('alarmVisible',scope.row)">警报管理</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_notice" :command="composeValue('notifyVisible',scope.row)">通知管理</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_personnel" :command="composeValue('personnelVisible',scope.row)">操作人员</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_certificate" :command="composeValue('certiVisible',scope.row)">证书下载</el-dropdown-item>
                            <el-dropdown-item divided v-if="device_btn_edit" :command="composeValue('edit',scope.row)">修改设备</el-dropdown-item>
                            <el-dropdown-item v-if="device_btn_del" :command="composeValue('del',scope.row)">删除设备</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!-- <el-button size="small" type="success" plain @click="updataEqu(scope.row)" style="margin-left:0px" v-if="device_btn_edit">修改</el-button>
                    <el-button size="small" type="danger" plain @click="deleteEqu(scope.row)" style="margin-left:0px" v-if="device_btn_del">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total,  prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="设备配置"  :visible.sync="configVisible" width='690px'>
            <config v-if="configVisible" :data-info="dataInfo" ref="config"></config>
        </el-dialog>
        <el-dialog title="证书下载"  :visible.sync="certiVisible" width='690px'>
            <certi v-if="certiVisible" :data-info="dataInfo" ref="certi"></certi>
        </el-dialog>
        <el-dialog title="变量管理"  :visible.sync="sensorVisible" width='690px'>
            <sensor v-if="sensorVisible" :data-info="dataInfo" ref="sensor"></sensor>
        </el-dialog>
        <el-dialog title="警报管理"  :visible.sync="alarmVisible" width='690px'>
            <alarm v-if="alarmVisible" :data-info="dataInfo" ref="alarm"></alarm>
        </el-dialog>
        <el-dialog title="通知管理"  :visible.sync="notifyVisible" width='690px'>
            <notify v-if="notifyVisible" :data-info="dataInfo" ref="notify"></notify>
        </el-dialog>
        <el-dialog title="操作人员—绑定用户"  :visible.sync="personnelVisible" width='690px'>
            <personnel v-if="personnelVisible" :data-info="dataInfo" ref="personnel"></personnel>
        </el-dialog>
        <el-dialog title="分组管理"  :visible.sync="groupVisible" width='690px'>
            <group v-if="groupVisible" ref="group"></group>
        </el-dialog>
    </div>
</template>
<script>
import config from "./equ/config";
import certi from "./equ/certificate";
import sensor from "./equ/sensor";
import alarm from "./equ/alarm";
import notify from "./equ/notify";
import group from "./equ/group";
import personnel from "./equ/personnel";
import { mapGetters } from "vuex";
import {fetchList,delObj,updataObj,getConfigObj,getSensorObj,getAlarmObj,getNotifyObj} from "@/api/project_equ";
export default {
    components:{
        config,
        certi,
        sensor,
        alarm,
        notify,
        group,
        personnel
    },
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:null,
            flag:'add',
            createdLoading:false,
            configVisible:false,//配置
            certiVisible:false,//证书
            sensorVisible:false,//变量
            alarmVisible:false,//报警
            notifyVisible:false,//通知
            personnelVisible:false,//人员
            groupVisible:false,
            dataInfo:null,
            listInfoQuery:{
                page_index: 1,
                page_size: 20
            },
            device_btn_edit :false,
            device_btn_del :false,
            device_btn_certificate :false,
            device_btn_variable :false,
            device_btn_alert :false,
            device_btn_notice :false,
            device_btn_personnel :false,
            device_btn_config :false,

        }
    },
    created() {
        this.getList()
        this.device_btn_edit = this.permissions["device_btn_edit"];
        this.device_btn_del = this.permissions["device_btn_del"];
        this.device_btn_certificate = this.permissions["device_btn_certificate"];
        this.device_btn_variable = this.permissions["device_btn_variable"];
        this.device_btn_alert = this.permissions["device_btn_alert"];
        this.device_btn_notice = this.permissions["device_btn_notice"];
        this.device_btn_personnel = this.permissions["device_btn_personnel"];
        this.device_btn_config = this.permissions["device_btn_config"];
    },
    mounted() {

    },
    computed: {
        ...mapGetters(["permissions","groupOptions"])
    },
    methods:{
        handleAdd(){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addEqu.flag = 'add'
            this.$parent.$refs.addEqu.resetTemp()
        },
        handleGroup(){
            this.groupVisible = true
        },
        getList(){
            this.listLoading = true
            this.listQuery.projectId = this.projectInfo.id
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.listLoading = false
                // let options = []
                // res.data.result.items.forEach(element => {
                //     let ele = {value:element.id,label:element.name}
                //     options.push(ele)
                // });
                // console.log(options)
            })
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            if(this.listQuery.adminer == '') delete this.listQuery.adminer
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
        deleteEqu(row){
            this.$confirm(
                "此操作将永久删除该设备(设备名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                this.listLoading = true
                delObj(row.id).then(res => {
                    this.getList()
                    this.$parent.$parent.alertNotify('删除')
                })
            })
        },
        updataEqu(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addEqu.flag = 'updata'
            this.$parent.$refs.addEqu.form = Object.assign({},row)
            this.$parent.$refs.addEqu.form.status = row.status === 1?true:false
            this.$parent.$refs.addEqu.form.deviceGroup = {id:row.deviceGroup.id}
            this.$parent.$refs.addEqu.disabled = true
        },
        handleUpdataEqu(){
            updataObj().then(res => {
                this.$parent.$parent.alertNotify('修改')
            })
        },
        handleCommand(command){
            if(command.value == 'edit') this.updataEqu(command.row)
            else if(command.value == 'del') this.deleteEqu(command.row)
            else{
                this[command.value] = true
                this.dataInfo = command.row
            }
        },
        composeValue(item,row){
             return {
                'value': item,
                'row': row
            }
        },
        copy(type) {  
            var clipboard = new this.Clipboard('.copy_key');  
            clipboard.on('success', e => {  
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
                    // 释放内存  
                clipboard.destroy()  
            })  
            clipboard.on('error', e => {  
                // 不支持复制  
                this.$message({
                    message: '该浏览器不支持自动复制',
                    type: 'warning'
                });
                // 释放内存  
                clipboard.destroy()  
            })  
        },
    },
    watch:{
    }
}
</script>
<style scoped>
</style>
