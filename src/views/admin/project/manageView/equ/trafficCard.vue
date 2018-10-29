<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <ul class="clearfix iccInfo" v-if="JSON.stringify(iccInfo) != '{}'">
            <li>Iccid:{{iccInfo.iccid}}<a class="unbind" @click="unbind">解绑</a></li>
            <li>卡状态:{{iccInfo.account_status | statusFilter}}</li>
            <li>运营商:{{iccInfo.carrier}}</li>
            <li>激活状态:{{iccInfo.active | activeFilter}}</li>
            <li>套餐大小:{{iccInfo.data_plan}}</li>
            <li>激活日期:{{iccInfo.active_date}}</li>
            <li>剩余流量:{{iccInfo.data_balance}}</li>
            <li>出库日期:{{iccInfo.outbound_date}}</li>
        </ul>
        <div v-else>
            Iccid:
            <el-input v-model="iccId" style="width:200px;" size="small"></el-input>
            <el-button size="small" @click="setTraffic">绑定</el-button>
        </div>
    </div>
</template>
<script>
  import {getObj,setObj} from "@/api/device/trafficCard";

  export default {
    props:['dataInfo'],
    data(){
        return {
            iccInfo:{
            },
            iccId:'',
            loading:false,
            // 00 - 正使用, 10 - 测试期, 02 - 停机 03 - 预销号, 04 - 销号, 11 - 沉默期 12 - 停机保号, 99 - 未知
        }
    },
    filters: {
        statusFilter(type) {
            const statusMap = {
                '00': "正使用",
                '10': "测试期",
                '02': "停机",
                '03': "预销号",
                '04': "销号",
                '11': "沉默期",
                '12': "停机保号",
                '99': "未知",
            };
        return statusMap[type];
        },
        activeFilter(type) {
            const activeMap = {
                true: "已激活",
                false: "未激活",
            };
        return activeMap[type];
        }
    },
    created() {
        this.getTraffic()
    },
    mounted() {
    },
    computed: {},
    methods:{
        getTraffic(){
            let id = this.dataInfo.id
            getObj(id).then(res => {
                this.iccInfo = res.data.result
            })
        },
        setTraffic(){
            let data = {
                projectDevice:{id:this.dataInfo.id},
                deviceKey:this.dataInfo.id,
                iccid:this.iccId,
                status:1
            }
            setObj(data).then(res => {
                if(res.data.success){
                    this.getTraffic()
                }
            })
        },
        unbind(){

        },
        copy() {  
            var clipboard = new this.Clipboard('.copy_key');  
            clipboard.on('success', e => {  
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
                     
                clipboard.destroy()   // 释放内存 
            })  
            clipboard.on('error', e => {  
                this.$message({
                    message: '该浏览器不支持自动复制',
                    type: 'warning'
                });  
                clipboard.destroy()  
            })  
        },
    }
}
</script>
<style scoped lang="scss">
.iccInfo{
    li{
        float: left;
        width: 50%
    }
    .unbind{
        color: #409EFF;
        cursor: pointer;
        text-decoration: none;
        margin-left:10px
    }
}
</style>
