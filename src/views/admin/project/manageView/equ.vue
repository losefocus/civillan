<template>
    <div style="padding:20px;border:1px solid #dcdfe6" class="equContent">
        <div class="filter-container">
            <el-button class="filter-item" style="" @click="handleCreate" size="small" type="primary" icon="edit" >分组管理</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;margin-bottom:10px">
            <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在分组">
                <template slot-scope="scope">
                    <span>{{scope.row.deviceGroup.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="key">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top">
                        <el-button size="small">key</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="secret">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.secret" placement="top">
                        <el-button size="small">secret</el-button>
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
                    <span>{{(scope.row.status == 1)?'已启用':'未启用'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="500">
                <template slot-scope="scope" >
                    <el-button size="small" type="success" plain @click="handleConfig(scope.row)">配置</el-button>
                    <el-button size="small" type="success" plain @click="handleCerti(scope.row)">证书</el-button>
                    <el-button size="small" type="success" plain @click="handleSensor(scope.row)">变量</el-button>
                    <el-button size="small" type="success" plain @click="handleAlarm(scope.row)">报警</el-button>
                    <el-button size="small" type="success" plain @click="handleNotify(scope.row)">通知</el-button>
                    <el-button size="small" type="success" plain @click="updataEqu(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" plain @click="deleteEqu(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="设备配置"  :visible.sync="configVisible" width='690px'>
            <config :data-info="dataInfo" ref="config"></config>
        </el-dialog>
        <el-dialog title="证书管理"  :visible.sync="certiVisible" width='690px'>
            <certi :data-info="dataInfo" ref="certi"></certi>
        </el-dialog>
        <el-dialog title="变量管理"  :visible.sync="sensorVisible" width='690px'>
            <sensor :data-info="dataInfo" ref="sensor"></sensor>
        </el-dialog>
        <el-dialog title="报警管理"  :visible.sync="alarmVisible" width='690px'>
            <alarm :data-info="dataInfo" ref="alarm"></alarm>
        </el-dialog>
        <el-dialog title="通知管理"  :visible.sync="notifyVisible" width='690px'>
            <notify :data-info="dataInfo" ref="notify"></notify>
        </el-dialog>
    </div>
</template>
<script>
import config from "./equ/config";
import certi from "./equ/certificate";
import sensor from "./equ/sensor";
import alarm from "./equ/alarm";
import notify from "./equ/notify";
import {fetchList,delObj,updataObj,getConfigObj,getSensorObj,getAlarmObj,getNotifyObj} from "@/api/project_equ";
export default {
    components:{
        config,
        certi,
        sensor,
        alarm,
        notify,
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
            flag:'add',
            createdLoading:false,
            configVisible:false,//配置
            certiVisible:false,//证书
            sensorVisible:false,//变量
            alarmVisible:false,//报警
            notifyVisible:false,//通知
            dataInfo:null,
            listInfoQuery:{
                page_index: 1,
                page_size: 20
            }
        }
    },
    created() {
        this.getList()
    },
    mounted() {

    },
    computed: {},
    methods:{
        handleCreate(){

        },
        getList(){
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
            this.$parent.$refs.addEqu.flag = 'updata'
            this.$parent.$refs.addEqu.form = Object.assign({},row)
            this.$parent.$refs.addEqu.form.status = row.status === 1?true:false
            this.$parent.$refs.addEqu.productId_alias = row.productId+','+row.alias
        },
        handleUpdataEqu(){
            updataObj().then(res => {
                this.$parent.$parent.alertNotify('修改')
            })
        },
        perManage(){

        },
        editOrg(){

        },
        deleteOrg(){

        },
        //配置
        handleConfig(row){
            this.configVisible = true
            this.dataInfo = row
            
            this.listInfoQuery.deviceId = row.id
            setTimeout(()=>{
                this.getConfigList(this.listInfoQuery)
            },50)
        },
        getConfigList(obj){
            this.$refs.config.listLoading = true
            this.$refs.config.cancelEdit()
            getConfigObj(obj).then(res => {
                this.$store.commit("SET_CONFIGLIST",res.data.result.items);
                this.$refs.config.total = res.data.result.total
                this.$refs.config.listLoading = false
            })
        },
        //证书
        handleCerti(row){
            this.certiVisible = true
            this.dataInfo = row
            this.listInfoQuery.deviceId = row.id
            setTimeout(()=>{
                this.getCertiList(this.listInfoQuery)
            },50)
        },
        getCertiList(obj){
            this.$refs.certi.listLoading = true
            this.$refs.certi.cancelEdit()
            getSensorObj(obj).then(res => {
                this.$store.commit("SET_CERTILIST",res.data.result.items);
                this.$refs.certi.total = res.data.result.total
                this.$refs.certi.listLoading = false
            })
        },
        //变量
        handleSensor(row){
            this.sensorVisible = true
            this.dataInfo = row
            this.listInfoQuery.deviceId = row.id
            setTimeout(()=>{
                this.getSensorList(this.listInfoQuery)
            },50)
        },
        getSensorList(obj){
            this.$refs.sensor.listLoading = true
            this.$refs.sensor.cancelEdit()
            getSensorObj(obj).then(res => {
                this.$store.commit("SET_SENSORLIST",res.data.result.items);
                this.$refs.sensor.total = res.data.result.total
                this.$refs.sensor.listLoading = false
            })
        },
        //报警
        handleAlarm(row){
            this.alarmVisible = true
            this.dataInfo = row
            this.listInfoQuery.deviceId = row.id
            setTimeout(()=>{
                this.getAlarmList(this.listInfoQuery)
            },50)
        },
        getAlarmList(obj){
            this.$refs.alarm.listLoading = true
            this.$refs.alarm.cancelEdit()
            getAlarmObj(obj).then(res => {
                this.$store.commit("SET_ALARMLIST",res.data.result.items);
                this.$refs.alarm.total = res.data.result.total
                this.$refs.alarm.listLoading = false
                
                let alarmOptions = []
                res.data.result.items.forEach(element => {
                    let ele = {value:element.id,label:element.title}
                    alarmOptions.push(ele)
                });
                this.$store.commit("SET_ALARMOPTIONS",alarmOptions);
            })
        },
        //通知
        handleNotify(row){
            this.notifyVisible = true
            this.dataInfo = row
            this.listInfoQuery.deviceId = row.id
            setTimeout(()=>{
                this.getNotifyList(this.listInfoQuery)
            },50)
        },
        getNotifyList(obj){
            this.$refs.notify.listLoading = true
            this.$refs.notify.cancelEdit()
            getNotifyObj(obj).then(res => {
                this.$store.commit("SET_NOTIFYLIST",res.data.result.items);
                this.$refs.notify.total = res.data.result.total
                this.$refs.notify.listLoading = false
            })
        },
    }
}
</script>
<style scoped>

</style>
