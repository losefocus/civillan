<template>
    <div class="app-container">
        <ul class="serverList" v-if="views == 1">
            <li v-for="(item,index) in list" :key="index">
                <div class="l_1">{{item.name}}</div>
                <div class="l_2" >{{item.intro}}</div>
                <div class="l_3">
                    <el-button type="primary" size="small" @click="tobuy(item)">立即购买</el-button>
                    <span class="l_3_d">剩余：0{{item.unit}}</span>
                </div>
            </li>
            <!-- <li>
                <div class="l_1">存储空间</div>
                <div class="l_2">存储空间 (Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。</div>
                <div class="l_3">
                    <el-button type="primary" size="small" @click="tobuy('sms')">续费/扩容</el-button>
                    <span class="l_3_d">剩余：10GB</span>
                    <span class="l_3_t">到期时间:2018-10-21</span>
                </div>
            </li>  -->
        </ul>
        <router-view v-if="views == 2"></router-view>
    </div>
</template>

<script>
import { fetchList} from "@/api/serve/myserve";
export default {
    components:{

    },
    data(){
        return {
            views:1,
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 20
            },
        }
    },
    computed: {
        
    },
    created() {
        console.log(this.$route)
        this.getList()
    },
    mounted(){
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.goBack, false);
        }
    },
    destroyed(){
        window.removeEventListener('popstate', this.goBack, false);
    },
    methods:{
        getList(){
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                console.log(res)
            })
        },
        tobuy(obj){
            console.log(obj)
            this.views = 2
            this.$router.push({path:'/serve/myserve/'+obj.type,query:{id:obj.id}})
        },
        goBack(){
                // this.views = 1
            //replace替换原路由，作用是避免回退死循环
            this.$router.replace({path: '/serve/myserve'});
        }
    },
    watch:{
        $route(val,oldval){
            if(val.path == '/serve/myserve'){
                this.views = 1
            }
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
                overflow:hidden; 
                text-overflow:ellipsis;
                display:-webkit-box; 
                -webkit-box-orient:vertical;
                -webkit-line-clamp:2;
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




