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
            <div class="tit">当前配置</div>
            <ul>
                <li class="clearfix"><span>服务类型：</span><p>短信通知</p></li>
                <li class="clearfix"><span>购买数量：</span><p>100</p></li>
                <li class="clearfix"><span>购买有效期：</span><p>永久</p></li>
            </ul>
            <div class="clearfix">
                <div class="pull-right originalCost" style="color:#999999;padding-top:10px;line-height:28px;">
                    <span style="font-size:12px;">原价：</span><span style="font-size:18px;text-decoration:line-through;">￥600</span>
                </div>
            </div>
            <div class="clearfix">
                <div class="pull-right" style="color:#999999;height:40px;line-height:40px;">
                    <span style="font-size:12px">折后价：</span><span style="font-size:32px;color:#F15F5F">￥400</span>
                </div>
            </div>
            <el-button style="width:100%;margin-top:30px;" type="primary">立即购买</el-button>
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
    background: #FAFAFA;
    padding: 0 30px;
    box-sizing: border-box;
    .tit{
        height:60px;
        font-size:18px;
        font-weight:600;
        color:#333333;
        line-height:60px;
        border-bottom:1px solid rgba(151,151,151,0.2);
        margin-bottom: 15px;
    }
    li{
        width: 100%;
        line-height: 28px;
        font-size: 12px;
        span{
            color:rgba(153,153,153,1);
            width: 72px;
            float: left;
        }
        p{
            color: #666666;
            float: left;
        }
    }

}
</style>

