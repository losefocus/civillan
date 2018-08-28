<template>
  <div class="logo" :style="isCollapse?'width:64px':'width:230px'">
    <transition name="fade">
      <!-- <span v-if="isCollapse" class="logo_title is-bold " key="0" :class="{'is-text':!type,'is-img':type}">
        <template v-if="type">
          <img :src="website.logo" width="40" height="40" />
        </template>
        <template v-else>
          {{website.logo}}
        </template>
          <img style="width:40px;height:40px;margin:12px 0 0 2px;" src="../../../assets/img/logo_2.png">
      </span> -->
      <div v-if="isCollapse">
        <span class="logoImg_s"></span>
      </div>
    </transition>
    <transition name="fade">
      <!-- <template v-if="!isCollapse">
        <span class="logo_title is-bold" key="1">{{website.title}} </span>
        <span class="logo_subtitle" key="2">{{website.author}}</span>
        <span class="logo_title" key="1"><span class="logoImg"></span></span>
      </template> -->
      <div v-if="!isCollapse">
        <span class="logoImg_l"></span>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
  name: "logo",
  data() {
    return {};
  },
  props: ["isCollapse"],
  created() {},
  computed: {
    ...mapGetters(["website"]),
    type: function(val) {
      return this.website.logo.indexOf("static") != -1;
    }
  },
  methods: {}
};
</script>
<style scoped="scoped" lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 230px;
  height: 64px;
  line-height: 64px;
  background: #409EFF;
  color: #fdfdfd;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  // box-sizing: border-box;
  transition:all .6s
}
.logo_title {
  padding: 0 0 0 0;
  color: #fff;
  font-size: 28px;
  &.is-bold {
    font-weight: 700;
  }
}
.is-text {
  position: absolute;
  top: 0;
  left: 10px;
}
.is-img {
  position: absolute;
  top: 10px;
  left: 10px;
}
.logo_subtitle {
  font-size: 16px;
  padding-top: 5px;
}
.logoImg_s{
  display: block;
  width:38px;
  height:38px;
  background: url('../../../assets/img/logo_2.png')no-repeat center;
  background-size: contain
}
.logoImg_l{
  display: block;
  width:184px;
  height:64px;
  background: url('../../../assets/img/logo_1.png')no-repeat center;
  background-size: contain
}
</style>
