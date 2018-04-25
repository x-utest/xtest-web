<template>
    <div id="app" v-loading.body="isloading">
        <div class="container">
            <h2 class="proj-title">
               {{proj_name}} - 测试过程信息 
            </h2>
            <div class="charts-content">
              <h3 class="chart-title">用例增长图</h3>
                <div id="vx-echart1"></div>
                <h3 class="chart-title">Bug消减图</h3>
                <div id="vx-echart2"></div>
        </div>
        </div>
        <div class="rt-side">
          <div class="rss-wrap">
            <div class="rss-p">版本修改备注</div>
            <ul class="rss-list">
                <li v-for="x in rss">
                    <div class="time">
                          <span v-if="g.val==x.group"  v-for="g in rssGroup" 
                          class="group-label" :style="'background:'+g.color">
                           {{g.text}}</span>
                      {{x.date_time}}
                      </div>
                    <div class="title">{{x.content}}</div>
                </li>
             </ul>   
             </div>
             <div class="qr-code">
                  <p>手机扫描查看</p>
              </div></div>
    </div>
</template>
<script>
import { cookie } from "cookie_js";
import filters from "../../filters/filters";
import { queryParser } from "../../assets/utils";
import axios from "axios";
import { apiHost } from "../../config";
import Qrcode from "../../assets/qrcode.js";

