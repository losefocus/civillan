<template>
    <div style="height:500px;padding:10px">
        <div class="pull-left c_l">
            <div class="tit">短信通知</div>
            <div class="text">短信通知（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。移动推送（Alibaba Cloud Mobile Push) 是基于大数据技术的移动云服务。</div>
            <div class="cont clearfix">
                <div class="pull-left cont_l">
                    <p>短信</p>
                    <p>购买</p>
                </div>
                <div class="pull-left cont_r">
                    <span style="color:#666666">购买数量</span>
                    <el-input style="width:120px;margin:0 20px;" size="small" type="number" min="0"></el-input>
                    <span style="color:#F15F5F">剩余短信量：100条</span>
                </div>
            </div>
        </div>
        <div class="pull-right c_r">
            当前配置
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c_l{
    width: calc(100% - 330px);
    .tit{
        height:24px;
        font-size:20px;
        font-weight:600;
        color:#333333;
        line-height:24px;
        padding-top: 10px;
    }
    .text{
        max-width:900px;
        font-size:12px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:21px;
        padding: 20px 0 40px;
    }
    .cont{
        height:170px;
        background:rgba(250,250,250,1);
        .cont_l{
            height: 100%;
            padding:60px 10px;
            background: #F2F2F2;
            box-sizing: border-box;
            width: 50px;
            float: left;
            color: #666666;
            font-size:14px;
            line-height:24px;
            font-weight:500;
            margin-right:70px;
        }
        .cont_r{
            width: calc(100% - 120px );
            line-height: 170px;
            font-size:14px;
        }
    }
}
.c_r{
    width:300px;
    height:350px;
    background: #FAFAFA
}
</style>

