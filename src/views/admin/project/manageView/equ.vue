<template>
    <div style="padding:20px;border:1px solid #ebeef5">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleAdd" size="small" type="primary">添加设备</el-button>
            <el-button class="filter-item" style="" @click="handleGroup" size="small" type="primary" icon="edit" >分组管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;margin-bottom:20px">
            <el-table-column align="center" label="设备名称">
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
                    <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top">
                        <i style="cursor:pointer;color:#30a487" class="iconfont icon-fuzhi copy_key" :data-clipboard-text="scope.row.key" @click="copy()" ></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.secret" placement="top">
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
                            <el-dropdown-item v-for="(item,index) in btnList" 
                            :key="index" 
                            :disabled="!item.flag"
                            :command="composeValue(item.value,scope.row)">
                            {{item.label}}
                            </el-dropdown-item>
                            <el-dropdown-item divided v-if="device_btn_edit" :command="composeValue('edit',scope.row)">修改</el-dropdown-item>
                            <el-dropdown-item v-if="device_btn_del" :command="composeValue('del',scope.row)">删除</el-dropdown-item>
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
        <el-dialog title="证书管理"  :visible.sync="certiVisible" width='690px'>
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
import { mapGetters } from "vuex";
import {fetchList,delObj,updataObj,getConfigObj,getSensorObj,getAlarmObj,getNotifyObj} from "@/api/project_equ";
export default {
    components:{
        config,
        certi,
        sensor,
        alarm,
        notify,
        group
    },
    props:['projectInfo'],
    data(){
        return {
            listLoading:false,
            list:[{}],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            total:null,
            btnList:[
                {
                    value:'certiVisible',
                    label:'证书',
                    btn:'device_btn_certificate',
                    flag:false
                },{
                    value:'sensorVisible',
                    label:'变量',
                    btn:'device_btn_variable',
                    flag:false
                },{
                    value:'alarmVisible',
                    label:'警报',
                    btn:'device_btn_alert',
                    flag:false
                },{
                    value:'notifyVisible',
                    label:'通知',
                    btn:'device_btn_notice',
                    flag:false
                },
                {
                    value:'configVisible',
                    label:'配置',
                    btn:'device_btn_config',
                    flag:false
                },
            ],
            flag:'add',
            createdLoading:false,
            configVisible:false,//配置
            certiVisible:false,//证书
            sensorVisible:false,//变量
            alarmVisible:false,//报警
            notifyVisible:false,//通知
            groupVisible:false,
            dataInfo:null,
            listInfoQuery:{
                page_index: 1,
                page_size: 20
            },
            device_btn_edit :false,
            device_btn_del :false,

        }
    },
    created() {
        this.getList()
        this.device_btn_edit = this.permissions["device_btn_edit"];
        this.device_btn_del = this.permissions["device_btn_del"];
        this.btnList.forEach(element => {
            element.flag = this.permissions[element.btn]
        });
        this.btnList[4].flag = false
    },
    mounted() {

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
                let options = []
                res.data.result.items.forEach(element => {
                    let ele = {value:element.id,label:element.name}
                    options.push(ele)
                });

            })
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
