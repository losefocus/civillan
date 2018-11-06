<template>
    <div>
        <div class="pull-left" style="width:175px;height:560px;background:#545c64">
            <el-menu
                :default-active="defaultActive"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="font-size:14px;text-align: center"
                @select="open">
                <el-menu-item index="/account/synopsis" router>
                    <template>
                        <span slot="title" style="margin-left:-10px">账户总览</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/account/detail">
                    <span slot="title" style="margin-left:-10px">账单明细</span>
                </el-menu-item>
                <el-submenu index="manage" >
                    <span slot="title" style="margin-left:-10px">订单管理</span>
                    <el-menu-item index="/account/manage">
                        <span slot="title" style="padding-left:20px">订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="/account/record">
                        <span slot="title" style="padding-left:20px">开票记录</span>
                    </el-menu-item>
                    <el-menu-item index="/account/setting">
                        <span slot="title" style="padding-left:20px">开票设置</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="/account/renew">
                    <span slot="title" style="margin-left:-10px">产品续费</span>
                </el-menu-item>
                
            </el-menu>
        </div>
        
        <div class="pull-right" style="width:calc(100% - 195px);background:#fff;min-height:560px;padding:20px;box-sizing: border-box">
            <router-view></router-view>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            defaultActive:'/account/synopsis'
        }
    },
    computed: {
        
    },
    created() {

    },
    methods:{
        open(index){
            console.log(index)
            this.defaultActive = index
            this.$router.push({ path:index});
        },
    }
}
</script>

<style scoped>
.el-submenu .el-menu-item{
    min-width: auto;
}

</style>


