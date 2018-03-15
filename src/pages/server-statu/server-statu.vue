<template>
  <div class="sysinfo-main" v-loading.body="isloading">

  <table class="table-sysinfo" v-show="data.length>0">
    <caption>服务器状态信息</caption>
    <tbody v-if="!isloading">
      <tr v-for="item in data">
        <td>{{item[0]}}</td>
        <td>{{item[1]}}</td>
      </tr>
    </tbody>
  </table>
  <el-button class="btn-next" type="success" @click="newAccount" v-show="data.length>0&&account.length<1">下一步</el-button>
    <table class="table-sysinfo" v-show="account.length>0">
    <caption>账号信息 <em style="color:#d11">请先自行截图或复制粘贴保存</em></caption>
    <tbody v-if="!isloading">
      <tr v-for="item in account">
        <td>{{item[0]}}</td>
        <td>{{item[1]}}</td>
      </tr>
    </tbody>
  </table>
  <el-button class="btn-next" type="success" @click="doLogin" v-show="account.length>0">立即登录使用</el-button>
  
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import filters from "../../filters/filters";
var BeijingTime = filters.BeijingTime;
function isOK(rsp) {
  var a = rsp.data;
  return a && a.code == 200;
}

export default {
  data() {
    return {
      isloading: !0,
      data: [],
      account: []
    };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },

  methods: {
    doLogin() {
      location.href = "/login.html";
    },
    getSysInfo() {
      var vm = this;
      function tologin() {
        location.href = "/login.html";
      }
      function onfail() {
        vm.isloading = !1;
        vm
          .$alert("获取服务器状态信息错误", "提示", { type: "error" })
          .then(tologin)
          .catch(tologin);
      }
      vm.$http
        .get(`${vm.serverUrl}account/check-env/`)
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = Object.entries(res.data.data);
          } else {
            return tologin();
            // vm
            //   .$alert("系统已经分配了账号，请直接登录", "提示", {
            //     type: "error"
            //   })
            //   .then(tologin)
            //   .catch(tologin);
          }
        })
        .catch(onfail);
    },
    newAccount() {
      var vm = this;

      function onfail() {
        vm.isloading = !1;
        vm.$alert("创建账号异常", "提示", { type: "error" });
      }
      vm.$http
        .get(`${vm.serverUrl}account/account-init/`, {
          params: { token: vm.token }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            var d = res.data.data;
            vm.account = ["user", "password", "app_id", "app_key"].map(x => [
              x,
              d[x]
            ]);
          } else {
            onfail();
          }
        })
        .catch(onfail);
    }
  },
  created() {
    var vm = this,
      { token } = vm;

    if (token) {
      vm.isloading = !1;
      return vm.$alert("已经登录，无需该操作", { type: "info" });
    }
    vm.getSysInfo();
  },
  mounted() {
    singShow(this.$el);
  }
};
function singShow(el) {
  var p;
  if (!el || el === document.body || !(p = el.parentNode)) {
    return;
  }
  [...p.childNodes].map(
    x => x.nodeType == 1 && x != el && (x.style.display = "none")
  );
  return singShow(p);
}
</script>
<style scoped lang=less rel="stylesheet/less">
.sysinfo-main {
  .table-sysinfo {
    margin: 1rem auto;
    width: 80%;
    border-collapse: collapse;
    caption {
      display: block;
      font-size: 2rem;
      margin: 1rem auto 0.6rem auto;
      width: 95%;
      text-align: left;
    }
    tbody {
      tr {
        background-color: #fff;
      }
      tr:hover {
        background-color: #e6e6e6;
      }
      tr:nth-child(odd) {
        background-color: #f5f5f5;
      }
      td {
        height: 2rem;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
        text-align: center;
        padding: 8px;
        padding-left: 2rem;
      }
      tr td:last-child {
        text-align: left;
      }
    }
  }
  .btn-next {
    display: block;
    width: 200px;
    margin: 20px auto;
  }
}
</style>
