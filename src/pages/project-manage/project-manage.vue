<template>
    <div class="project-manage" v-loading.body="isloading">
        <h1>项目信息</h1>
        <div style="width:90%;margin:10px 0">
          <div style="position: relative">
       <el-button type="info" size="small" @click="form={};FormVisible=!0;" style="margin-left: 30px;">添加项目</el-button>
       <div class="chk-tv">
         <span v-show="showTV">
         <a href="/TV-Exhibition.html" target="_blank">
         <span class="tv-link" style="left:0"></span>访问电视展示页面 - 项目轮播</a>
           <i class="space"></i>
           </span>
         <el-checkbox v-model="showTV">显示电视版功能</el-checkbox>
         </div>
            </div>
        <el-table :data="projectItems" border style="width:100%;margin:10px 20px">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="名称" width="250">
                <template scope="scope">
                    <router-link :to="{path:'/testChart',query:{id:scope.row.id}}">{{scope.row.project_name}}</router-link>
                </template>
            </el-table-column>
            <el-table-column label="项目编号" width="150">
                <template scope="scope">
                    {{scope.row.id|SliceString(10)}}
                </template>
            </el-table-column>
            <el-table-column prop="mark" label="项目描述"></el-table-column>
            <el-table-column label="创建时间" width="200">
                <template scope="scope">
                    {{scope.row.rc_time |BeijingTime }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                  <div v-show="!showTV">
                      <el-button type="info" size="mini" icon="information" title="查看配置信息" @click="popConfig(scope.row.id)"></el-button>
                    <el-button type="primary" size="mini" icon="edit" @click="alter(scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="delete" @click="del(scope.row.id)"></el-button>
                    </div>
                     <div v-show="showTV">
                       <el-popover  placement="left" @hide="setTVShow(scope.row)"  trigger="hover">
                         <p style="font-size: 14px;font-weight: bold;">勾选需要显示的版本</p>
                             <div>
                                 <el-checkbox-group v-model="scope.row.tv_tags" v-if="scope.row.tags.length>0">
                                  <div v-for="x in scope.row.tags" style="margin-bottom:5px;">
                                  <el-checkbox :label="x"></el-checkbox>
                                  </div>
                                </el-checkbox-group>
                                 <span v-if="scope.row.tags.length<1" style="color:#d11">
                                   没有版本，不需要设置
                                </span>
                               </div>
                          <b slot="reference" style="padding: 1px 8px;border:1px solid #e66">版本设置</b>
                        </el-popover>
                       <i class="space"></i>
                         <!-- <span v-show="!scope.row.tv" style="color:#d11">该项未开启</span> -->
                       <div style="display:inline-block">
    <el-button type="info" size="mini" icon="time" title="填写版本备注" @click="popTV(scope.row)"></el-button>
                    <a class="tv-link" :href="'/TV-Exhibition.html?id='+scope.row.id" target="_blank" title="访问电视展示页面" style="right:10px"></a>
                         </div>
                    </div>
                   </template>
            </el-table-column>
        </el-table>
        </div>  
 
        <div style="height:20px"></div>
        <el-pagination layout="prev, pager, next" :page-count="totalPage" :page-size="1" :current-page="pageNum" @current-change="getProject">
        </el-pagination>



        <el-dialog :visible.sync="FormVisible" :close-on-click-modal="false">
            <b slot="title">{{form.id?'修改项目':'添加新项目'}}</b>
            <el-form :model="form">
                <el-form-item label="项目名称">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目描述">
                    <el-input v-model="form.mark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="FormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    
        <el-dialog :visible.sync="configShow">
            <b slot="title"> {{configInfo.project_name}} 配置信息</b>
            <table cellspacing="0" cellpadding="0" border="0" class="el-table my-table">
                <tr>
                    <td>project_id</td>
                    <td>{{configInfo.project_id}}</td>
                </tr>
                <tr>
                    <td>app_id</td>
                    <td>{{configInfo.app_id}}</td>
                </tr>
                <tr>
                    <td>app_key</td>
                    <td>{{configInfo.app_key}}</td>
                </tr>
            </table>
            <div slot="footer">
                <el-button type="primary" @click="configShow = false">确 定</el-button>
            </div>
        </el-dialog>
    
        <el-dialog class="tvDialog" :visible.sync="contentInfoVisible" :close-on-click-modal="false">
            <b slot="title">{{contentInfo.name}} 版本备注</b>
            <div>
                <el-button type="primary" size="small" @click="addContent">新 建</el-button>
              </div>
            <div class="remark-list">
                <div v-for="(x,inx) in contentInfo.data" class="remark-item">
                    <div class="item-display" v-show="!x.isEdit">
                      <el-row>
                          <span v-if="g.val==x.group"  v-for="g in contentGroup" 
                          class="group-label" :style="'background:'+g.color">
                           {{g.text}}</span>
                           <i class="space"></i>
                           {{x.date_time}} 
                           <i class="space"></i>
                           <el-button type="primary" size="small" @click="x.isEdit=1">修 改</el-button>
                          <i class="space"></i>
                           <el-button type="danger" size="small" @click="removeContent(x,inx)">移 除</el-button>
                           </el-row>
                           <p class="remark"> {{x.content}}</p>
                      </div>
                      <div class="item-edit" v-show="x.isEdit">
                          <el-row>
                           <el-select size="small" v-model="x.group" placeholder="请选择">
                            <el-option
                              v-for="g in contentGroup"
                              :key="g.val"
                              :label="g.text"
                              :value="g.val">
                            </el-option>
                          </el-select>
                          <i class="space"></i>
                          <el-date-picker v-model="x.date_time" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                          <i class="space"></i>
                <el-button type="primary" size="small" @click="saveContentInfo(x)">确 定 </el-button>
                          <i class="space"></i>
                <el-button type="danger" size="small" @click="restoreContentInfo(x,inx)">撤 销 编 辑 </el-button>
                
                       </el-row>
                       <p class="remark">
                          <el-input type="textarea" :rows="1" v-model="x.content" placeholder="请输入内容"></el-input>
                         </p>
                      </div>
                  </div>
              </div>
        </el-dialog>
    </div>
</template>

<script>
function isOK(rsp) {
  var a = rsp.data;
  return a && a.code == 200;
}
import Sortable from "Sortablejs";
function bindSort(dom) {
  return;
  Sortable.create(document.querySelector(".tag-list"), {
    //handle: '.drag-handle',
    animation: 150
  });
}

import { mapState } from "vuex";
import filters from "../../filters/filters";
import { CtxComparer } from "../../assets/utils";
const { Time } = filters;

export default {
  data() {
    return {
      isloading: !0,
      projectItems: [],
      pageNum: 1,
      totalPage: 1,
      currentProject: "全部项目",
      showTV: !1,
      message: "",
      url: "",
      form: {},
      FormVisible: !1,
      configInfo: {},
      configShow: !1,
      contentInfo: {
        id: "",
        name: "",
        data: []
      },
      contentInfoVisible: !1,
      contentGroup: [
        { text: "开发组", val: "dev", color: "#409eff" },
        { text: "测试组", val: "test", color: "#67c23a" }
      ]
    };
  },
  computed: {
    ...mapState(["serverUrl", "token"])
  },
  methods: {
    popConfig(id) {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取配置信息发生错误", "提示", { type: "error" });
      }
      vm.isloading = !0;
      return vm.$http
        .get(`${vm.serverUrl}project/xtest-client-config/`, {
          params: {
            project_id: id,
            token: vm.token
          }
        })
        .then(res => {
          if (isOK(res)) {
            vm.isloading = !1;
            vm.configShow = true;
            vm.configInfo = res.data.data;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    popTV(row) {
      var { id, project_name } = row,
        vm = this;

      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取版本备注列表发生错误", "提示", { type: "error" });
      }
      vm.isloading = !0;
      return vm.$http
        .get(`${vm.serverUrl}dashboard/get_content/`, {
          params: {
            pro_id: id,
            token: vm.token
          }
        })
        .then(res => {
          if (isOK(res)) {
            vm.isloading = !1;
            vm.contentInfoVisible = true;
            vm.contentInfo.name = project_name;
            vm.contentInfo.id = id;
            vm.contentInfo.data = res.data.data.map(x => {
              x.content_id = x._id;
              delete x._id;
              x.isEdit = !1;
              x._restore = JSON.stringify(x);
              return x;
            });
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    setTVShow(proj) {
      var vm = this,
        { id, tags, tv_tags, _tv_tags } = proj;
      if (!tags.length) {
        return;
      }
      /* 必须跟原始值比对，有差异才提交修改 */
      if (CtxComparer.Array(tv_tags, _tv_tags)) {
        return;
      }
      function onfail() {
        vm.isloading = !1;
        proj.tv_tags = _tv_tags.slice(0);
        vm.$alert("设置电视展示版本发生错误", "提示", { type: "error" });
      }
      vm.isloading = !0;
      vm.$http
        .post(
          `${vm.serverUrl}dashboard/update_project_show/?token=${vm.token}`,
          {
            pro_id: id,
            tv_tags
          }
        )
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            proj._tv_tags = tv_tags.slice(0);
            vm.$message("版本展示信息已修改");
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    addContent() {
      var vm = this,
        remarks = vm.contentInfo.data;
      if (remarks.filter(x => !x.content_id).length > 0) {
        return vm.$message("不能新建多个未保存的版本备注");
      }
      return remarks.unshift({
        content_id: "",
        content: "",
        date_time: "",
        group: "",
        isEdit: !0
      });
    },
    restoreContentInfo(remark, inx) {
      var { _restore } = remark;
      if (_restore) {
        var _ = JSON.parse(_restore);
        Object.keys(_).map(x => (remark[x] = _[x]));
      } else {
        /*  移除新建 */
        this.contentInfo.data.splice(inx, 1);
      }
    },
    removeContent(remark, inx) {
      var vm = this,
        { token } = vm,
        { content_id } = remark;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("移除备注发生错误", "提示", { type: "error" });
      }
      vm
        .$confirm("确定要移除该备注?", "提示", { type: "warning" })
        .then(() => {
          vm.isloading = !0;
          vm.$http
            .post(
              `${vm.serverUrl}dashboard/delete_content/?token=${vm.token}`,
              { content_id }
            )
            .then(res => {
              if (isOK(res)) {
                vm.isloading = !1;
                vm.contentInfo.data.splice(inx, 1);
              } else {
                onfail();
              }
            })
            .catch(onfail);
        })
        .catch(e => 1);
    },
    saveContentInfo(remark) {
      var vm = this,
        form = JSON.parse(JSON.stringify(remark));
      form.pro_id = vm.contentInfo.id;
      delete form._restore;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("保存备注信息发生错误", "提示", { type: "error" });
      }
      if (!form.group) {
        return vm.$alert("请选择项目组", "提示", { type: "info" });
      }
      if (!remark.date_time) {
        return vm.$alert("请填写备注时间", "提示", { type: "info" });
      }
      form.date_time = Time.from(remark.date_time).getTime();
      if (!form.content) {
        return vm.$alert("请填写备注信息", "提示", { type: "info" });
      }
      vm.isloading = !0;
      vm.$http
        .post(
          `${vm.serverUrl}dashboard/update_content/?token=${vm.token}`,
          form
        )
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            if (res.data.data._id) {
              remark.content_id = res.data.data._id;
            }
            remark.isEdit = !1;
            remark.date_time = Time.toString(remark.date_time);
            remark._restore = [][0];
            remark._restore = JSON.stringify(remark);
            vm.isloading = !1;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    del(id) {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("删除项目发生错误", "提示", { type: "error" });
      }
      vm
        .$confirm("确定要删除该项目?", "提示", { type: "warning" })
        .then(() => {
          vm.isloading = !0;
          vm.$http
            .get(`${vm.serverUrl}project/delete-test-project/`, {
              params: {
                id,
                token: vm.token
              }
            })
            .then(res => {
              if (isOK(res)) {
                vm.isloading = !1;
                vm.getProject();
              } else {
                onfail();
              }
            })
            .catch(onfail);
        })
        .catch(_ => _);
    },
    alter(item) {
      var vm = this;
      vm.form = { name: item.project_name, mark: item.mark, id: item.id };
      vm.FormVisible = !0;
    },
    save() {
      var vm = this,
        f = vm.form;
      f.token = vm.token;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("保存项目信息发生错误", "提示", { type: "error" });
      }
      if (!f.name) {
        return vm.$alert("请填写项目名称", "提示", { type: "info" });
      }
      vm.isloading = !0;
      vm.$http
        .post(
          `${vm.serverUrl}project/${f.id ? "update" : "create"}-test-project/`,
          f
        )
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.FormVisible = !1;
            if (!f.id) {
              vm.getProject();
            } else {
              let a = vm.projectItems.find(x => x.id == f.id) || {};
              a.project_name = f.name;
              a.mark = f.mark;
              setTimeout(_ => vm.$message("修改成功"), 2e2);
            }
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    getProject(page) {
      var vm = this,
        serverUrl = vm.serverUrl;
      if (page) {
        vm.pageNum = page;
      }
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取项目信息发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${serverUrl}project/list-projects/`, {
          params: {
            token: vm.token,
            page_idx: vm.pageNum
          }
        })
        .then(res => {
          vm.isloading = !1;
          vm.projectItems = res.data.page_data.map(x => {
            if (!x.id) {
              x.id = x._id;
            }
            x._tv = x.tv = !!x.tv;
            x.tags = x.tags || [];
            if (!x.tags[0]) {
              x.tags[0] = "default";
            }
            x.tv_tags = x.tv_tags || [];
            x._tv_tags = x.tv_tags.slice(0);
            // if (!x.tags[0]) {
            //   x.tags[0] = "默认版本";
            // }
            return x;
          });
          vm.totalPage = res.data.page_total_cnts;
        })
        .catch(onfail);
    }
  },
  created() {
    this.getProject();
    //this.$nextTick(() => bindSort(this.$el));
  }
};
</script>

<style scoped lang=less rel="stylesheet/less">
@import "../../assets/public.less";
.project-manage {
  background-color: #f6f9f9;
  h1 {
    font-size: 2rem;
    margin: 0 1rem 0.6rem 2.5%;
    text-align: left;
  }
  .chk-tv {
    position: absolute;
    right: 0;
    bottom: 0;
    a {
      position: relative;
      padding-left: 32px;
      color: #20a0ff;
    }
  }
  .el-pagination {
    padding-left: 26px;
    margin-bottom: 50px;
  }
  .el-dropdown {
    font-size: 20px;
    margin-top: 5px;
  }
  .tv-link {
    position: absolute;
    width: 28px;
    height: 16px;
    border-radius: 3px;
    color: #1d9d74;
    border: 2px solid currentColor;
  }
  .tv-link:hover {
    color: #d11;
  }
  .tv-link::before {
    position: absolute;
    content: "";
    top: 100%;
    left: 50%;
    margin-left: -1px;
    height: 5px;
    width: 2px;
    background: currentColor;
  }
  .tv-link::after {
    position: absolute;
    content: "";
    top: 100%;
    left: 50%;
    margin-top: 5px;
    margin-left: -7px;
    width: 14px;
    height: 2px;
    background: currentColor;
  }
  .my-table td {
    border-right: 1px solid #dfe6ec;
    text-indent: 20px;
    .cell {
      position: relative;
    }
  }
  .tvDialog {
    .remark-list {
      position: relative;
      width: 90%;
      margin: 20px auto;
    }
    .remark-list::before {
      position: absolute;
      content: "";
      left: -10px;
      width: 2px;
      height: 100%;
      background: #ccc;
    }
    .remark-item {
      position: relative;
      padding: 8px 15px;
      background: #f1f1f1;
      margin: 10px 0 0 10px;
    }
    .remark-item::before {
      position: absolute;
      content: "";
      top: 12px;
      left: -26px;
      width: 14px;
      height: 14px;
      background: #999;
      border-radius: 50%;
      z-index: 19;
    }
    .remark {
      margin: 10px 0 0 0;
    }
    .group-label {
      padding: 4px 6px;
      color: #fff;
    }
  }
  .space {
    display: inline-block;
    width: 30px;
  }
}
</style>





