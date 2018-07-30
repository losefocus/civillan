<template>
    <div class="app-container calendar-list-container" v-loading="listLoading">
        <el-tabs v-model="activeName">
            <el-tab-pane label="说明文档" name="first" >
                <span slot="label"><span style="font-size:24px">说明文档</span></span>
                <el-collapse accordion v-model="activeObj" @change="getInfo">
                    <el-collapse-item v-for="(item,index) in list_1" :key="index" :name="item.id">
                        <template slot="title">
                        <span style="font-size:16px;font-weight: bold">{{item.title}}</span>
                        <span class="pull-right" style="padding-right:10px">{{(item.updateAt)?item.updateAt:item.createdAt | parseTime('{y}-{m}-{d}')}}</span>
                        <span style="padding-left:40px;">
                            <el-tag type="info" size="mini" style="margin-left:5px" v-for="(ele,i) in item.articleTags" :key="i">{{ele.tagName}}</el-tag>
                        </span>
                        </template>
                        <div style="overflow:auto;border-top:1px solid #ebeef5;padding-top:10px;min-height:40px" v-loading="contentLoading"><p v-html="content"></p></div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="常见问题" name="second">
                <span slot="label"><span style="font-size:24px">常见问题</span></span>
                <el-collapse accordion v-model="activeObj" @change="getInfo">
                    <el-collapse-item v-for="(item,index) in list_2" :key="index" :name="item.id">
                        <template slot="title">
                        <span style="font-size:16px;font-weight: bold">{{item.title}}</span>
                        <span style="padding-left:40px;">
                            <el-tag type="info" size="mini" style="margin-left:5px" v-for="(ele,i) in item.articleTags" :key="i">{{ele.tagName}}</el-tag>
                        </span>
                        </template>
                        <div style="overflow:auto;border-top:1px solid #ebeef5;padding-top:10px;min-height:40px" v-loading="contentLoading"><p v-html="content"></p></div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
    </div>    
</template>
<script>
import {fetchList,getObj} from "@/api/help";
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
        activeObj:[],
        listQuery:{
            page_index:1,
            page_size:10000,
        },
        listLoading:false,
        list_1:[],  
        list_2:[],
        content:'',
        contentLoading:false
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
                    if(ele.categoryId == 1){
                        this.list_1.push(ele)
                    }else if(ele.categoryId == 2){
                        this.list_2.push(ele)
                    }
                });
                this.listLoading = false
            })
        },
        getInfo(id){
            if(id != ''){
                this.contentLoading = true
                getObj(id).then(res => {
                    this.content = Base64.decode(res.data.result.content)
                    this.contentLoading = false
                })
            }
            
        }
    }
}
</script>
<style scoped>
</style>
