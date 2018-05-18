<template>
    <div id="navBar">
               <div class="logo">
                   <img src="../assets/img/logo.png">
            <span> {{appName}}</span>
            </div>
        <div class="user-box">
            <span class="icon icon-user"></span>
            用户名：
            <router-link :to="{path:'/user-info'}" style="color:#20a0ff">{{loginUser.userName}}</router-link>
            <div class="logout" v-on:click="logout">
                退出登录
            </div>
        </div>

    </div>
</template>
<script>
import { cookie } from "cookie_js";
import { mapState, mapMutations, mapActions } from "vuex";
import { appName } from "../sysConfig/page";

function isOK(rsp) {
  var a = rsp.data;
  return a && a.code == 200;
}

function jumpLogin() {
  cookie.remove("token");
  location.href = "/login.html";
}
export default {
  data() {
    return { appName };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  methods: {
    logout() {
      var vm = this;
      if (!vm.token) {
        return jumpLogin();
      }
      vm
        .$confirm("确定要退出登录吗", "提示", { type: "warning" })
        .then(() =>
          vm.$http
            .get(`${vm.serverUrl}account/user-logout/`, {
              params: { token: vm.token }
            })
            .then(jumpLogin)
            .catch(jumpLogin)
        )
        .catch(_ => 1);
    }
  }
};
</script>
<style scoped lang=less  rel="stylesheet/less">
@import "../assets/public.less";

#navBar {
  height: @gtt-header;
  line-height: @gtt-header;
  background: linear-gradient(180deg, #545c61 0%, #363e43 100%);
  color: #a9a9a4;
  font-size: 14px;
  vertical-align: middle;
  position: fixed;
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  .logo,
  .menu,
  .login {
    float: left;
  }
  .logo {
    position: relative;
    margin-left: 20px;
    padding-left: 30px;
    color: #fff;
    img {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 0;
      margin-top: -10px;
    }
  }
  .user-box {
    margin-right: 20px;
    color: white;
    display: flex;
    align-items: center;
    .logout {
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .login {
    cursor: pointer;
    float: right;
    height: @gtt-header;
    a {
      font-size: 16px;
      margin-right: 20px;
      line-height: 29px;
      height: 29px;
      color: white;
    }
  }
}
</style>

