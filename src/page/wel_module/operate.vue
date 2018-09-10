<template>
    <div>
        <div class="clearfix top_">
            <div class="tit pull-left">操作记录</div>
            <div class="pull-right more_" @click="toAllDevice">更多 > </div>
        </div>
        <div class="list_tit clearfix">
            <p class="l_1">用户</p>
            <p class="l_2">操作内容</p>
            <p class="l_3">日期</p>
        </div>
        <ul class="list">
            <li v-for="(item,index) in list" :key="index">
                <p class="l_1">{{item.username}}</p>
                <p class="l_2">{{item.description}}</p>
                <p class="l_3">{{item.createNow | parseTime('{m}-{d}')}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import {fetchList} from "@/api/log";

export default {
    data(){
        return{
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 5,
                sort_by:'createNow',
                direction:false
            },
        }
    },
    created(){},
    mounted(){
        this.getList()
    },
    computed: {},
    methods: {
        getList(){
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
            })
        },
        toAllDevice(){
            this.$router.push({ path:'/admin/log'});
        }
    }
}
</script>
<style scoped="scoped" lang="scss">
.top_{
    height: 22px;
    line-height: 22px;
    padding: 20px;
    .tit{
        font-size: 16px;
        font-weight: bold;
    }
    .more_{
        font-size: 12px;
        color: #999;
        cursor: pointer;
    }
}
.list_tit{
    border-bottom: 1px solid #E8E8E8;
    text-align: left;
    height: 18px;
    line-height: 18px;
    padding: 10px 20px;
    color: #333;
    font-size: 12px;
    font-weight: bold;
}
.list{
    padding: 10px 20px;
    color: #666;
    font-size: 12px;
    li{
        height: 35px;
        line-height: 35px;
    }
}
p{
    float: left;
}
.l_1{
    width: 55px;
}
.l_2{
    width: calc(100% - 120px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.l_3{
    width: 45px;
    float: right;
}
</style>
