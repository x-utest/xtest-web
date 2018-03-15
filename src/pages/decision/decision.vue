<template>
    <div class="decision" v-loading.body="isloading">
        <h1>判定测试详细信息</h1>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{currentProject.alias}}
                <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="project.id" v-for=" project in projectItem">{{project.project_name}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    
        <el-table :data="data" border style="width:90%;margin:10px 20px">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="ID" width="120">
                <template scope="scope">
                    <router-link :to="{path:'/test-report',query:{id:scope.row._id}}">{{scope.row._id | SliceString(8)}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="pro_name" label="项目代号" min-width="150"></el-table-column>
            <el-table-column prop="pro_version" label="版本号" width="140"></el-table-column>
            <el-table-column prop="total" label="用例数" width="80"></el-table-column>
            <el-table-column prop="failures" label="失败" width="70"></el-table-column>
            <el-table-column prop="errors" label="错误" width="70"></el-table-column>
            <el-table-column prop="skipped" label="跳过" width="70"></el-table-column>
            <el-table-column label="耗时(s)" width="100">
                <template scope="scope">
                    {{scope.row.run_time | Numberdecimal }}
                </template>
            </el-table-column>
            <el-table-column label="测试日期" width="200">
                <template scope="scope">
                    {{scope.row.rc_time |BeijingTime }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template scope="scope">
                    <el-button type="danger" size="mini" icon="delete" @click="del(scope.row._id)"></el-button>
    
                </template>
    
            </el-table-column>
        </el-table>
    
        <div style="height:20px"></div>
        <el-pagination layout="prev, pager, next" :page-count="totalPage" :page-size="4" :current-page="pageNum" @current-change="handleCurrentChange">
        </el-pagination>
        <el-dialog title="分享链接" :visible.sync="dialogVisible" size="small">
            <div class="link-desc">
                <a target="_blank" :href="url">{{url}}</a>
                <el-button type="info" size="small" style="margin-left: 45px;">复制</el-button>
                <input type="text" :value="url" spellcheck="false">
            </div>
    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
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
      data: [],
      pageNum: 1,
      totalPage: 10,
      projectItem: [],
      currentProject: { alias: "全部项目", id: "" },
      message: "",
      url: "",
      dialogVisible: !1
    };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  methods: {
    getProjectInfo(num) {
      var vm = this,
        projId = vm.currentProject.id,
        params = {
          page_idx: num,
          token: vm.token
        };
      vm.isloading = !0;
      projId && (params.pro_id = projId);
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取项目信息发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${vm.serverUrl}testdata/list-test-data/`, { params })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = res.data.data.page_data;
            vm.totalPage = res.data.data.page_total_cnts;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    handleCurrentChange(page) {
      //pageNum变成当前的，然后toggle时候才能还原为1，不然一直没变都是默认的1，数据驱动
      this.pageNum = page;
      console.log(`当前页: ${page}`);
      this.getProjectInfo(page);
    },
    handleCommand(projItemId) {
      var vm = this;
      vm.currentProject = {
        id: projItemId,
        alias: (vm.projectItem.find(x => x.id == projItemId) || {}).project_name
      };
      //刷新获取新数据
      vm.$http
        .get(`${vm.serverUrl}testdata/list-test-data/`, {
          params: {
            page_idx: vm.pageNum,
            token: vm.token,
            pro_id: projItemId
          }
        })
        .then(res => {
          vm.data = res.data.data.page_data;
          vm.totalPage = res.data.data.page_total_cnts;
        });
    },
    del(id) {
      var vm = this;
      vm
        .$confirm("确定要删除该判定测试?", "提示", { type: "warning" })
        .then(() =>
          vm.$http
            .get(`${vm.serverUrl}testdata/delete-test-data/`, {
              params: {
                id,
                token: vm.token
              }
            })
            .then(res => {
              if (isOK(res)) {
                vm.getProjectInfo();
              } else {
                vm.$alert(`删除失败\n${res.data.data}`);
              }
            })
        )
        .catch(_ => _);

      // function doShare() {
      //     vm.isloading = !0;
      //     function onfail() {
      //         vm.isloading = !1;
      //         vm.$alert('分享项目发生错误', '提示', { type: 'error' })
      //     }
      //     axios.get(`${serverUrl}share/get-utest-share-link/`, {
      //         params: {
      //             rep_id: _id,
      //             token: vm.token
      //         }
      //     }).then(res => {
      //         vm.isloading = !1;
      //         if (isOK(res)) {
      //             vm.dialogVisible = true;
      //             vm.message = "分享链接";
      //             vm.url = res.data.data.share_url
      //         } else { onfail() }
      //     }).catch(onfail)
      // }
    },
    getProject() {
      var vm = this;
      vm.$http
        .get(`${vm.serverUrl}project/list-projects/`, {
          params: { token: vm.token }
        })
        .then(res => {
          var proj = res.data.page_data;
          proj.unshift({ project_name: "全部项目" });
          vm.projectItem = proj;
        });
    }
  },
  created() {
    this.getProjectInfo(1);
    this.getProject();
  }
};
</script>

<style scoped lang=less rel="stylesheet/less">
@import "../../assets/public.less";

.decision {
  background-color: #f6f9f9;
  height: 100vh;
  :host {
    flex: auto;
    text-align: center;
    font-size: 1rem;
  }
  h1 {
    float: left;
    font-size: 2rem;
    margin: 0 1rem 0.6rem 2.5%;
    text-align: left;
  }
  .el-pagination {
    padding-left: 26px;
    margin-bottom: 50px;
  }
  .el-dropdown {
    font-size: 20px;
    margin-top: 5px;
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





