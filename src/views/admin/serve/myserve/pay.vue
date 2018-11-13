<template>
    <div class="content">
        <div class="p_t clearfix">
            <div class="step_ step_3 pull-right clearfix" style="margin-left:20px;" :class="{active:active==3}">
                <div class="triangle_border_right pull-left triangle_white">
                    <span></span>
                </div>
                <div class="pull-left step_line">支付完成</div>
            </div>
            <div class="step_ step_2 pull-right clearfix" style="margin-left:20px;" :class="{active:active==2}">
                <div class="triangle_border_right pull-left triangle_white">
                    <span></span>
                </div>
                <div class="pull-left step_line">支付</div>
                <div class="triangle_border_right pull-left">
                    <span></span>
                </div>
            </div>
            <div class="step_ step_1 pull-right clearfix" :class="{active:active==1}">
                <div class="pull-left step_line">确认订单</div>
                <div class="triangle_border_right pull-left">
                    <span></span>
                </div>
            </div>
        </div>
        <div class="p_c">
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="date"
                    label="商品信息"
                    class-name="info">
                    <template slot-scope="scope">
                        <div style="padding:10px 0;">
                            <div style="font-size:18px;color:#333;line-height:40px;font-weight:600;">短信通知</div>
                            <div style="font-size:12px;color:#999">购买有效期：<span style="color:#666">{{scope.row.date}}</span></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="num"
                    label="数量">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="原价">
                    <template slot-scope="scope">
                        ￥{{scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price_"
                    label="折后价格">
                    <template slot-scope="scope">
                        ￥{{scope.row.price_}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="p_b"></div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            active:'3',
            tableData: [{
                date: '永久',
                num: '100',
                price: '600',
                price_:'400'
            }]
        }
    },
    created(){
        console.log(this.$route)
    }
}
</script>

<style lang="scss" scoped>
.content{
    margin: 0 auto;
    width: 1135px;
}
.p_t{
    margin-bottom:20px;
    .step_line{
        width:365px;
        height:40px;
        background:#CACACA;
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-size:16px;
    }
    .step_2{
        margin-left: -10px
    }
    .step_3 .step_line{
        width:365px;
    }
    .step_.active .step_line{
        background:#409EFF;
    }
    /*向右三角形*/
    .triangle_border_right{
        position:relative;
    }
    .triangle_border_right span{
        display:block;
        width:0;
        height:0;
        border-width:20px 0 20px 30px;
        border-style:solid;
        border-color:transparent transparent transparent #CACACA;/*透明 透明 透明 黄*/
        position:absolute;
        
    }
    .triangle_border_right.triangle_white span{
        border-color:transparent transparent transparent #fff !important;
    }
    .step_.active .triangle_border_right span{
        border-color:transparent transparent transparent #409EFF;/*透明 透明 透明 黄*/
    }
}
.p_c{
    width: 100%;
    border: 1px solid #EBEDF8;
    border-bottom: none;
    .p_c_tit{

    }
}
</style>

