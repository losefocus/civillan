<template>
    <div class="app-container calendar-list-container" v-loading="listLoading">
        <el-tabs v-model="activeName">
            <el-tab-pane label="说明文档" name="first">
                <span slot="label"><span style="font-size:24px">说明文档</span></span>
                <el-collapse accordion>
                    <el-collapse-item v-for="(item,index) in list_1" :key="index">
                        <template slot="title">
                        <span>{{item.title}}</span><span class="pull-right">{{item.createAt | parseTime('{y}-{m}-{d}')}}</span>
                        </template>
                        <div style="overflow:auto;border-top:1px solid #ebeef5;padding-top:10px;"><p v-html="item.content"></p></div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="常见问题" name="second">
                <span slot="label"><span style="font-size:24px">常见问题</span></span>
                <el-collapse accordion>
                    <el-collapse-item v-for="(item,index) in list_2" :key="index">
                        <template slot="title">
                        <span>{{item.title}}</span><span class="pull-right">{{item.createAt | parseTime('{y}-{m}-{d}')}}</span>
                        </template>
                        <div style="overflow:auto;border-top:1px solid #ebeef5;padding-top:10px;"><p v-html="item.content"></p></div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
        
    </div>    
</template>
<script>
import {fetchList,addObj,delObj,updataObj} from "@/api/help";
let Base64 = require('js-base64').Base64;
export default {
    data() {
        var validateTitle = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息标题'));
            } else {
                callback();
            }
        };
        var validateMessage = (rule, value, callback) => {
            if (value === '' || value== undefined) {
                callback(new Error('请输入消息内容'));
            } else {
                callback();
            }
        };
    return {
        activeName:'first',
        listQuery:{
            page_index:1,
            page_size:10000,
        },
        listLoading:false,
        list_1:[],
        list_2:[],
      }
    },
    created(){
        this.getList()
    },
    methods: {
        getList(){
            this.listLoading = true
            fetchList(this.listQuery).then(res => {
                let list = res.data.result.items
                list.forEach(ele => {
                    ele.content = Base64.decode(ele.content)
                    if(ele.articleId == 1){
                        this.list_1.push(ele)
                    }else if(ele.articleId == 2){
                        this.list_2.push(ele)
                    }
                });
                this.listLoading = false
            })
        },
    }
}
</script>
<style scoped>

</style>
