<template>
    <div class="user-info" v-loading.body="isloading">
      <h1>用户信息管理</h1>
        <div class="container">
            <div class="row mute">
                <span class="lf">用户昵称</span>
                <div class="rt">
                    <input v-model="userName" />
                    <div class="btn-wrap">
                        <button @click="alterName">修改昵称</button>
                    </div>
                </div>
            </div>
            <div class="row mute">
                <span class="lf">QQ</span>
                <div class="rt">
                    <input v-model="userdetail.qq" />
                </div>
            </div>
            <div class="row mute">
                <span class="lf">邮箱</span>
                <div class="rt">
                    <input v-model="userdetail.email" />
                </div>
            </div>
            <div class="row">
                <span class="lf">手机号</span>
                <div class="rt">
                    <input v-model="userdetail.phone" />
                    <div class="btn-wrap">
                        <button @click="updateUser">修改信息</button>
                    </div>
                </div>
            </div>
            <div class="row" style="display:none">
                <span class="lf">组织</span>
                <div v-if="team.name" class="rt">
                    <b class="text">{{ team.name}}</b>
                    <div class="btn-wrap">
                        <button @click="showInvate">邀请加入</button>
                        <button @click="alterTeamName">修改名称</button>
                        <button class="warn" @click="leaveTeam">退出组织</button>
                    </div>
                </div>
                <div v-if="!team.name">
                    <b class="text" style="color: #d11">目前没有加入任何组织</b>
                </div>
            </div>
                <div class="row">
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
    </div>
        </div>
    </div>
</template>

