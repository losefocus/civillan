<template>
  <div class="menu-wrapper">
    <template v-for="(item,index) in menu">
      <el-menu-item v-if="item.children.length===0 " :index="filterPath(item.path,index)" @click="open(item)" :key="item.name">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
      <el-submenu v-else :index="filterPath(item.name,index)" :key="item.name">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title" :class="{'el-menu--display':isCollapse}">{{item.name}}</span> 
        </template>
        <template v-for="(child,cindex) in item.children">
          <el-menu-item :index="filterPath(child.path,cindex)" @click="open(child)" v-if="child.children.length==0" :key="cindex">
            <i :class="child.icon"></i>
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
          <sidebar-item v-else :menu="[child]" :key="cindex" :isCollapse="isCollapse"></sidebar-item>
        </template>
      </el-submenu>
    </template>
    <!-- <el-submenu index="1">
      <template slot="title">
        <i class="icon-zengzhifuwu"></i>
        <span slot="title" :class="{'el-menu--display':isCollapse}">增值服务</span> 
      </template>
      <el-menu-item index="/serve/myserve" @click="open_('/serve/myserve')">
        <i class="icon-shouhoufuwu"></i>
        <span slot="title">我的服务</span>
      </el-menu-item>
      <el-menu-item index="/serve/buy" @click="open_('/serve/buy')">
        <i class="icon-icon_goumaijilunor"></i>
        <span slot="title">购买记录</span>
      </el-menu-item>
      <el-menu-item index="/serve/record" @click="open_('/serve/record')">
        <i class="icon-ycbh_fapiao"></i>
        <span slot="title">开票记录</span>
      </el-menu-item>
      <el-menu-item index="/serve/setting" @click="open_('/serve/setting')">
        <i class="icon-fapiaoguanli"></i>
        <span slot="title">开票设置</span>
      </el-menu-item>
    </el-submenu> -->
  </div>
</template>
<script>
  import {resolveUrlPath} from "@/util/util";

  export default {
  name: "SidebarItem",
  data() {
    return {};
  },
  props: {
    menu: {
      type: Array
    },
    isCollapse: {
      type: Boolean
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    filterPath(path, index) {
      return path == null ? index + "" : path;
    },
    open(item) {
      this.$router.push({
        path: resolveUrlPath(item.path, item.name),
        query: item.query
      });
    },
    open_(path){
      this.$router.push({path: path});
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

