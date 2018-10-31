<template>
    <div>
        <div class="clearfix top_">
            <div class="tit pull-left">最新设备</div>
            <div class="pull-right more_" @click="toAllDevice">更多 > </div>
        </div>
        <div class="list_tit clearfix">
            <p class="l_1">用户</p>
            <p class="l_2">设备名称</p>
            <p class="l_3">日期</p>
        </div>
        <ul class="list">
            <li v-for="(item,index) in list" :key="index">
                <p class="l_1">{{userMap.get(item.createdBy)}}</p>
                <p class="l_2">{{item.name}}</p>
                <p class="l_3">{{item.createdAt | parseTime('{m}-{d}')}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
  import { fetchList} from "@/api/project_equ";
  import {fetchAdminList} from "@/api/project";
export default {
    data(){
        return{
            list:[],
            listQuery: {
                page_index: 1,
                page_size: 5,
            },
            userMap:null
        }
    },
    created(){
        this.getUserMap()
    },
    mounted(){
        this.getList()
    },
    computed: {
        
    },
    methods: {
        getUserMap(){
            let data_ = {
                page_index: 1,
                page_size: 9999,
            }
            fetchAdminList(data_).then(res => {
                let list = res.data.result.items
                this.userMap = new Map()
                list.forEach(ele => {
                    this.userMap.set(ele.id,ele.username)
                })
                
            })
        },
        getList(){
            fetchList(this.listQuery).then(res => {
                if(res.data.success && res.data.result != undefined){
                    this.list = res.data.result.items
                }
            })
        },
        toAllDevice(){
            this.$router.push({ path:'/admin/device'});
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
        height: 32px;
        line-height: 32px;
        p{
            height: 32px;
        }
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
