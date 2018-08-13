<template>
    <div>
        <div class="clearfix top_">
            <div class="tit pull-left">最新设备</div>
            <div class="pull-right more_">更多 > </div>
        </div>
        <div class="list_tit clearfix">
            <p class="l_1">用户</p>
            <p class="l_2">设备名称</p>
            <p class="l_3">日期</p>
        </div>
        <ul class="list">
            <li>
                <p class="l_1">张三</p>
                <p class="l_2">三头搅拌桩0123</p>
                <p class="l_3">08-27</p>
            </li>
            <li>
                <p class="l_1">张三</p>
                <p class="l_2">三头搅拌桩0123</p>
                <p class="l_3">08-27</p>
            </li>
            <li>
                <p class="l_1">张三</p>
                <p class="l_2">三头搅拌桩0123</p>
                <p class="l_3">08-27</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    
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
    p{
        float: left;
    }
    .l_1{
        width: 55px;
    }
    .l_2{
        width: calc(100% - 120px)
    }
    .l_3{
        width: 50px;
        float: right;
    }
}
.list{
    padding: 10px 20px;
    color: #666;
    font-size: 12px;
    li{
        height: 32px;
        line-height: 32px;
    }
    p{
        float: left;
    }
    .l_1{
        width: 55px;
    }
    .l_2{
        width: calc(100% - 120px)
    }
    .l_3{
        width: 50px;
        float: right;
    }
}
</style>
