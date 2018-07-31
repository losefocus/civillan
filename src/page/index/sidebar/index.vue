<template>
  <div class="sidebar-container" :class="{'is-active':isCollapse}">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu unique-opened :default-active="nowTagValue" class="el-menu-vertical-demo" mode="vertical" :show-timeout="200" :collapse="isCollapse" :default-openeds="defaultOpened">
      <sidebar-item :menu="menu" :isCollapse="isCollapse"></sidebar-item>
    </el-menu>
    <div v-show="!isCollapse" class="bot">Copyright 2018 智握领程 版权所有.</div>
  </div>
</template>

<script>
import { setUrlPath } from "@/util/util";
import { mapGetters } from "vuex";
import SidebarItem from "./sidebarItem";
import logo from "./logo";
import { validatenull } from "@/util/validate";
import { initMenu } from "@/util/util";
export default {
  name: "sidebar",
  components: { SidebarItem, logo },
  data() {
    return {
      defaultOpened:["基础数据"]
    };
  },
  created() {
    if (validatenull(this.menu)) {
      this.$store.dispatch("GetMenu").then(data => {
        initMenu(this.$router, data);
      });
    }
  },
  computed: {
    ...mapGetters(["menu", "tag", "isCollapse"]),
    nowTagValue: function() {
      return setUrlPath(this.$route);
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.bot{
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 12px;
  padding-bottom:20px;
  width: 230px;
  text-align:center;
  color: #000000a6
}
</style>

