<template>
    <div>
        <div>设 备 : {{dataInfo.name}}</div>
        <ul v-loading="loading" class="keyForm">
            <li>
                <p>Public Key</p>
                <el-input type="textarea" v-model="form.publicKey" :rows='3'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.publicKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li>
                <p>Pricate Key</p>
                <el-input type="textarea" v-model="form.privateKey" :rows='3'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.privateKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li>
                <p>CA Key</p>
                <el-input type="textarea" v-model="form.caKey" :rows='3'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.caKey" @click="copy" plain size="mini">复制</el-button>
            </li>
            <li>
                <p>Req</p>
                <el-input type="textarea" v-model="form.req" :rows='3'></el-input>
                <el-button class="copy_key" :data-clipboard-text="form.req" @click="copy" plain size="mini">复制</el-button>
            </li>
        </ul>
        <!-- <el-form :model="form" v-loading="loading" size="mini">
            <el-form-item label="Public Key">
                <el-input type="textarea" v-model="form.publicKey" :rows='3'></el-input>
            </el-form-item>
            <el-form-item label="Pricate Key">
                <el-input type="textarea" v-model="form.privateKey" :rows='3'></el-input>
            </el-form-item>
            <el-form-item label="CA Key">
                <el-input type="textarea" v-model="form.caKey" :rows='3'></el-input>
            </el-form-item>
            <el-form-item label="Req">
                <el-input type="textarea" v-model="form.req" :rows='3'></el-input>
            </el-form-item>
        </el-form> -->
    </div>
</template>
<script>
import {generateObj,getObj} from "@/api/project/certificate";
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
        console.log(this.dataInfo)
        this.getCertificate()
    },
    mounted() {
    },
    computed: {},
    methods:{
        getCertificate(){
            this.loading = true
            let data = {
                type :0,
                identity : this.dataInfo.id
            }
            // generateObj(data).then(ele => {
                getObj(this.dataInfo.id).then(res => {
                    this.form = res.data.result
                    this.loading = false
                })
            // })
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
.keyForm li{
    position: relative;
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
