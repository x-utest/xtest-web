<template>
    <div id="app">
        <gtt-header></gtt-header>
        <div class="content">
            <ggd-nav></ggd-nav>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
        <gtt-footer></gtt-footer>
    </div>
</template>
<script>
import { cookie } from "cookie_js";
function jumplogin() {
  cookie.remove("token");
  var url = "/login.html";
  return (window.location = url);
}
function isOK(rsp) {
  var a = rsp.data;
  return a && a.code == 200;
}

import ggdNav from "./components/ggd-nav.vue";
import gttHeader from "./components/header.vue";
import gttFooter from "./components/footer.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations([
      "SET_TOKEN", // 映射 this.increment() 为 this.$store.commit('increment')
      "SET_LoginUser"
    ])
  },
  components: {
    ggdNav,
    gttHeader,
    gttFooter
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  created() {
    var k = "token",
      vm = this,
      token = cookie.get(k);
    if (!token) {
      return vm.$router.push({ path: "/server-statu", query: {} });
    }

    function onfail(e) {
      vm.SET_TOKEN("");
      if (e) {
        return vm
          .$alert("服务器异常，请联系管理员或稍后再试", "提示", {
            type: "error"
          })
          .catch(e => 1);
      }
      vm
        .$alert("用户信息无效，请重新登陆", "提示", { type: "error" })
        .then(jumplogin)
        .catch(e => 1);
    }
    vm.SET_TOKEN(token);
    vm.$http
      .get(vm.serverUrl + "account/get-auth-user-info/", {
        params: { token }
      })
      .then(res => {
        vm.fullscreenLoading = !1;
        if (!isOK(res)) {
          return onfail();
        }
        var user = res.data.data;
        vm.SET_LoginUser(user);
        cookie.set(k, token, {
          expires: 7, // expires in one week
          path: "/"
        });
      })
      .catch(onfail);
  }
};
</script>
<style scoped lang=less  rel="stylesheet/less">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  .main {
    flex: 1;
    margin-top: 40px;
    margin-left: 200px;
    height: calc(~"100% - 40px");
  }
  .content {
    display: flex;
    height: 100%;
  }
}
</style>






