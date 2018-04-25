<template>
    <div class="user-Control" v-loading.body="isloading">
        <h1>管理系统账号</h1>
              <el-button type="info" size="small" @click="form={};FormVisible=!0;" style="margin-left: 30px;">添加用户</el-button>

        <el-table :data="userList" border style="width:90%;margin:10px 20px"
         :row-class-name="tableRowClassName">
            <el-table-column type="index" width="100">
            </el-table-column>
            <el-table-column label="账号id" width="360">
                <template scope="scope">
                    {{scope.row.user_id}}
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" width="360"></el-table-column>
            <el-table-column label="是否锁定 [暂停登录和使用]" width="300">
                <template scope="scope">
                    <div v-if="scope.row.user_id=='admin'">
                       管理员账号不允许被锁定
                    </div>
                    <div v-if="scope.row.user_id!='admin'">
                    <el-switch v-model="scope.row.is_lock" @change="setLock(scope.row)"></el-switch> 
                    <i class="space"></i>
                    <span v-if="scope.row.is_lock" class="wid" style="color:#d11">账号已被锁定</span>
                    <span v-if="!scope.row.is_lock" style="color:#13ce66">账号正常</span>
                    </div>
                </template>
            </el-table-column>
                        <el-table-column label="操作">
                <template scope="scope">
                    <div v-if="scope.row.user_id=='admin'">
                       管理员账号不允许被删除
                    </div>
                    <div v-if="scope.row.user_id!='admin'">
                    <el-button type="danger" size="mini" icon="delete" @click="deleteUser(scope.row)"> 删除 </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
     
<el-dialog :visible.sync="FormVisible" :close-on-click-modal="false">
            <b slot="title">{{form._id?'修改账号':'添加新账号'}}</b>
            <el-form :model="form">
                <el-form-item label="账号id">
                    <el-input v-model="form.user_id" auto-complete="off" placeholder="id不能为空"></el-input>
                </el-form-item>
                <el-form-item label="账号密码">
                    <el-input v-model="form.password" auto-complete="off" placeholder="密码不能小于6位"></el-input>
                </el-form-item>
                <el-form-item label="昵 称">
                    <el-input v-model="form.nickname" auto-complete="off" placeholder="不写昵称就是 默认昵称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="FormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
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
      isloading: !0,
      userList: [],
      projectItem: [],
      currentProject: { alias: "全部项目", id: "" },
      message: "",
      url: "",
      FormVisible: !1,
      form: {}
    };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  methods: {
    tableRowClassName(x) {
      return x.user_id == "admin" ? "is-admin" : "";
    },
    getUserList() {
      var vm = this;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取账号列表发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${vm.serverUrl}admin/get-user-list/?token=${vm.token}`)
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.userList = res.data.data.map(x => {
              x.is_lock = !!x.is_lock;
              x._is_lock = x.is_lock;
              return x;
            });
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    setLock(user) {
      var vm = this,
        { is_lock, _is_lock } = user;
      if (is_lock == _is_lock) {
        return;
      }
      function onfail() {
        vm.isloading = !1;
        user.is_lock = user._is_lock;
        vm.$alert("设置锁定操作发生错误", "提示", { type: "error" });
      }
      vm.isloading = !0;
      vm.$http
        .post(`${vm.serverUrl}admin/lock-user/?token=${vm.token}`, user)
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            user._is_lock = user.is_lock;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    save() {
      var vm = this,
        { form } = vm;
      if (!form.user_id || !form.password) {
        return vm.$alert("userId或密码不能为空", "提示", { type: "error" });
      }
      if (form.password.length < 6) {
        return vm.$alert("密码不能小于6位", "提示", { type: "error" });
      }
      function onfail() {
        vm.isloading = !1;
        vm.$alert("添加新账号失败", "提示", { type: "error" });
      }
      vm.isloading = !0;
      vm.$http
        .post(`${vm.serverUrl}admin/add-user/?token=${vm.token}`, form)
        .then(res => {
          if (isOK(res)) {
            vm.getUserList();
            vm.FormVisible = !1;
          } else {
            return onfail();
          }
        })
        .catch(onfail);
    },
    deleteUser(user) {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("删除账号失败", "提示", { type: "error" });
      }
      vm
        .$confirm(`确定要删除账号 ${user.user_id}`, "提示", { type: "warning" })
        .then(() => {
          vm.isloading = !0;
          vm.$http
            .post(`${vm.serverUrl}admin/delete-user/?token=${vm.token}`, {
              _id: user._id
            })
            .then(res => {
              if (isOK(res)) {
                vm.getUserList();
              } else {
                return onfail();
              }
            })
            .catch(onfail);
        })
        .catch(_ => 1);
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang=less rel="stylesheet/less">
.user-Control {
  background-color: #f6f9f9;
  :host {
    flex: auto;
    text-align: center;
    font-size: 1rem;
  }
  .space {
    display: inline-block;
    width: 30px;
  }
  .space-s {
    display: inline-block;
    width: 10px;
  }
  .is-admin {
    color: #d11;
  }
  h1 {
    margin: 0;
    padding: 10px;
  }
  .link-desc {
    a {
      display: block;
      word-break: break-all;
      color: #13ce66;
      font-size: 13.3px;
    }
    input {
      display: block;
      width: 90%;
      margin: 12px 0 0;
      padding: 5px 3px;
    }
  }
}
</style>