var next_proj,
  BeijingTime = filters.BeijingTime;
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
    };
  Max = Math.max.apply(null, Max);
  myChart1.setOption({
    color: ["#5793f3"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      formatter
    },
    toolbox: {
      show: true
    },
    grid: {
      top: 70,
      bottom: 50
    },
    xAxis: {
      type: "category",
      boundaryGap: !1,
      data: ArrayBylen(Total.length).map((v, i) => ++i)
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
      show: true
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
      data: ArrayBylen(Total.length).map((v, i) => ++i)
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
  setTimeout(() => {
    SlideTooltop(myChart1);
    SlideTooltop(myChart2);
  }, 100);
}
function dispatch(el, type, x, y, t) {
  var e = document.createEvent("MouseEvents");
  e.initMouseEvent(
    type,
    !0,
    !0,
    window,
    0,
    x,
    y,
    x,
    y,
    !1,
    !1,
    !1,
    !1,
    0,
    null
  );
  t > 0 ? setTimeout(() => el.dispatchEvent(e), t) : el.dispatchEvent(e);
}
function SlideTooltop(echart) {
  var zr = echart.getZr(),
    el = zr.dom.querySelector("canvas"),
    rect = el.getBoundingClientRect(),
    spots = zr.storage
      .getDisplayList()
      .filter(
        x =>
          x.type == "text" && /^label_\d+/.test(x.anid) && x.transform[1] == 0
      )
      .map(x => x.position),
    wait = 5e3;

  function moveTo(i, s) {
    // if (i < 0) {
    //   //播放下一个项目
    //   setTimeout(() => (location.href = `?inx=${next_proj.inx}`), wait);
    //   return dispatch(el, "mousemove", rect.left, rect.top);
    // }
    if (i >= spots.length) {
      //播放下一个项目
      setTimeout(() => (location.href = `?inx=${next_proj.inx}`), wait);
      return dispatch(el, "mousemove", rect.left, rect.top);
      //return moveTo(i - 1, -1);
    }
    var [x, y] = spots[i];
    dispatch(el, "mousemove", rect.left + x, rect.top + y - 20);
    return setTimeout(moveTo, wait, i + s, s);
  }
  moveTo(0, 1);
}

var qs = queryParser();
/*
  页面有效根据 [id] 展示信息
  没有则根据轮播的顺序 [inx] 展示 , 次序递增，循环结束后重置为0
  否则  从项目列表的第一个开始轮播
*/

export default {
  data() {
    return {
      proj_List: [],
      proj_name: "",
      data: [],
      rss: [],
      id: "",
      isloading: !1,
      token: cookie.get("token"),
      rssGroup: [
        { text: "开发组", val: "dev", color: "#409eff" },
        { text: "测试组", val: "test", color: "#67c23a" }
      ]
    };
  },
  methods: {
    getProjects() {
      var vm = this;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取电视轮播项目信息列表发生错误", "提示", {
          type: "error"
        });
      }
      axios
        .get(`${apiHost}project/list-projects/`, {
          params: {
            token: vm.token,
            page_idx: 1
          }
        })
        .then(res => {
          //vm.isloading = !1;
          vm.proj_List = res.data.page_data.filter(x => x.tv).map(x => {
            if (!x.id) {
              x.id = x._id;
            }
            return x;
          });
          //vm.totalPage = res.data.page_total_cnts;
          vm.getRecord();
        })
        .catch(onfail);
    },
    getRecord() {
      var vm = this,
        { proj_List } = vm,
        { id, inx } = qs;
      if (!proj_List.length) {
        return vm.$alert("没有电视播放的项目列表，请开启项目后再试", "提示", {
          type: "error"
        });
      }
      var useInx;
      if (id) {
        let item = proj_List.find(x => x.id == id);
        if (!item) {
          return vm.$alert("项目id无效,或者未启用电视展示功能", "提示", {
            type: "error"
          });
        }
        vm.proj_name = item.project_name;
        //找到对应下标
        inx = proj_List.indexOf(item);
      } else {
        useInx = 1;
        if (!/^\d+$/.test(inx) || inx < 0 || inx > proj_List.length - 1) {
          inx = 0;
        }
        inx = +inx;
        id = proj_List[inx].id;
        vm.proj_name = proj_List[inx].project_name;
      }
      console.info(` 当前播放项目： ${inx + 1} / ${proj_List.length}`);
      if (inx + 1 >= proj_List.length) {
        inx = -1;
      }
      ++inx;
      next_proj = proj_List[inx];
      next_proj.inx = inx;
      vm.id = id;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取项目信息发生错误", "提示", { type: "error" });
      }
      axios
        .get(`${apiHost}project/read-projects-record/`, {
          params: {
            token: vm.token,
            id,
            page_cap: 30
          }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            vm.data = res.data.data.page_data.reverse();
            renderChart(vm);
            vm.getRss();
            vm.showQrcode();
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    getRss() {
      var vm = this;
      function onfail() {
        vm.$alert("获取RSS信息发生错误", "提示", { type: "error" });
      }
      axios
        .get(`${apiHost}dashboard/get_content/`, {
          params: {
            pro_id: vm.id,
            token: vm.token
          }
        })
        .then(res => {
          if (isOK(res)) {
            vm.rss = res.data.data;
          } else {
            onfail();
          }
        })
        .catch(onfail);
    },
    showQrcode() {
      var vm = this;
      vm.isloading = !0;
      function onfail() {
        vm.isloading = !1;
        vm.$alert("获取二维码分享链接发生错误", "提示", { type: "error" });
      }
      axios
        .get(`${apiHost}share/get-pro-share-link/`, {
          params: {
            token: vm.token,
            project_id: vm.id
          }
        })
        .then(res => {
          vm.isloading = !1;
          if (isOK(res)) {
            var url =
              location.protocol +
              "//" +
              location.host +
              res.data.data.share_url;
            vm.$nextTick(
              () =>
                new Qrcode(vm.$el.querySelector(".qr-code"), {
                  text: url,
                  width: 300,
                  height: 300,
                  correctLevel: Qrcode.CorrectLevel.H
                })
            );
          } else {
            onfail();
          }
        })
        .catch(onfail);
    }
  },
  created() {
    var vm = this;
    if (!vm.token) {
      return vm.$alert("没有登录", "提示", { type: "error" });
    }
    vm.getProjects();
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
#app {
  position: relative;
  height: 100%;
  .container {
    width: calc(~"100% - 360px");
    height: 100%;
  }
  .proj-title {
    margin: 0;
    padding: 20px 30px;
    font-size: 36px;
    color: #20a0ff;
  }
  .charts-content {
    height: calc(~"100% - 100px");
  }
  .chart-title {
    width: 80%;
    margin: 0 auto;
    padding: 10px;
  }
  #vx-echart1 {
    height: calc(~"(100% - 100px)*.4");
    pointer-events: none;
  }
  #vx-echart2 {
    height: calc(~"(100% - 100px)*.6");
    pointer-events: none;
  }
  .rt-side {
    position: absolute;
    top: 0;
    right: 40px;
    width: 320px;
    height: 100%;
    overflow: hidden;
    .rss-wrap {
      height: calc(~"100% - 400px");
      overflow: hidden;
    }
    .rss-p {
      padding: 12px 0;
    }
    .rss-list {
      position: relative;
      margin: 0;
      list-style: none;
      padding-left: 10px;
      &::before {
        position: absolute;
        content: "";
        top: 0;
        left: 10px;
        bottom: 0;
        width: 2px;
        background: #1d9d74;
        z-index: 19;
      }
      li {
        position: relative;
        padding: 8px 16px;
        background-color: #ecf8ff;
        border-radius: 4px;
        margin-bottom: 15px;
        line-height: 1.5em;
        &::before {
          position: absolute;
          content: "";
          top: 10px;
          left: -6px;
          width: 15px;
          height: 15px;
          background: #50bfff;
          border-radius: 50%;
          z-index: 29;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .time {
        font-size: 14px;
        color: #333;
      }
      .title {
        font-size: 16px;
        color: #07a;
      }
    }
    .qr-code {
      width: 300px;
      margin: 20px auto;
    }
  }
  .group-label {
    padding: 2px 5px;
    margin-right: 6px;
    color: #fff;
  }
}
</style>



