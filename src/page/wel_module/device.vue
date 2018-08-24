<template>
    <div>
        <ul class="clearfix">
            <li class="tit"><p>设</p><p>备</p></li>
            <li>
                <p class="data_">300</p>
                <p>总量</p>
            </li>
            <li>
                <p class="data_ d_g">200</p>
                <p>进行中</p>
            </li>
            <li>
                <p class="data_ d_b">200</p>
                <p>已激活</p>
            </li>
            <li>
                <p class="data_ d_a">100</p>
                <p>未激活</p>
            </li>
            <li>
                <p class="data_ d_y">2</p>
                <p>异常</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped="scoped" lang="scss">
li{
    float: left;
    width: 19%;
    height: 118px;
    border-right: 1px solid #E8E8E8;
    box-sizing: border-box;
    font-size: 14px;
    p{
        line-height: 20px;
        text-align: center;
        color: #666;
    }
    p.data_{
        line-height: 40px;
        padding-top: 30px;
        font-size: 28px;
        color: #333;
    }
    p.d_g{
        color: #8AC44A;
    }
    p.d_b{
        color: #03A9F4;
    }
    p.d_a{
        color: #666666;
    }
    p.d_y{
        color: #FFB302;
    }
}
li:last-child{
    border:none
}
.tit{
    width: 5%;
    background: #409EFF;
    padding-top:38px;
    border:none;
    font-weight: bold;
    font-size: 16px;
    p{
        line-height: 22px;
        text-align: center;
        color: #fff;
    }
}
</style>