<script>
function isOK(rsp) {
  var a = rsp.data;
  return a && a.code == 200;
}
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      isloading: !1,
      userName: "",
      userdetail: {},
      team: { name: "" },
      organize: {}
    };
  },
  methods: {
    ...mapMutations(["SET_LoginUser"]),
    getUserDetail() {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取信息发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${vm.serverUrl}account/get-user-detail/`, {
          params: {
            token: vm.token
          }
        })
        .then(res => {
          if (isOK(res)) {
            vm.userdetail = res.data.data;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    getTeam() {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取组织信息发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${vm.serverUrl}account/get-auth-user-org/`, {
          params: {
            token: vm.token
          }
        })
        .then(
          res => {
            if (isOK(res)) {
              vm.team = res.data.data;
              if (!vm.team.id) {
                vm.team.id = vm.team._id;
              }
              vm.getOrganize(vm.team.id);
            }
          },
          error => {}
        );
    },
    getOrganize(id) {
      var vm = this;

      vm.$http
        .get(`${vm.serverUrl}webapp/get-org-test-apps/`, {
          params: {
            token: vm.token,
            org_id: id
          }
        })
        .then(
          res => {
            if (isOK(res)) {
              vm.organize = res.data.data;
            }
          },
          error => {}
        );
    },
    alterName() {
      var vm = this,
        name = vm.userName;
      if (name == vm.loginUser.userName) {
        return vm.$message("昵称没有变化");
      }
      if (!name) {
        return vm.$alert("昵称不能为空", "提示", { type: "info" });
      }
      vm.$http
        .post(`${vm.serverUrl}account/set-auth-user-info/`, {
          token: vm.token,
          nick_name: name
        })
        .then(res => {
          if (isOK(res)) {
            vm.SET_LoginUser({ userName: name });
            vm.$message("昵称已修改");
          } else {
            vm.$alert("昵称修改失败");
          }
        });
    },
    updateUser() {
      var vm = this;
      vm.userdetail.token = vm.token;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("退出组织发生错误", "提示", { type: "error" });
      }
      vm.isloading = !0;
      vm.$http
        .post(`${vm.serverUrl}account/update-user-detail/`, vm.userdetail)
        .then(res => {
          if (isOK(res)) {
            vm.isloading = !1;
            vm.$message("用户信息已修改");
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    alterTeamName() {
      var vm = this;

      vm
        .$prompt(" ", "请输入组织名称", {
          inputValue: vm.team.name,
          beforeClose: (action, instance, done) => {
            function onfail(data) {
              vm.isloading = !1;
              vm.$notify.error({
                title: "错误",
                message: data.code == 403 ? data.msg : "修改组织名称发生错误"
              });
            }
            if (action === "confirm") {
              let name = instance.$refs.input.value;
              if (!name || name === vm.team.name) {
                return (
                  vm.$notify({
                    title: "警告",
                    message: "组织名称不能为空或未发生改变",
                    type: "warning"
                  }),
                  done()
                );
              }
              vm.isloading = !0;
              vm.$http
                .post(`${vm.serverUrl}account/update-organization/`, {
                  token: vm.token,
                  id: vm.team.id,
                  name
                })
                .then(res => {
                  if (isOK(res)) {
                    done();
                    vm.isloading = !1;
                    vm.$notify({
                      title: "提示",
                      message: "组织名称已修改",
                      type: "success"
                    });
                    vm.team.name = name;
                  } else {
                    onfail(res.data);
                  }
                })
                .catch(onfail);
            } else {
              done();
            }
          }
        })
        .catch(_ => _);
    },
    showInvate() {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("操作失败", "提示", { type: "error" });
      }
      vm.isloading = !0;
      vm.$http
        .get(`${vm.serverUrl}account/get-org-invite-link/`, {
          params: {
            token: vm.token,
            org_id: vm.team.id
          }
        })
        .then(res => {
          if (isOK(res)) {
            vm.isloading = !1;
            let h = vm.$createElement;
            vm.$msgbox({
              title: "邀请链接",
              type: "success",
              message: h("p", null, [
                h(
                  "div",
                  { style: "word-break:break-all;margin:0 10px 10px 5px;" },
                  res.data.data.link
                ),
                h(
                  "b",
                  { attrs: { href: res.data.data.link, target: "_blank" } },
                  "请复制链接发给好友"
                )
              ])
            });
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    leaveTeam() {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("退出组织发生错误", "提示", { type: "error" });
      }
      vm
        .$confirm("确定要退出组织?", "提示", { type: "warning" })
        .then(() => {
          vm.isloading = !0;
          vm.$http
            .get(`${serverUrl}account/exit-current-org/`, {
              params: {
                token: vm.token
              }
            })
            .then(res => {
              if (isOK(res)) {
                vm.isloading = !1;
                vm.getTeam();
              } else {
                onfail();
              }
            })
            .catch(onfail);
        })
        .catch(_ => _);
    }
  },
  watch: {
    "loginUser.userName"(a) {
      var vm = this;
      !vm.userName && a && (this.userName = a);
    }
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  mounted() {
    var vm = this,
      a = vm.loginUser.userName;
    !vm.userName && a && (vm.userName = a);
  },
  created() {
    var vm = this;
    vm.getTeam();
    vm.getUserDetail();
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
.user-info {
  h1{margin:10px}
  .container {
    min-height: 89vh;
    width: 80%;
    padding: 50px 0;
    margin: 0 auto;
    .row {
      position: relative;
      margin: 5px 10px;
      padding: 5px 0 15px 130px;
      min-height: 46px;
      border-bottom: 1px solid #333;
      &.mute {
        border-bottom: none;
      }
      .lf {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        padding: 5px;
        text-align: right;
        color: #333;
      }
      .rt {
        position: relative;
      }
      input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: none;
        padding: 3px 10px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
      }
      input,
      .text {
        display: block;
        width: 480px;
      }
      .text {
        padding: 2px 10px;
      }
      .btn-wrap {
        position: absolute;
        left: 500px;
        top: 3px;
      }
      button {
        padding: 7px 9px;
        margin-right: 10px;
        font-size: 12px;
        border-radius: 4px;
        color: #fff;
        background-color: #20a0ff;
        border: none #20a0ff;
        outline: none;
        cursor: pointer;
      }
      button:hover {
        background: #4db3ff;
        border-color: #4db3ff;
      }
      button.warn {
        background: #ff4949;
      }
      button.warn:hover {
        background: #ff6d6d;
        border-color: #ff6d6d;
      }
    }
  }
}
</style>






