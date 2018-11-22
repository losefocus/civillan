<template>
    <div class="app-container" style="width:100%;background: #fff;">
       <div class="main">
            <div class="tit">开票信息</div>
            <div class="clearfix">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" size="small">
                    <el-form-item label="开具类型：" prop="type">
                        <el-radio-group v-model="form.type" @change="changeType">
                        <el-radio label='1'>个人</el-radio>
                        <el-radio label='2'>企业</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票抬头：" prop="title">
                        <el-input v-model="form.title" size="small" style="width:285px;" placeholder="请填写营业执照全称"></el-input>
                    </el-form-item>
                    <el-form-item label="发票类型：" prop="billType">
                        <el-radio-group v-model="form.billType" >
                            <!-- <el-radio label='1'>增值税普通发票</el-radio>
                            <el-radio v-if="form.type==1" label='2'>增值税专用发票</el-radio> -->
                            <el-radio v-for="(item,index) in billTypeOptions" :key="index" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                        <!-- <span v-else style="color: #606266;">增值税普通发票</span> -->
                    </el-form-item>
                    <el-form-item label="税务登记号：" prop="taxNum" v-if="form.type==2">
                        <el-input v-model="form.taxNum" size="small" style="width:285px;" placeholder="请填写15到20位有效纳税人识别号"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行名称：" prop="bankName" style="float:left;margin-right:20px;" v-if="form.type==2">
                        <el-input v-model="form.bankName" size="small" style="width:285px;" placeholder="请填写开户许可证上的开户银行"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行账号：" prop="bankNum" style="float:left;" v-if="form.type==2">
                        <el-input v-model="form.bankNum" size="small" style="width:285px;" placeholder="请填写开户许可证上的银行账号"></el-input>
                    </el-form-item>
                    <el-form-item label="注册场所地址：" prop="registerAddr" style="float:left;margin-right:20px;" v-if="form.type==2">
                        <el-input v-model="form.registerAddr" size="small" style="width:285px;" placeholder="请填写营业执照上的注册地址"></el-input>
                    </el-form-item>
                    <el-form-item label="注册固定电话：" prop="registerTel" style="float:left;" v-if="form.type==2">
                        <el-input v-model="form.registerTel" size="small" style="width:285px;" placeholder="请填写您公司的有效联系电话"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            
            <div class="tit">寄送地址</div>
            <div class="clearfix">
                <el-form :model="form" :rules="rules" ref="sendform" label-width="120px" size="small">
                    <el-form-item label="收件人姓名：" prop="name" style="float:left;margin-right:20px;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="phone" style="float:left;">
                        <el-input v-model="form.phone" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="所在地区：" prop="area" style="float:left;margin-right:20px;">
                        <el-cascader
                        size="small"
                        style="width:285px;"
                        :options="options"
                        v-model="form.area">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="街道地址：" prop="address" style="float:left;">
                        <el-input v-model="form.address" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
            </div>
            
            <div style="margin:40px auto;width:80px;">
                <el-button style="width:80px;" size="small" v-if="'id' in this.form" type="primary" @click="updateBill">修改</el-button>
                <el-button style="width:80px;" size="small" v-else type="primary" @click="addBill">保存</el-button>
            </div>
       </div>
    </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { fetchList,addObj,getObj,updateObj} from "@/api/serve/bill";
import {remote_p} from "@/api/dict";
export default {
    data(){
        return {
            rules:{
                type: [
                    { required: true, message: '请选择开具类型', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '请输入发票抬头', trigger: 'blur' },
                ],
                billType: [
                    { required: true, message: '请选择发票类型', trigger: 'change' }
                ],
                taxNum: [
                    { required: true, message: '请输入税务登记号', trigger: 'blur' },
                ],
                bankName: [
                    { required: true, message: '请输入开户银行名称', trigger: 'blur' },
                ],
                bankNum: [
                    { required: true, message: '请输入开户银行账号', trigger: 'blur' },
                ],
                registerAddr: [
                    { required: true, message: '请输入注册场所地址', trigger: 'blur' },
                ],
                registerTel: [
                    { required: true, message: '请输入注册固定电话', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入收件人姓名', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                ],
                area: [
                    { required: true, message: '请选择所在地区', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入街道地址', trigger: 'blur' },
                ],


            },
            form:{
                type:1,
                title:'',
                billType:1,
                taxNum:'',
                bankName:'',
                bankNum:'',
                registerAddr:'',
                registerTel:'',
                name:'',
                phone:'',
                area:[],
                address:'',
            },
            form_:{},
            billTypeOptions:[],
            billTypeOptions_:[],
            options:regionData,
        }
    },
    computed: {
        
    },
    created() {
        remote_p("bill_type").then(res => {
            console.log(res.data)
            this.billTypeOptions = res.data.result
            this.billTypeOptions_ = res.data.result
        });
    },
    mounted() {
        this.getBills()
    },
    methods:{
        changeType(val){ 
            if(val == 2){
                this.billTypeOptions = this.billTypeOptions_
                this.form.billType = '1' 
                if(this.form_.type == 2) this.form = Object.assign({},this.form_)
                
            }
            if(val == 1){
                this.form.taxNum=' '
                this.form.bankName=' '
                this.form.bankNum=' '
                this.form.registerAddr=' '
                this.form.registerTel=' '
                this.billTypeOptions = [this.billTypeOptions[0],this.billTypeOptions[1]]
            }
        },
        getBills(){
            getObj().then(res => {
                this.form = res.data.result
                this.form.area = JSON.parse(this.form.area)
                this.form.type = this.form.type.toString()
                this.form.billType = this.form.billType.toString()
                this.form_ = Object.assign({},this.form)
            })
        },
        addBill(){
            let data = Object.assign({},this.form)
            data.area = JSON.stringify(data.area)
            addObj(data).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "保存成功",
                        type: "success",
                        duration: 2000
                    });
                    this.getBills()
                }else{
                    this.$notify({
                        title: '错误',
                        message: "保存失败",
                        type: "error",
                        duration: 2000
                    });
                }
                
            })
        },
        updateBill(){
            let data = Object.assign({},this.form)
            data.area = JSON.stringify(data.area)
            updateObj(data).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "修改成功",
                        type: "success",
                        duration: 2000
                    });
                    this.getBills()
                }else{
                    this.$notify({
                        title: '错误',
                        message: "修改失败",
                        type: "error",
                        duration: 2000
                    });
                }
            })
        }
       
    }
}
</script>
<style lang="scss" scoped>
.main{
    margin: 0 auto;
    width: 840px;
    padding-bottom: 20px;
    .tit{
        height:20px;
        font-size:20px;
        font-weight:600;
        color:#333333;
        line-height:20px;
        margin-top: 30px;
        margin-bottom: 20px;
        &:before{
            display: block;
            content: '';
            width: 4px;
            height:20px;
            background: #409EFF;
            float: left;
            margin-right: 15px;
        }
    }
}
</style>

