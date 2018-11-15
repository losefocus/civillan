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
                    <el-select style="width:120px;margin-left:10px;" size="small" v-model="status" placeholder="请选择状态">
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
               <el-button class="pull-right" size="small" style="margin-top:20px"><i class="el-icon-download el-icon--left"></i>下载</el-button>
           </div>
           <div class="c_b">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="申请日期"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        label="发票抬头">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        align="center"
                        label="发票总额">
                    </el-table-column>
                    <el-table-column
                        prop="money"
                        align="center"
                        label="发票类别"
                        width="150">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createtime"
                        align="center"
                        label="发票状态">
                    </el-table-column>
                    <el-table-column
                        prop="paytime"
                        align="center"
                        label="备注">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template>

                        </template>
                    </el-table-column>
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
export default {
    data(){
        return {
            status:'',
            statusOptions:[{value:'1',label:'所有状态'}],
            time:[],
            keyword:'',
            tableData:[],
            listQuery:{
                page_index:1,
                page_size:10
            },
            total:0
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

