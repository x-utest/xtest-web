<template>
  <div class="sysinfo-main" v-loading.body="isloading">
    <h1>系统信息</h1>
    <!-- <div class="row">
        <span class="lf">app_id</span>
        <div v-if="organize.app_id" class="rt">
            <b class="text">{{ organize.app_id}}</b>
        </div>
    </div>
    <div class="row">
        <span class="lf">app_key</span>
        <div v-if="organize.app_key" class="rt">
            <b class="text">{{ organize.app_key}}</b>
        </div>
    </div> -->
  <table class="table-sysinfo">

    <tbody v-if="!isloading">
      <tr>
        <td>当前时间</td>
        <td>{{data.req_time}}</td>
      </tr>
      <tr>
        <td>server</td>
        <td>{{data.server}}</td>
      </tr>
      <tr>
        <td>app_version</td>
        <td>{{data.app_version}}</td>
      </tr>
      <tr>
        <td>dtlib_version</td>
        <td>{{data.dtlib_version}}</td>
      </tr>
    </tbody>
  </table>
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
      data: {}
      // organize:{}
    };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },

  methods: {
    getSysInfo() {
      var vm = this;

      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取系统信息发生错误", "提示", { type: "error" });
      }

      vm.$http
        .get(`${vm.serverUrl}app-info/`, {
          params: { token: vm.token }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = res.data.data;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    }
  },
  created() {
    this.getSysInfo();
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
.sysinfo-main {
  h1 {
    margin: 10px;
  }
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
}
</style>





