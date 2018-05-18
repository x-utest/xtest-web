<template>
    <div class="test-report">
        <div class="container">
            <div class="ele-nav">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/decision' }">判定测试</el-breadcrumb-item>
                    <el-breadcrumb-item>详细信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div style="margin: 5px 0">
                <el-button size="small" type="primary" v-show="!isShare" @click="doShare" style="margin:0 30px;">生成分享链接</el-button>
                <span v-if="isShare">
                    <i class="share-url" v-html="shareUrl"></i>
                    <el-button type="info" size="small" style="margin:0 20px;" @click="doCopy">复制</el-button>
                    <a :href="shareUrl" target="_blank">直接访问</a>
                </span>
            </div>
            <div id="ng-echart"></div>
            <table class="ulSidebar">
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td>{{details._id}}</td>
                    </tr>
                    <tr>
                        <td>测试日期</td>
                        <td>{{details.rc_time |BeijingTime}}</td>
                    </tr>
                    <tr>
                        <td>项目代号</td>
                        <td>{{details.pro_name}}</td>
                    </tr>
                    <tr>
                        <td>服务器版本号</td>
                        <td>{{details.pro_version}}</td>
                    </tr>
                    <tr>
                        <td>用例总数</td>
                        <td>{{details.total}}</td>
                    </tr>
                    <tr>
                        <td>失败个数</td>
                        <td>{{details.failures}}</td>
                    </tr>
                    <tr>
                        <td>错误个数</td>
                        <td>{{details.errors}}</td>
                    </tr>
                    <tr>
                        <td>跳过个数</td>
                        <td>{{details.skipped}}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr class="tableHead">
                        <td style="text-align:center;width:50px"> # </td>
                        <td>测试脚本</td>
                        <td>状态</td>
                        <td>详情说明</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in details.details">
                        <td style="text-align:center;">{{index+1}}</td>
                        <td class="td-detail">{{item.test_case}}</td>
                        <td>
                            <img width="24px" height="25px" :src="item.status =='failures'?failures :errors" :title="item.status">
                        </td>
                        <td class="td-detail">{{item.explain}}</td>
                        <td>
                            <el-button type="text" @click="showNote(item)">更多</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <el-dialog :visible.sync="popInfo.show" size="small">
            <b slot="title">{{popInfo.case}} 详情说明</b>
            <textarea class="txt-desc" readonly :value="popInfo.note"></textarea>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="popInfo.show = !1">确 定</el-button>
            </span>
        </el-dialog>
    
    </div>
</template>

<script>
function isOK(res) {
  return res.data && res.data.code == 200;
}
import { mapState } from "vuex";
import failures from "../../assets/img/failures.png";
import errors from "../../assets/img/errors.png";
import { Copy } from "../../assets/utils";

export default {
  data() {
    return {
      shareUrl: "",
      isShare: !1,
      id: "",
      errorMessage: "",
      details: {},
      failures: failures,
      errors: errors,
      popInfo: { show: false, case: "", note: "" }
    };
  },
  methods: {
    doCopy() {
      var vm = this;
      if (Copy(vm.shareUrl)) {
        return vm.$message("复制成功");
      }
      vm.$alert("复制失败，请自行复制", "提示", { type: "error" });
    },
    getData() {
      var vm = this;
      vm.$http
        .get(`${vm.serverUrl}testdata/get-one-test-data/`, {
          params: {
            id: vm.id,
            token: vm.token
          }
        })
        .then(
          res => {
            vm.details = res.data.data;
            var echarts = require("echarts");
            var myChart = echarts.init(document.getElementById("ng-echart"));
            myChart.setOption({
              title: {
                text: "最新执行结果统计",
                //subtext: '副标题',
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                left: "left",
                data: ["失败个数", "错误个数", "成功个数", "跳过个数"]
              },
              toolbox: {
                show: true,
                itemSize: 20,
                feature: {
                  dataZoom: {
                    show: false
                  },
                  dataView: { show: false },
                  magicType: { show: false },
                  restore: { show: false },
                  saveAsImage: {}
                }
              },
              series: [
                {
                  name: "测试结果",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "60%"],
                  data: [
                    { value: vm.details.failures, name: "失败个数" },
                    {
                      value: vm.details.errors,
                      name: "错误个数",
                      itemStyle: {
                        normal: {
                          color: "#D48265"
                        }
                      }
                    },
                    {
                      value:
                        vm.details.total -
                        (vm.details.failures +
                          vm.details.errors +
                          vm.details.skipped),
                      name: "成功个数",
                      itemStyle: {
                        normal: {
                          color: "#54BECC"
                        }
                      }
                    },
                    { value: vm.details.skipped, name: "跳过个数" }
                  ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            });
          },
          error => {
            this.errorMessage = error;
          }
        );
    },
    doShare() {
      var vm = this;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("生成分享链接发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${this.serverUrl}share/get-utest-share-link/`, {
          params: {
            token: vm.token,
            rep_id: vm.id
          }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.isShare = !0;
            vm.shareUrl =
              location.protocol +
              "//" +
              location.host +
              res.data.data.share_url;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    showNote(item) {
      this.popInfo = { show: true, case: item.test_case, note: item.note };
    }
  },
  computed: {
    ...mapState(["serverUrl", "token"])
  },
  created() {
    var vm = this,
      id = vm.$route.query.id;
    if (!(vm.id = id)) {
      return vm.$alert("页面发生错误,请刷新，或回到[ 判定测试 ]查看", {
        type: "warn"
      });
    }
    this.getData();
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
.test-report {
  .container {
    min-height: 89vh;
    .ele-nav {
      margin: 20px 30px;
      span {
        font-size: 18px;
      }
    }
  }
  #ng-echart {
    width: 450px;
    height: 350px;
    float: left;
    margin-left: 20%;
  }
  h1 {
    display: block;
    font-size: 2rem;
    margin: 0 auto 0.6rem auto;
    width: 95%;
    text-align: left;
  }
  table {
    margin: 0 auto 50px;
    width: 95%;
    border-collapse: collapse;
    .pageName {
      font-size: 0.5rem;
    }
    .tableHead {
      border-bottom: 2px solid black;
      text-align: left;
    }
    tr:nth-child(odd) {
      background-color: #f5f5f5;
    }
    tr:nth-child(even) {
      background-color: #fff;
    }
    td {
      height: 2rem;
    }
    tbody {
      tr:hover {
        background-color: #e6e6e6;
      }
      td {
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
        cursor: pointer;
        padding: 2px 5px;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
      }
      .td-detail {
        text-align: left;
      }
    }
  }
  table.ulSidebar {
    width: 30%;
    float: left;
    margin-left: 60px;
    td {
      height: 2.5rem;
    }
  }
  .share-url {
    margin: 0 30px;
  }
  .txt-desc {
    display: block;
    width: 90%;
    margin: 10px auto;
    min-height: 320px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    outline: none;
    resize: none;
  }
}
</style>






