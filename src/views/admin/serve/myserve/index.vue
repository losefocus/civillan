<template>
    <div class="app-container" v-loading="loading" style="min-height:500px">
        <waterfall 
            align="center"
            :line-gap="500"
            :min-line-gap="100"
            :max-line-gap="220"
            :single-max-width="300"
            :watch="list"
            :fixed-height ="true"
            @reflowed="reflowed"
            ref="waterfall">
            <!-- each component is wrapped by a waterfall slot -->
            <waterfall-slot
                v-for="(item, index) in list"
                width="400"
                height="190"
                :order="index"
                :key="item.index"
                move-class="item-move">
                <div class="item" :style="item.style" :index="item.index">
                    <div class="img" :class="item.type"></div>
                    <div class="l_1">{{item.name}}</div>
                    <div class="l_2" >{{item.intro}}</div>
                    <div class="l_3">
                        <el-button type="primary" size="small" @click="tobuy(item)">{{item.type=='sms'?'立即购买':'续费/扩容'}}</el-button>
                        <span class="l_3_d">剩余：{{item.surplus || 0}} {{item.unit}}</span>
                        <span v-if="item.type=='oss'" class="l_3_t">到期时间:2018-10-21</span>
                    </div>
                </div>
            </waterfall-slot>
        </waterfall>

        <router-view></router-view>
    </div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import { fetchList} from "@/api/serve/myserve";
export default {
    components:{
        Waterfall,
        WaterfallSlot
    },
    data(){
        return {
            list:[],
            isBusy:false,
            listQuery: {
                page_index: 1,
                page_size: 20
            },
            loading:false
        }
    },
    computed: {
        
    },
    created() {
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
        reflowed(){
            this.isBusy = false
        },
        getList(){
            this.loading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result
                this.loading = false
            })
        },
        tobuy(obj){
            this.views = 2
            this.$router.push({path:'/serve/myserve/'+obj.type,query:{id:obj.id}})
        },
        goBack(){
            //replace替换原路由，作用是避免回退死循环
            this.$router.replace({path: '/admin/serve/myserve'});
        }
    },
    watch:{
    }
}
</script>
<style lang="scss" scoped>
    .item-move {
        transition: all .3s cubic-bezier(.55,0,.1,1);
        -webkit-transition: all .3s cubic-bezier(.55,0,.1,1);
    }
    .item{
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        border: 1px solid #EBEDF8;
        padding:20px;
        margin:10px;
        box-sizing: border-box;
        position: relative;
        .img{
            position: absolute;
            width: 90px;
            height: 90px;
            right: 10px;
            top: 10px;
            background-position: right top;
            background-repeat: no-repeat
        }
        .img.sms{
            background-image: url('../../../../assets/img/s_sms.png');
        }
        .img.oss{
            background-image: url('../../../../assets/img/s_oss.png');
        }
        .l_1{
            line-height: 24px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
        }
        .l_2{
            width:calc(100% - 100px);
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
</style>




