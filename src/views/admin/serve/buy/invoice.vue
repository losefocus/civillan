<template>
    <div style="background: #fff;">
       <div class="b_c" v-if="flag==1">
            <el-table
                :data="list"
                style="width: 100%">
                <el-table-column
                    prop="orderNo"
                    label="订单号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="serviceName"
                    align="center"
                    label="产品名称">
                </el-table-column>
                <!-- <el-table-column
                    prop="type"
                    align="center"
                    label="类型">
                </el-table-column> -->
                <el-table-column
                    prop="payAt"
                    align="center"
                    label="订单支付时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.payAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="payMoney"
                    align="center"
                    label="订单实付金额"
                    width="150">
                </el-table-column> -->
                <el-table-column
                    prop="payMoney"
                    align="center"
                    label="可开票金额">
                </el-table-column>
            </el-table>
            <div style="line-height:24px;font-size:12px;padding-top:10px;">已选取{{list.length}}个订单，可开票总额<span style="color:#EB474D">￥{{totalMoney}}</span></div>
            <div class="clearfix" style="margin-top:20px;width:850px">
                <el-form class="clearfix" :model="form" :rules="rules" ref="form" label-width="120px" size="small" label-position="left">
                    <el-form-item label="发票类型：" prop="billType">
                        <el-radio-group v-model="form.billType">
                            <el-radio label="1">增值税电子普通发票</el-radio>
                            <el-radio label="2">增值税纸质普通发票</el-radio>
                            <el-radio label="3">增值税专用发票</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票抬头：" prop="title">
                        <el-input v-model="form.title" size="small" style="width:285px;" placeholder="请填写营业执照全称"></el-input>
                    </el-form-item>
                    <el-form-item label="税务登记号：" prop="taxNum" >
                        <el-input v-model="form.taxNum" size="small" style="width:285px;" placeholder="请填写15到20位有效纳税人识别号" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行名称：" prop="bankName" style="float:left;margin-right:20px;">
                        <el-input v-model="form.bankName" size="small" style="width:285px;" placeholder="请填写开户许可证上的开户银行" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行账号：" prop="bankNum" style="float:left;">
                        <el-input v-model="form.bankNum" size="small" style="width:285px;" placeholder="请填写开户许可证上的银行账号" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="注册场所地址：" prop="registerAddr" style="float:left;margin-right:20px;">
                        <el-input v-model="form.registerAddr" size="small" style="width:285px;" placeholder="请填写营业执照上的注册地址" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="注册固定电话：" prop="registerTel" style="float:left;">
                        <el-input v-model="form.registerTel" size="small" style="width:285px;margin-bottom:20px;" placeholder="请填写您公司的有效联系电话" :disabled="form.resource==2"></el-input>
                    </el-form-item>

                    <el-form-item label="输入邮箱：" prop="email" v-if="form.billType == 1">
                        <el-input v-model="form.email" size="small" style="float:left;width:285px;margin-right:20px;" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人姓名：" prop="name" v-if="form.billType != 1" style="float:left;margin-right:20px;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="phone" v-if="form.billType != 1" style="float:left;">
                        <el-input v-model="form.phone" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="所在地区：" prop="area" v-if="form.billType != 1" style="float:left;margin-right:20px;">
                        <el-cascader
                        size="small"
                        style="width:285px;"
                        :options="options"
                        v-model="form.area"
                        @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="街道地址：" prop="address" v-if="form.billType != 1" style="float:left;">
                        <el-input v-model="form.address" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top:30px;" class="clearfix">
                <el-button type="primary" size="small" @click="getInvoiceSuccess">索取发票</el-button>
            </div>
       </div>
       <div class="b_f" v-else>
            <div class="b_finish">
                <i class="el-icon-check icon_" style=""></i>
                <div style="line-height:24px;font-size:20px;color:#333333;margin:20px 0 7px;">索取发票成功！</div>
                <div style="line-height:24px;font-size:12px;color:#878787" v-if="form.type==1">请至邮箱查询</div>
                <div style="line-height:24px;font-size:12px;color:#878787" v-else>预计5天内送达</div>
            </div>
       </div>
    </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { orderList } from "@/api/serve/order";
import { getObj,addBill} from "@/api/serve/bill";
export default {
    data(){
        return {
            flag:1,
            rules:{
                area: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            form:{
                billType:"",
                title:"",
                taxNum:"",
                bankName:"",
                bankNum:"",
                registerAddr:"",
                registerTel:"",
                email:"",
                name:"",
                phone:"",
                area:[],
                address:"",
            },
            options:regionData,
            selectedOptions:[],
            list:[{name:'12s',money:'123'}],
            listQuery:{
                page_index:1,
                page_size:10
            },
            totalMoney:0
        }
    },
    computed: {
        
    },
    created() {
        console.log()
        this.getList()
        this.getSetting()
    },
    methods:{
        handleChange(){},
        getList(){
            orderList(this.$route.query.id).then(res => {
                this.list = res.data.result
                this.totalMoney=this.list.map(v => {return v.payMoney}).reduce(function(num,item,index){
                    //num   1 3 6 10 num相当每次两数相加的中间结果,第一次会把数组第一个数给它
                    //item  2 3 4 5  item就是数组中的每个数,由于第一个给num了,所以第二个给它
                    //index 1 2 3 4  项的索引,由于第一次没有前一次的计算,用arr[0]来抵         
                    return num+item;
                });
            })
        },
        getSetting(){
            getObj().then(res => {
                this.form = res.data.result
                this.form.area = JSON.parse(this.form.area)
                // this.form.type = this.form.type.toString()
                this.form.billType = this.form.billType.toString()
            })
        },
        getInvoiceSuccess(){
            let data = Object.assign({},this.form)
            data.orderIds = this.list.map(v => {return v.id}).join()
            data.area = JSON.stringify(data.area)
            addBill(data).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "修改成功",
                        type: "success",
                        duration: 2000
                    });
                    this.flag = 2
                }else{
                    this.$notify({
                        title: '错误',
                        message: "修改失败",
                        type: "error",
                        duration: 2000
                    });
                }
            })

            // this.flag = 2
        }
    }
}
</script>
<style lang="scss" scoped>
    .b_c{
        padding: 30px 45px 30px;
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
    .b_f{
    height: 500px;
    display:flex;
    justify-content:center;
    align-items:center;
    text-align: center;
    .b_finish{
        .icon_{
            height:60px;
            width:60px;
            background:#65B1FF;
            line-height:60px;
            font-size: 50px;
            border-radius: 50%;
            color: #fff;
            text-align: center
        }
    }
    
}
</style>

