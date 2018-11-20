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
                    <el-select style="width:120px;margin-left:10px;" size="small" v-model="type" placeholder="请选择">
                        <el-option
                        v-for="item in typeOptions"
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
               <el-button class="pull-right" size="small" style="margin-top:20px"><i class="el-icon-download el-icon--left"></i>下载</el-button>
           </div>
           <div class="c_b">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="订单号"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="产品/服务">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        align="center"
                        label="支付方式">
                    </el-table-column>
                    <el-table-column
                        prop="money"
                        align="center"
                        label="支付金额"
                        width="150">
                        <template slot-scope="scope">
                            <span style="color:#EB474D;font-size:16px;">￥{{scope.row.money}}</span>
                            <span style="color:#979797;font-size:12px;">(已折扣￥{{scope.row.money}})</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createtime"
                        align="center"
                        label="创建时间">
                    </el-table-column>
                    <el-table-column
                        prop="paytime"
                        align="center"
                        label="支付时间">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        align="center"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template>

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
import { fetchList} from "@/api/serve/bill";
export default {
    data(){
        return {
            product:'',
            productOptions:[{value:'1',label:'所有产品'}],
            type:'',
            typeOptions:[{value:'1',label:'所有状态'}],
            time:[],
            tableData:[{name:'12s',money:'123'}],
            listQuery:{
                page_index:1,
                page_size:10
            },
            total:1
        }
    },
    computed: {
        
    },
    created() {

    },
    methods:{
       handleSizeChange(val) {
            this.listQuery.page_size = val;
            //this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            //this.getList();
        },
       toSetting(){
           this.$router.push({ path:'/serve/setting'});
       },
       getInvoice(){
           this.$router.push({path:'/serve/buy/invoice'})
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

