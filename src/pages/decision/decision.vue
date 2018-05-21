<template>
    <div class="decision" v-loading.body="isloading">
      <div>
        <h1>判定测试详细信息</h1>
        <span class="mark l20">筛选项目:</span>
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
        <div class="mark 120" v-if="currentProject.tags.length>0">
          <span class="l20">筛选版本:</span>
        <el-checkbox-group v-model="checkTags"  class="mark">
          <div v-for="x in currentProject.tags" class="mark" style="margin-left:10px;">
          <el-checkbox :label="x"></el-checkbox>
              </div>
      </el-checkbox-group>
    <el-button type="primary" size="mini" class="l20" style="padding:5px 10px" @click="getTests()">筛选</el-button>
    </div>
  </div>
        <el-table :data="data" border style="width:90%;margin:10px 20px">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="ID" width="120">
                <template scope="scope">
                    <router-link :to="{path:'/test-report',query:{id:scope.row._id}}">{{scope.row._id | SliceString(8)}}</router-link>
                </template>
            </el-table-column>
            <el-table-column label="项目代号" min-width="150">
                <template scope="scope">
                  <div class="relative">
                    <b>{{scope.row.pro_name }}</b>
                    <span :class="'tag-label'+(scope.row.tag=='default'?' def':'')">{{scope.row.tag}}</span>
                  </div>  
                </template>
            </el-table-column>
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
import qs from "qs";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      isloading: !0,
      data: [],
      pageNum: 1,
      totalPage: 10,
      projectItem: [],
      currentProject: { alias: "全部项目", id: "", tags: [] },
      checkTags: [],
      message: "",
      url: "",
      dialogVisible: !1
    };
  },
  computed: {
    ...mapState(["serverUrl", "token", "loginUser"])
  },
  methods: {
    getTests(num) {
      var vm = this,
        num = num || vm.pageNum,
        tag = vm.checkTags,
        projId = vm.currentProject.id,
        params = {
          page_idx: num,
          token: vm.token,
          tag
        };
      vm.isloading = !0;
      projId && (params.pro_id = projId);
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取项目信息发生错误", "提示", { type: "error" });
      }

      vm.$http
        .get(`${vm.serverUrl}testdata/list-test-data/`, {
          params,
          paramsSerializer(p) {
            return qs.stringify(p, { indices: !1 });
          }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = res.data.data.page_data.map(x => {
              if (!x.id) {
                x.id = x._id;
              }
              if (!x.tag) {
                x.tag = "default";
              }
              return x;
            });
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
      this.getTests(page);
    },
    handleCommand(projId) {
      var vm = this;
      if (vm.currentProject.id == projId) {
        return;
      }
      vm.checkTags = [];
      var matchs = vm.projectItem.find(x => x.id == projId);
      vm.currentProject = {
        id: projId,
        alias: (matchs || 1).project_name,
        tags: ((matchs || 1).tags || []).slice(0)
      };
      //刷新获取新数据
      vm.pageNum = 1;
      vm.getTests();
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
                vm.getTests();
              } else {
                vm.$alert(`删除失败\n${res.data.data}`);
              }
            })
        )
        .catch(_ => _);
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
          vm.projectItem = proj.map(x => {
            if (!x.id) {
              x.id = x._id;
            }
            return x;
          });
        });
    }
  },
  created() {
    this.getTests(1);
    this.getProject();
  }
};
</script>

<style scoped lang=less rel="stylesheet/less">
@import "../../assets/public.less";
.decision {
  background-color: #f6f9f9;
  :host {
    flex: auto;
    text-align: center;
    font-size: 1rem;
  }
  .mark {
    display: inline-block;
  }
  .l20 {
    margin: 0 10px 0 20px;
  }
  h1 {
    float: left;
    font-size: 2rem;
    margin: 0 1rem 0.6rem 2.5%;
    text-align: left;
  }
  .relative {
    position: relative;
  }
  .tag-label {
    position: absolute;
    padding: 0 8px;
    top: 0;
    right: 0;
    background: #4294d5;
    color: #fff;
    border-radius: 3px;
  }
  .tag-label.def {
    background: #13ce66;
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





