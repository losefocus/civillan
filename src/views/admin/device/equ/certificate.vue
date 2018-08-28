<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <ul v-loading="loading" class="keyForm clearfix">
            <li class="pull-left">
                <p>CA Key</p>
                <el-input type="textarea" v-model="form.caKey" :rows='5'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.caKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li class="pull-right">
                <p>Public Key</p>
                <el-input type="textarea" v-model="form.publicKey" :rows='5'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.publicKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li class="pull-left">
                <p>Private Key</p>
                <el-input type="textarea" v-model="form.privateKey" :rows='5'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.privateKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li class="pull-right">
                <p>Req</p>
                <el-input type="textarea" v-model="form.req" :rows='5'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.req" @click="copy" plain size="mini">复制</el-button>
            </li>
        </ul>
    </div>
</template>
<script>
  import {generateObj, getObj} from "@/api/device/certificate";

  export default {
    props:['dataInfo'],
    data(){
        return {
            form:{
                caKey:'',
                privateKey:'',
                privateKey:'',
                req:'',
            },
            loading:false
        }
    },
    created() {
        this.getCertificate()
    },
    mounted() {
    },
    computed: {},
    methods:{
        getCertificate(){
            this.loading = true
            let data = {
                type :1,
                identity : this.dataInfo.id
            }
            getObj(data).then(res => {
                this.form = res.data.result
                this.loading = false
            })
            
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
<style scoped>
.keyForm{
    width: 100%
}
.keyForm li{
    position: relative;
    width: 48%
}
.keyForm p{
    line-height: 34px;
}
.keyForm li .copy_key{
    position: absolute;
    right:10px;
    top:45px;
}
</style>
