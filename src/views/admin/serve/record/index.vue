<template>
    <div style="background: #fff;">
       <div class="b_c">
           <div class="c_t clearfix">
               <div class="t_l clearfix">
                    <span class="pull-left">搜索开票时间</span>
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
               <div class="t_l clearfix">
                    <span class="pull-left">发票状态</span>
                    <el-select style="width:150px;margin-left:10px;" size="small" v-model="listQuery.status" placeholder="请选择状态" @change="changeStatus">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
               </div>
               <el-input style="width:180px;margin-left:-10px" size="small" v-model="keyword" placeholder="订单/月结算单"></el-input>
               <el-button size="small" style="margin-left:20px;">查询</el-button>
               <el-button class="pull-right" size="small" style="margin-top:20px"><i class="el-icon-download el-icon--left"></i>导出</el-button>
           </div>
           <div class="c_b" v-loading="loading">
                <el-table
                    :data="list"
                    style="width: 100%">
                    <el-table-column
                        prop="createdAt"
                        label="申请日期"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        align="center"
                        label="发票抬头">
                    </el-table-column>
                    <el-table-column
                        prop="total"
                        align="center"
                        label="发票总额">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.total}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="billType"
                        align="center"
                        label="发票类别"
                        width="150">
                        <template slot-scope="scope">
                            <span>{{typeMap.get(scope.row.billType.toString())}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        align="center"
                        label="发票状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.status | statusFilter}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="paytime"
                        align="center"
                        label="备注">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template>
                        </template>
                    </el-table-column> -->
                </el-table>
                <div style="margin-top:20px;" class="clearfix">
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

import { fetchHistoryList} from "@/api/serve/bill";
import {remote_p} from "@/api/dict";

export default {
    data(){
        return {
            status:'',
            statusOptions:[{value:'',label:'所有状态'},{value:0,label:'未开票'},{value:1,label:'已开票'},{value:2,label:'已邮寄'},],
            typeMap:null,
            time:[],
            keyword:'',
            list:[],
            listQuery:{
                page_index:1,
                page_size:10
            },
            total:0,
            loading:false
        }
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                0: '未开票',
                1: '已开票',
                2: '已邮寄',
            }
            return statusMap[status]
        }
    },
    computed: {
        
    },
    created() {
        remote_p("bill_type").then(res => {
            // [...this.typeOptions] = res.data.result
            // this.typeOptions.unshift({value:'',label:'所有类别'})
            this.typeMap = new Map()
            res.data.result.forEach(ele => {
                this.typeMap.set(ele.value,ele.label)
            });
        });
    },
    mounted() {
        this.getList()
    },
    methods:{
        changeStatus(){
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
            this.loading = true
            this.listQuery.sort_by = 'createdAt'
            this.listQuery.direction = 'desc'
            fetchHistoryList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .tit{
        height: 40px;
        line-height: 40px;
        background: #FBFBFB;
        border-bottom: 1px solid #EBEDF8;
        padding-left: 45px;
    }
    .b_c{
        padding: 0 45px 30px;
        .c_t{
            height: 70px;
            line-height: 70px;
            font-size: 14px;
            color: #666666;
            .t_l{
                float: left;
                margin-right:25px;
            }
        }
    }
</style>

