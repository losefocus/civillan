<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加设备</el-button>
            <!-- <el-button class="filter-item" style="" @click="handleGroup" size="small" type="primary" icon="edit" >分组管理</el-button> -->
            <el-button class="pull-right" type="primary" size="small" v-waves  @click="handleFilter">搜索</el-button>
            <el-input @keyup.enter.native="handleFilter" style="width: 150px;" size="small" suffix-icon="el-icon-search" class="pull-right" placeholder="设备名称" v-model="listQuery.name"></el-input>
            <el-select v-model="listQuery.groupId" clearable class="pull-right" placeholder="按所在分组筛选" style="width:150px!important;margin-right:10px" size="small"  @change="handleFilter">
                <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.parentId == 0">
                    <span v-if="item.parentId == 0  || item.id == 0">{{ item.name }}</span>
                    <span v-else style="padding-left:20px;">{{ item.name }}</span>
                </el-option>
            </el-select>
            <el-select v-model="listQuery.status" clearable class="pull-right" placeholder="按状态筛选" style="width:150px!important;margin-right:10px" size="small"  @change="handleFilter">
                <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-table :data="list" v-loading="listLoading" fit highlight-current-row style="width: 99%;margin-bottom:20px">
            <el-table-column align="center" label="缩略图" width="80px">
                <template slot-scope="scope">
                    <div style="height:45px">
                        <img v-if="scope.row.thumbnailBaseUrl&&scope.row.thumbnailBaseUrl!=''" style="width:60px;height:45px" :src="scope.row.thumbnailBaseUrl+scope.row.thumbnailPath">
                        <img v-else style="width:60px;height:45px" src="../../../../assets/img/no_pic.png">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left" label="设备名称">
                <template slot-scope="scope">
                    <span style="white-space:nowrap;cursor:pointer;">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在分组">
                <template slot-scope="scope">
                    <span>{{scope.row.deviceGroup.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="key" show-overflow-tooltip>
                <template slot-scope="scope" >
                    <span style="cursor:pointer;" class="copy_key" :data-clipboard-text="scope.row.key" @click="copy()">{{scope.row.key}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.secret" placement="top" :open-delay="300">
                        <i style="cursor:pointer;color:#95989e" class="iconfont icon-fuzhi copy_key" :data-clipboard-text="scope.row.secret" @click="copy()" ></i>
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
                    <!-- <i v-if="scope.row.status == 1" class="el-icon-circle-check" style="font-size:18px;color:#67c23a"></i>
                    <i v-else class="el-icon-circle-close" style="font-size:18px;color:#909399"></i> -->
                    <el-tag v-if="scope.row.status == 0" type="info" size="mini">未激活</el-tag>
                    <el-tag v-if="scope.row.status == 1" size="mini" >已激活</el-tag>
                    <el-tag v-if="scope.row.status == 2" size="mini" type="warning" >已离场</el-tag>
                    <el-tag v-if="scope.row.status == 11" type="success" size="mini">已连接</el-tag>
                    <el-tag v-if="scope.row.status == 21" type="danger" size="mini">故障中</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope" >
                    <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
                        <span style="cursor:pointer">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span >
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  v-if="device_btn_config" :command="composeValue('trafficVisible',scope.row)">流量卡</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_config" :command="composeValue('configVisible',scope.row)">设备配置</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_variable" :command="composeValue('sensorVisible',scope.row)">变量管理</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_alert" :command="composeValue('alarmVisible',scope.row)">警报管理</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_notice" :command="composeValue('notifyVisible',scope.row)">报警通知</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_personnel" :command="composeValue('personnelVisible',scope.row)">操作人员</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_personnel" :command="composeValue('deviceVisible',scope.row)">设备关联</el-dropdown-item>
                            <el-dropdown-item  v-if="device_btn_certificate" :command="composeValue('certiVisible',scope.row)">证书下载</el-dropdown-item>
                            <el-dropdown-item divided v-if="device_btn_edit" :command="composeValue('edit',scope.row)">修改设备</el-dropdown-item>
                            <el-dropdown-item :command="composeValue('remove',scope.row)" :disabled="scope.row.status == 2">设备离场</el-dropdown-item>
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
        <el-dialog title="流量卡"  :visible.sync="trafficVisible" width='690px'>
            <traffic-card v-if="trafficVisible" :data-info="dataInfo" ref="traffic"></traffic-card>
        </el-dialog>
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
        <el-dialog title="报警通知"  :visible.sync="notifyVisible" width='690px'>
            <notify v-if="notifyVisible" :data-info="dataInfo" ref="notify"></notify>
        </el-dialog>
        <el-dialog title="操作人员—绑定用户"  :visible.sync="personnelVisible" width='690px'>
            <personnel v-if="personnelVisible" :data-info="dataInfo" ref="personnel"></personnel>
        </el-dialog>
        <el-dialog title="设备关联—绑定关系"  :visible.sync="deviceVisible" width='690px'>
            <device v-if="deviceVisible" :data-info="dataInfo" ref="device"></device>
        </el-dialog>
        <el-dialog title="分组管理"  :visible.sync="groupVisible" width='690px'>
            <group v-if="groupVisible" ref="group"></group>
        </el-dialog>
    </div>
</template>
<script>
  import trafficCard from "./equ/trafficCard";
  import config from "./equ/config";
  import certi from "./equ/certificate";
  import sensor from "./equ/sensor";
  import alarm from "./equ/alarm";
  import notify from "./equ/notify";
  import group from "./equ/group";
  import personnel from "./equ/personnel";
  import device from "./equ/device";
  import {mapGetters} from "vuex";
  import {delObj, fetchList,getGroupObj, getAlarmObj, getConfigObj, getNotifyObj, getSensorObj, updataObj,departureObj} from "@/api/project_equ";

  export default {
    components:{
        trafficCard,
        config,
        certi,
        sensor,
        alarm,
        notify,
        group,
        personnel,
        device
    },
    props:['projectInfo'],
    data(){
        return {
            statusOptions:[
                {value:'',label:'全部状态'},
                {value:0,label:'未激活'},
                {value:1,label:'已激活'},
                {value:2,label:'已离场'},
                {value:11,label:'已连接'},
                {value:21,label:'故障中'},
            ],
            listLoading:false,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            filterDeviceGroup:'',
            total:null,
            flag:'add',
            createdLoading:false,
            trafficVisible:false,//流量卡
            configVisible:false,//配置
            certiVisible:false,//证书
            sensorVisible:false,//变量
            alarmVisible:false,//报警
            notifyVisible:false,//通知
            personnelVisible:false,//人员
            deviceVisible:false,//人员
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
            groupOptions:[]
        }
    },
    created() {
        this.getList()
        this.getGroupList()
    },
    mounted() {
        this.device_btn_edit = this.permissions["device_btn_edit"];
        this.device_btn_del = this.permissions["device_btn_del"];
        this.device_btn_certificate = this.permissions["device_btn_certificate"];
        this.device_btn_variable = this.permissions["device_btn_variable"];
        this.device_btn_alert = this.permissions["device_btn_alert"];
        this.device_btn_notice = this.permissions["device_btn_notice"];
        this.device_btn_personnel = this.permissions["device_btn_personnel"];
        this.device_btn_config = this.permissions["device_btn_config"];
    },
    computed: {
        ...mapGetters(["permissions"])
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
            })
        },
        getGroupList(){
            let data = {
                projectId:this.projectInfo.id,
                page_index: 1,
                page_size: 999,
                sort_by: 'sort',
                direction: 'asc',
            }
            getGroupObj(data).then(res => {
                // this.groupOptions = res.data.result.items
                // this.groupOptions.unshift({id:0,name:'全部分组'})
                let arr = []
                res.data.result.items.forEach(r => {
                    if(r.parentId == 0){
                        arr.push(r)
                        if(r.childrenList.length !=0){
                            r.childrenList.forEach(l => {
                                arr.push(l)
                            })
                        }
                    }
                })
                this.groupOptions = arr
                this.groupOptions.unshift({id:0,name:'全部分组'})
            })
        },
        handleFilter(){
            if(this.listQuery.name == '') delete this.listQuery.name
            if(this.listQuery.groupId == '') delete this.listQuery.groupId
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
            }).catch(() => {});
        },
        updataEqu(row){
            this.$parent.cardVisibel = true
            this.$parent.$refs.addEqu.flag = 'update'
            if(!row.product) row.product = {id:'暂无产品'}
            this.$parent.$refs.addEqu.form = Object.assign({},row)
            this.$parent.$refs.addEqu.deviceGroup = row.deviceGroup.name
            this.$parent.$refs.addEqu.productName = row.product.name
            this.$parent.$refs.addEqu.disabled = true
        },
        departureEqu(row){
            this.$confirm(
                "确认将该设备离场(设备名:" + row.name + "), 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                }
            ).then(() => {
                departureObj({project_device_id:row.id}).then(res => {
                    this.getList()
                })
            }).catch(() => {});
        },
        handleCommand(command){
            if(command.value == 'edit') this.updataEqu(command.row)
            else if(command.value == 'del') this.deleteEqu(command.row)
            else if(command.value == 'remove') this.departureEqu(command.row)
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
        copy() {  
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
