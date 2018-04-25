<template>
    <div id="app" v-loading.body="isloading">
        <div class="container">
            <div class="ele-nav">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/project-manage' }">项目管理</el-breadcrumb-item>
                    <el-breadcrumb-item>{{proj_name}}详细信息</el-breadcrumb-item>
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
            <div>
                <h3 class="chartH">用例增长图</h3>
                <div id="vx-echart1"></div>
                <h3 class="chartH">Bug消减图</h3>
                <div id="vx-echart2"></div>
            </div>
        </div>
    </div>
</template>
<script>
import filters from "../../filters/filters";
import { selectElem, queryParser } from "../../assets/utils";

var BeijingTime = filters.BeijingTime;
function isOK(res) {
  return res.data && res.data.code == 200;
}
var echarts = require("echarts");
function renderChart(vm) {
  var myChart1 = echarts.init(document.getElementById("vx-echart1")),
    myChart2 = echarts.init(document.getElementById("vx-echart2")),
    colors = ["#f00", "#d14a61", "#ac5"],
    Data = vm.data,
    Total = Data.map(v => v.total),
    Skipped = Data.map(v => v.skipped),
    Errors = Data.map(v => v.errors),
    Filures = Data.map(v => v.failures),
    Max = [Skipped, Errors, Filures].map(arr => Math.max.apply(null, arr)),
    ArrayBylen = l => [].join.call({ length: ++l }).split(""),
    formatter = params => {
      var i = params[0].dataIndex,
        data = Data[i] || {};
      return `${i + 1}<br>
                            版本信息 : ${data.pro_version} <br>
                            创建时间 : ${BeijingTime(data.rc_time)} <br>
    ${params
      .map(
        x =>
          `<i style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
            x.color
          }"></i>${x.seriesName} : ${x.value}<br>`
      )
      .join("")}
                      `;
    },
    onclick = e => open("/#/test-report?id=" + Data[e.dataIndex]._id);
  Max = Math.max.apply(null, Max);
  myChart1.setOption({
    color: ["#5793f3"],
    // title: {
    //     text: '用例增长图'
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      formatter
    },
    toolbox: {
      show: true,
      feature: { saveAsImage: {} }
    },
    grid: {
      top: 70,
      bottom: 50
    },
    xAxis: {
      type: "category",
      boundaryGap: !1,
      data: ArrayBylen(30).map((v, i) => ++i)
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "总次数",
        type: "line",
        smooth: true,
        data: Total
      }
    ]
  });
  myChart2.setOption({
    color: colors,
    // title: {
    //     text: 'Bug消减图'
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      formatter
    },
    toolbox: {
      show: true,
      feature: { saveAsImage: {} }
    },
    legend: {
      data: ["错误次数", "失败次数", "跳过次数"]
    },
    grid: {
      top: 70,
      bottom: 50
    },
    xAxis: {
      type: "category",
      boundaryGap: !1,
      data: ArrayBylen(30).map((v, i) => ++i)
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "错误次数",
        type: "line",
        smooth: true,
        data: Errors
      },
      {
        name: "失败次数",
        type: "line",
        smooth: true,
        data: Filures
      },
      {
        name: "跳过次数",
        type: "line",
        smooth: true,
        data: Skipped
      }
    ]
  });
  myChart1.on("click", onclick);
  myChart2.on("click", onclick);
  Object.assign(window, { myChart1, myChart2 });
}
import { mapState } from "vuex";
var qs = queryParser();

export default {
  data() {
    return {
      shareUrl: "",
      isShare: !1,
      id: "",
      proj_name: "",
      data: [],
      isloading: !0
    };
  },
  computed: {
    ...mapState(["serverUrl", "token"])
  },
  methods: {
    doCopy() {
      var vm = this;
      if (selectElem(vm.$el.querySelector(".share-url"), 1)) {
        return vm.$message("复制成功");
      }
      vm.$alert("复制失败，请自行复制", "提示", { type: "error" });
    },
    getRecord() {
      var vm = this;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取项目成长信息发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${this.serverUrl}project/read-projects-record/`, {
          params: {
            token: vm.token,
            id: vm.id,
            page_cap: 30
          }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = res.data.data.page_data.reverse();
            vm.proj_name = (vm.data[0] || {}).pro_name;
            renderChart(vm);
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    doShare() {
      var vm = this;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("生成分享链接发生错误", "提示", { type: "error" });
      }
      vm.$http
        .get(`${this.serverUrl}share/get-pro-share-link/`, {
          params: {
            token: vm.token,
            project_id: vm.id
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
    }
  },
  created() {
    var vm = this,
      id = vm.$route.query.id;
    if (!(vm.id = id)) {
      return vm.$alert("页面发生错误,请刷新，或回到[ 项目管理页面 ]查看", {
        type: "warn"
      });
    }
    vm.getRecord();
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
#app {
  .header {
    height: 40px;
    line-height: 40px;
    background: linear-gradient(180deg, #545c61 0%, #363e43 100%);
    position: fixed;
    width: 100%;
    z-index: 9999999;
    display: flex;
    justify-content: space-between;
  }
  .chartH {
    width: 80%;
    margin: 0 auto;
  }
  .container {
    min-height: 89vh;
    .ele-nav {
      margin: 20px 30px;
      span {
        font-size: 18px;
      }
    }
  }
  .share-url {
    margin: 0 30px;
  }
  #vx-echart1 {
    width: 80%;
    height: 320px;
    margin: 30px auto;
  }
  #vx-echart2 {
    width: 80%;
    height: 360px;
    margin: 40px auto;
  }
  h1 {
    display: block;
    font-size: 2rem;
    margin: 0.6rem auto;
    width: 95%;
    text-align: left;
  }
}
</style>



