<template>
    <div class="app-container" style="width:100%;background: #fff;">
       <div class="main">
            <div class="tit">开票信息</div>
            <div class="clearfix">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" size="small">
                    <el-form-item label="开具类型：" prop="resource">
                        <el-radio-group v-model="form.resource">
                        <el-radio label="1">个人</el-radio>
                        <el-radio label="2">企业</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票抬头：" prop="name">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写营业执照全称"></el-input>
                    </el-form-item>
                    <el-form-item label="发票类型：" prop="type">
                        <el-radio-group v-model="form.type" v-if="form.resource==1">
                            <el-radio label="1">增值税普通发票</el-radio>
                            <el-radio label="2">增值税专用发票</el-radio>
                        </el-radio-group>
                        <span v-else style="color: #606266;">增值税普通发票</span>
                    </el-form-item>
                    <el-form-item label="税务登记号：" prop="name">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写15到20位有效纳税人识别号" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行名称：" prop="name" style="float:left;margin-right:20px;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写开户许可证上的开户银行" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行账号：" prop="name" style="float:left;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写开户许可证上的银行账号" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="注册场所地址：" prop="name" style="float:left;margin-right:20px;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写营业执照上的注册地址" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                    <el-form-item label="注册固定电话：" prop="name" style="float:left;">
                        <el-input v-model="form.name" size="small" style="width:285px;" placeholder="请填写您公司的有效联系电话" :disabled="form.resource==2"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            
            <div class="tit">寄送地址</div>
            <div class="clearfix">
                <el-form :model="form" :rules="sendrules" ref="sendform" label-width="120px" size="small">
                    <el-form-item label="收件人姓名：" prop="name" style="float:left;margin-right:20px;">
                        <el-input v-model="sendform.name" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="name" style="float:left;">
                        <el-input v-model="sendform.name" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="所在地区：" prop="address" style="float:left;margin-right:20px;">
                        <el-cascader
                        size="small"
                        style="width:285px;"
                        :options="options"
                        v-model="sendform.address"
                        @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="街道地址：" prop="name" style="float:left;">
                        <el-input v-model="sendform.name" size="small" style="width:285px;" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
            </div>
            
            <div style="margin:40px auto;width:80px;">
                <el-button style="width:80px;" size="small" type="primary">保存</el-button>
            </div>
       </div>
    </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
    data(){
        return {
            rules:{
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            form:{
                resource:"1",
                type:'1'
            },
            sendrules:{
                address: [
                    { required: true, message: '请选择所在地区', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            sendform:{
                address:[],
            },
            options:regionData,
            selectedOptions:[],
        }
    },
    computed: {
        
    },
    created() {
        console.log(city)
    },
    methods:{
       handleChange (value) {
        console.log(value)
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

