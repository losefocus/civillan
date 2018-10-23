<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <div class="bgImage" :style="bgStyle"></div>
    <div class="login-left">
      <div class="logoImg animated fadeInLeft"></div>
      <div class="login-info text-white animated fadeInLeft">
        <h2 class="login-info-title">{{website.info.title}}</h2>
        <ul class="login-info-list">
          <li class="login-info-item" v-for="(item,index) in website.info.list" :key="index">
            {{item}}
          </li>
        </ul>
      </div>
      <div></div>
    </div>
    <div class="login-border  animated fadeInRight">
      <div class="login-main">
        <h4 class="login-title">智慧云平台管理系统
          <!-- <top-theme></top-theme> -->
        </h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="账号信息" name="user">
            <userLogin></userLogin>
          </el-tab-pane>
          <!-- <el-tab-pane label="短信验证码" name="code">
            <codeLogin></codeLogin>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="第三方授权登录" name="third">
            <thirdLogin></thirdLogin>
          </el-tab-pane> -->
        </el-tabs>
        <p class="pull-right" style="font-size:12px;cursor: pointer;">忘记密码？</p>
      </div>
    </div>
    <div class="copyright">Copyright 2018 <a href="http://www.civillan.com/" >浙江智握领程科技股份有限公司</a> 版权所有</div>
  </div>
</template>
<script>
  import userLogin from "./userlogin";
  import codeLogin from "./codelogin";
  import thirdLogin from "./thirdlogin";
  import topTheme from "../index/top/top-theme";
  import theme from "@/mixins/theme";
  import {mapGetters} from "vuex";
  import bgImg from '@/assets/img/login.png'

  export default {
  name: "login",
  mixins: [theme()],
  components: {
    topTheme,
    userLogin,
    codeLogin,
    thirdLogin
  },
  data() {
    return {
      activeName: "user",
      bgStyle:{'background-image':'url("'+bgImg+'")'}
    };
  },
  created() {},
  mounted() {
    this.checkBrowser()
  },
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    checkBrowser(){
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR/") > -1; //判断是否Opera浏览器
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
      var isEdge = userAgent.indexOf("Edge") > -1 || userAgent.indexOf(") like Gecko")>-1; //判断是否IE的Edge浏览器
      var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
      var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
      var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("OPR/") == -1 && userAgent.indexOf("Edge") == -1; //判断Chrome浏览器

      //获取IE版本号
      if(isIE){
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);	//IE版本号
      }else{
        
      }
    }
  }
};
</script>

<style lang="scss">
.copyright{
  width: 100%;
  position: absolute;
  z-index: 3;
  bottom: 20px;
  left: 0;
  overflow: hidden;
  color: #fff;
  zoom: 1;
  margin: 0;
  text-align: center
}
.logoImg{
  width: 195px;
  height: 60px;
  background: url("../../assets/img/logo.png")no-repeat center;
  margin-top:40px;
  background-size: contain
  // position: absolute;
  // top: 40px;
  // left:220px;
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
}
.login-container .bgImage {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // background-image: url("../../assets/img/login.png");
  background-size: cover;
}
.login-left{
  height: 100%;
  display: flex;
  // align-items: center;
  flex-direction:column;
  // align-content:space-between;
  justify-content:space-between
  // justify-content: space-around;
}
.login-info {
  margin-top: -150px;
  // padding-left: 220px;
}
.login-info-title {
  line-height: 100px;
  font-size: 52px;
  font-weight: bold;
  letter-spacing:2px;
}
.login-info-item {
  font-size: 22px;
  letter-spacing:2px;
  word-spacing: 20px
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 40px 25px 40px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
  // margin-right: 210px;
  margin-top:-40px;
}
.login-main {
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #409EFF;
  letter-spacing: 3px;
}
.login-submit {
  margin-top: 20px;
  width: 100%;
  // background: #409eff;
  // border-radius: 28px;
}
.login-form {
  margin: 10px 0;
  .el-form-item__content {
    width: 270px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  width: 100px;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 32px;
  text-indent: 5px;
  text-align: center;
}

@media screen and (max-width: 1024px) {
  .logoImg{
    left:60px
  }
  .login-info {
    margin-top: -90px;
    padding-left: 60px;
    .login-info-title{
      font-size: 38px;
      letter-spacing: 0px;
    }
    .login-info-item {
      font-size: 18px;
      letter-spacing: 0px;
      word-spacing: 10px
    }
  }
  .login-border{
    margin-right: 50px;
    margin-top:-40px;
    padding:10px;
    .login-main{
      width:210px;
    }
    .login-title{
      letter-spacing: 0
    }
    .el-form-item__content{
      width:100%
    }
    .login-code{
      margin: 4px 0 0 0px;
    }
    .login-code-img{
      height: 30px;
      width: 90px;
    }
  }
}
@media screen and (max-width: 1280px){
  .login-info-title{
    font-size: 46px
  }
}

.browserList{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top:20px;
  li{
    width:50px;
    height:50px;
    margin: 0 20px;
    cursor: pointer;
    img{
      width:100%;
      height:100%;
    }
  }
}
</style>
