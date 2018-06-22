<template>
    <div class="clearfix">
        <div >
            产 品 : {{productInfo.name}} 
        </div>
        <el-input style="padding:20px 0" type="textarea" :rows="10" placeholder="请输入内容" v-model="textarea"></el-input>
        <el-button class="pull-right" size="small" type="success">保存</el-button>
    </div>
</template>
<script>

import {get_templateObj} from "@/api/product";
export default {
    props:['productInfo','templateInfo'],
    data(){
        return {
            listLoading:false,
            flag:'add',
            textarea:this.templateInfo
        }
    },
    created() {
        // this.textarea = this.templateInfo
        console.log(this.textarea)
    },
    mounted() {
    },
    computed: {},
    methods:{
        handleCurrentChange(){},
        handleSizeChange(){},
        updateForm(row){},
        deleteForm(row){},
        handleAdd(){},
        handleEdit(){},
        cancelEdit(){}
    }
}
</script>
<style scoped>
.el-form-item{
    float: left;
    width:80px
}
</style>
