<template>
    <div style="background: #fff;">
       <div class="b_c">
           <div class="c_t clearfix">
               <div class="t_l clearfix">
                    <span class="pull-left">产品</span>
                    <el-select style="width:120px;margin-left:10px;" size="small" v-model="product" placeholder="请选择">
                        <el-option
                        v-for="item in productOptions"
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
                    end-placeholder="结束日期">
                    </el-date-picker>
               </div>
               <el-button size="small">查询</el-button>
               <el-button class="pull-right" size="small" style="margin-top:20px"><i class="el-icon-download el-icon--left"></i>导出</el-button>
           </div>
           <div class="c_b">
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
                    </el-table-column>
                    <el-table-column
                        prop="payMoney"
                        align="center"
                        label="支付金额"
                        min-width="150">
                        <template slot-scope="scope">
                            <span style="color:#EB474D;font-size:16px;">￥{{scope.row.payMoney}}</span>
                            <span style="color:#979797;font-size:12px;">(已折扣￥{{scope.row.discountPrice}})</span>
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
                            <span v-if="scope.row.status == 1" style="color:#F15F5F">{{scope.row.status | statusFilter}}</span>
                            <span v-else>{{scope.row.status | statusFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        width="150">
                        <template slot-scope="scope" >  
                            <el-button size="mini" v-if="scope.row.status == 1" type="primary" plain @click="toPay(scope.row)" style="margin-left:0px">支付</el-button>
                            <el-button size="mini" v-if="scope.row.status == 1" type="" plain style="margin-left:0px">取消</el-button>
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
import { fetchList,payment,orderList} from "@/api/serve/order";
import {remote_p} from "@/api/dict";

export default {
    data(){
        return {
            product:'',
            productOptions:[{value:'1',label:'所有产品'}],
            statusOptions:[{value:'',label:'所有状态'},{value:0,label:'已取消'},{value:1,label:'未付款'},{value:2,label:'已付款'},
                {value:3,label:'已开票'},{value:4,label:'已过期'}],
            time:[],
            list:[],
            listQuery:{
                page_index:1,
                page_size:20
            },
            total:0,
            isdisable:true,
            orderIds:''
        }
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                0: '已取消',
                1: '未付款',
                2: '已付款',
                3: '已开票',
                4: '已过期',
            }
            return statusMap[status]
        }
    },
    computed: {
        
    },
    created() {
        remote_p("order_status").then(res => {
            console.log(res.data)
            this.statusOptions = res.data.result
            this.statusOptions.unshift({value:'',label:'所有状态'})
        });
    },
    mounted() {
        this.getList()
    },
    methods:{
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
            this.listQuery.sort_by = 'createdAt'
            this.listQuery.direction = 'desc'
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
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
            payment(row.id).then(res => {
                if(res.data.success){
                    const div = document.createElement('div');
                    div.innerHTML = res.data.result;
                    document.body.appendChild(div);
                    document.forms[0].submit()
                }
            })
        },
        toSetting(){
            this.$router.push({ path:'/serve/setting'});
        },
        getInvoice(){
            if(this.orderIds == '') {
                this.$message.error('请选择订单');
            }else{
                this.$router.push({path:'/serve/buy/invoice',query:{id:this.orderIds}})
            }
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

