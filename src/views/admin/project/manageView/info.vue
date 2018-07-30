<template>
    <div >
        <div class="clearfix">
            <div class="pull-left imgBox">
                <img :src="info.thumbnailUrl+info.thumbnailPath">
            </div>
            <div class="pull-left text">
                <h1>{{info.name}}</h1>
                <p>工期：{{info.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{info.endAt | parseTime('{y}-{m}-{d}')}}</p>
                <p v-for="(item , index) in info.organTypeList" v-if="item.organList.length!=0" :key="index" style="padding-right:10px;">
                    {{item.name}}：{{item.organList[0].name}} 
                </p>
                <P>管理员：{{adminerHash[info.adminer]}}</P>
            </div>
        </div>
         <div class="comment" style="width:800px">项目介绍：{{info.comment}}</div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {getObj} from "@/api/project_info";

export default {
    data(){
        return{
            info:null
        }
    },
    props:['projectInfo'],
    created() {
        this.getInfo();
    },
    computed: {
        ...mapGetters(["adminerHash"])
    },
    methods:{
        getInfo(){
            getObj(this.projectInfo.id).then(res => {
                this.info = res.data.result
            })
        }
    }
}
</script>
<style scoped lang="scss">
.imgBox{
    width: 320px;
    height: 180px;
    img{
        width: 100%;
        height: 100%;
    }
}
.text{
    padding-left: 50px;
    h1{
        // padding:10px 0;
        font-weight: 500;
        margin-top:-10px
    }
    p{
        line-height: 26px;
        text-align: left;
        font-size: 14px;
    }
}
.comment{
    line-height: 30px;
    font-size: 14px;
    padding-top: 20px
}
</style>
