<template>
    <div >
        <div class="clearfix">
            <div class="pull-left imgBox">
                <img :src="projectInfo.thumbnailUrl+projectInfo.thumbnailPath">
            </div>
            <div class="pull-left text">
                <h1>{{projectInfo.name}}</h1>
                <p>工期：{{projectInfo.beginAt | parseTime('{y}-{m}-{d}')}} 至 {{projectInfo.endAt | parseTime('{y}-{m}-{d}')}}</p>
                <p class="clearfix">
                    <span class="pull-left">监理单位：</span>
                    <span class="pull-left">
                        <p v-for="(item , index) in projectInfo.organTypeList" v-if="item.organList.length!=0" :key="index" style="padding-right:10px;">{{index+1}}、{{item.organList[0].name}} </p>
                    </span>
                </p>
                <P>管理员：{{adminerHash[projectInfo.adminer]}}</P>
            </div>
        </div>
         <div class="comment" style="width:800px">项目介绍：{{projectInfo.comment}}</div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    props:['projectInfo'],
    computed: {
        ...mapGetters(["adminerHash"])
    },
    
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
