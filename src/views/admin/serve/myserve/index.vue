<template>
    <div class="app-container">
        <ul class="serverList" v-if="views == 1">
            <li>
                <div class="l_1">短信通知</div>
                <div class="l_2">短信通知 (Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。</div>
                <div class="l_3">
                    <el-button type="primary" size="small" @click="views=2">立即购买</el-button>
                    <span class="l_3_d">剩余：0条</span>
                </div>
            </li>
            <li>
                <div class="l_1">存储空间</div>
                <div class="l_2">存储空间 (Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。</div>
                <div class="l_3">
                    <el-button type="primary" size="small" @click="views=3">续费/扩容</el-button>
                    <span class="l_3_d">剩余：10GB</span>
                    <span class="l_3_t">到期时间:2018-10-21</span>
                </div>
            </li> 
        </ul>
        <sms v-if="views == 2"></sms>
        <memory v-if="views == 3"></memory>
    </div>
</template>

<script>
  import sms from "./sms";
  import memory from "./memory";

export default {
    components:{
        sms,
        memory
    },
    data(){
        return {
            views:1
        }
    },
    computed: {
        
    },
    created() {

    },
    methods:{
       buy(){
           
       }
    }
}
</script>
<style lang="scss" scoped>
    .serverList{
        display: flex;
        flex-wrap:wrap;
        li{
            width:365px;
            height:168px;
            padding: 20px 25px;
            box-sizing: border-box;
            border:1px solid #EBEDF8;
            margin: 10px;
            .l_1{
                line-height: 24px;
                font-size: 20px;
                font-weight: 600;
                color: #333333;
            }
            .l_2{
                width:225px;
                height:42px;
                font-size:12px;
                font-weight:400;
                color:#666;
                line-height:21px;
                padding-top: 10px;
            }
            .l_3{
                padding-top: 15px;
            }
            .l_3_d{
                color: #F15F5F;
                font-size: 12px;
                padding-left: 20px;
            }
            .l_3_t{
                color: #999999;
                font-size: 12px;
                padding-left: 20px;
            }
        }
    }
</style>




