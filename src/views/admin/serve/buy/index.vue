<template>
    <div style="background: #fff;">
       <div class="b_c">
           <div class="c_t clearfix">
               <div class="t_l clearfix">
                    <span class="pull-left">产品</span>
                    <el-select style="width:120px;margin-left:10px;" size="small" v-model="listQuery.service_id" placeholder="请选择" @change="handleChange">
                        <el-option
                        v-for="item in serviceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
               </div>
               <div class="t_l clearfix">
                    <span class="pull-left">支付状态</span>
                    <el-select style="width:120px;margin-left:10px;" size="small" v-model="listQuery.status" placeholder="请选择" @change="handleChange">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
               </div>
               <div class="t_l clearfix" style="width:320px;">
                    <span class="pull-left">时间范围</span>
                    <el-date-picker
                    style="width:250px;margin-left:10px;"
                    v-model="time"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeTime">
                    </el-date-picker>
               </div>
               <el-button size="small" @click="handleChange">查询</el-button>
               <el-button class="pull-right" size="small" style="margin-top:20px" @click="export2Excel"><i class="el-icon-download el-icon--left"></i>导出</el-button>
           </div>
           <div class="c_b" v-loading="loading">
                <el-table
                    :data="list"
                    style="width: 100%"
                     @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    :selectable="selectable"
                    width="55">
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        label="订单号"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="serviceName"
                        align="center"
                        label="产品/服务">
                    </el-table-column>
                    <el-table-column
                        prop="payMethod"
                        align="center"
                        label="支付方式">
                        <template slot-scope="scope">
                            <span v-if="'payMethod' in scope.row">{{payMethodMap.get(scope.row.payMethod.toString())}}</span>
                            <span v-else>{{scope.row.payMethod}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="payMoney"
                        align="center"
                        label="支付金额"
                        min-width="200">
                        <template slot-scope="scope">
                            <span style="color:#EB474D;font-size:16px;">￥{{scope.row.payMoney.toFixed(2)}}</span>
                            <span style="color:#979797;font-size:12px;">(已折扣￥{{(scope.row.discountPrice).toFixed(2)}})</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        align="center"
                        label="创建时间"
                        min-width="130">
                        <template slot-scope="scope">
                            <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="payAt"
                        align="center"
                        label="支付时间"
                        min-width="130">
                        <template slot-scope="scope">
                            <span>{{scope.row.payAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        align="center"
                        label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" style="color:#F15F5F">{{statusMap.get(scope.row.status.toString())}}</span>
                            <span v-else>{{statusMap.get(scope.row.status.toString())}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        width="150">
                        <template slot-scope="scope" >  
                            <el-button size="mini" v-if="scope.row.status == 1" type="primary" plain @click="toPay(scope.row)" style="margin-left:0px">支付</el-button>
                            <el-button size="mini" v-if="scope.row.status == 1" type="" plain style="margin-left:0px" @click="cancelOrder(scope.row)">取消</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top:20px;" class="clearfix">
                    <div class="pull-left">
                        <el-button type="primary" size="small" @click="getInvoice">索取发票</el-button>
                        <span style="margin-left:30px;font-size:12px;color:#535353">您尚未设置有效开票信息，无法开具发票，<a style="color:#F69E5D;cursor: pointer;" @click="toSetting">立即设置发票抬头</a></span>
                    </div>
                    <div class="pull-right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </div>
           </div>
           
       </div>
    </div>
</template>

<script>
import { fetchList,payment,orderList,serviceList,cancelObj} from "@/api/serve/order";
import {remote_p} from "@/api/dict";
import {parseTime} from "@/filters/index";

export default {
    data(){
        return {
            service:'',
            serviceOptions:[],
            statusOptions:[],
            time:[],
            list:[],
            list_export:[],
            listQuery:{
                page_index:1,
                page_size:20,
                sort_by:'createdAt',
                direction:'desc',
            },
            total:0,
            isdisable:true,
            orderIds:'',
            statusMap:null,
            payMethodMap:null,
            loading:false
        }
    },
    filters: {
        // statusFilter(status) {
        //     const statusMap = {
        //         0: '已取消',
        //         1: '未付款',
        //         2: '已付款',
        //         3: '已开票',
        //         4: '已过期',
        //     }
        //     return statusMap[status]
        // }
    },
    computed: {
        
    },
    created() {
        remote_p("order_status").then(res => {
            [...this.statusOptions] = res.data.result
            this.statusOptions.unshift({value:'',label:'所有状态'})
            this.statusMap = new Map()
            res.data.result.forEach(ele => {
                this.statusMap.set(ele.value,ele.label)
            });
        });
        remote_p("pay_method").then(res => {
            this.payMethodMap = new Map()
            res.data.result.forEach(ele => {
                this.payMethodMap.set(ele.value,ele.label)
            });
        });
    },
    mounted() {
        this.getServiceList()
        this.getList()
    },
    methods:{
        getServiceList(){
            serviceList({page_index:1,page_size:99}).then(res => {
                this.serviceOptions = res.data.result.map(v => {return {value:v.id,label:v.name}})
                this.serviceOptions.unshift({value:'',label:'所有产品'})
            })
        },
        changeTime(val){
            this.listQuery.page_index = 1;
            this.listQuery.date_start = new Date(val[0]).getTime()/1000
            this.listQuery.date_end = new Date(val[1]).getTime()/1000
            this.getList()
        },
        handleChange(){
            this.listQuery.page_index = 1;
            this.getList();
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
            this.loading=true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.loading=false
            })
        },
        selectable(row, index){
        	if(row.status == 2){
        		return true;
        	}else{
        		return false;
        	}
        },
        handleSelectionChange(val){
            this.orderIds = val.map(v => {return v.id}).join()
        },
        toPay(row){
            let query = {
                oldOrder:true,
                name:row.serviceName,
                amount:row.amount,
                price:row.servicePrice,
                payMoney:row.payMoney,
                discount:row.serviceDiscount,
                id:row.id,
                serviceId:row.serviceId,
                orderNo:row.orderNo,
            }
             this.$router.push({ path:'/serve/myserve/pay',query:query});
        },
        cancelOrder(row){
            this.$confirm('确认取消订单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancelObj(row.id).then(res => {
                    if(res.data.success){
                        this.$notify({
                            title: '成功',
                            message: '取消订单成功',
                            type: 'success'
                        });
                        this.getList()
                    }
                })
            }).catch(() => {
         
            });


            
        },
        toSetting(){
            this.$router.push({ path:'/admin/serve/setting'});
        },
        getInvoice(){
            if(this.orderIds == '') {
                this.$message.warning('请选择订单');
            }else{
                this.$router.push({path:'/serve/buy/invoice',query:{id:this.orderIds}})
            }
        },
        export2Excel() {
            let data = Object.assign({},this.listQuery)
            data.page_size=999
            fetchList(data).then(res => {
                this.list_export = res.data.result.items
                this.list_export.forEach(list => {
                    list.payMethod = this.payMethodMap.get(list.payMethod+'')
                    list.createdAt = parseTime(list.createdAt,'{y}-{m}-{d} {h}:{i}:{s}')
                    list.payAt = parseTime(list.payAt,'{y}-{m}-{d} {h}:{i}:{s}')
                    list.status = this.statusMap.get(list.status+'')
                })
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../../../vendor/Export2Excel');
                    const tHeader = ['订单号', '产品/服务', '支付方式', '支付金额', '创建时间', '支付时间', '状态'];
                    const filterVal = ['orderNo', 'serviceName', 'payMethod', 'payMoney', 'createdAt', 'payAt', 'status'];
                    const list = this.list_export;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '列表excel');
                })
            })   
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
    }
}
</script>
<style lang="scss" scoped>
    .b_c{
        padding: 0 45px 30px;
        .c_t{
            height: 70px;
            line-height: 70px;
            font-size: 14px;
            color: #666666;
            .t_l{
                float: left;
                margin-right:35px;
            }
        }
    }
</style>

