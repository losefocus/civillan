<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <div class="logoImg"></div>
    <div class="login-info text-white animated fadeInLeft">
      <h2 class="login-info-title">{{website.info.title}}</h2>
      <ul class="login-info-list">
        <li class="login-info-item" v-for="(item,index) in website.info.list" :key="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="login-border  animated fadeInRight">
      <div class="login-main">
        <h4 class="login-title">智慧云平台管理系统
          <!-- <top-theme></top-theme> -->
        </h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户密码" name="user">
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

  </div>
</template>
<script>
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import thirdLogin from "./thirdlogin";
import topTheme from "../index/top/top-theme";
import theme from "@/mixins/theme";
import { mapGetters } from "vuex";
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
      activeName: "user"
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {}
};
</script>

<style lang="scss">
.logoImg{
  width: 195px;
  height: 45px;
  background: url("../../assets/img/logo.png")no-repeat center;
  position: absolute;
  top: 40px;
  left:220px;
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
}
.login-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/login.png");
  background-size: cover;
}
.login-info {
  margin-top: -110px;
  padding-left: 220px;
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
  margin-right: 210px;
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
  // background: #30a487;
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
</style>
