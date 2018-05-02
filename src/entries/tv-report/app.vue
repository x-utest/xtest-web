<template>
    <div id="app" v-loading.body="isloading">
            <header class="proj-title">
                 <i class="icon"></i>
                 <i class="split"></i>
                <span class="name">{{proj_name}} 测试过程信息 </span>
            </header>
            <div class="proj-display">
                <section class="proj-chart">
                  <div class="chart-wrap">
                   <div class="chart-title">用例增长图</div>
                <div class="proj-echart" id="vx-echart1"></div>
                <div class="chart-title">
                  Bug消减图
                <div class="legend">
                       <i class="spot" style="background:#F5A623"></i><span>错误次数</span> 
                       <i class="spot" style="background:#FF052C"></i><span>失败次数</span>
                       <i class="spot" style="background:#50E3C2"></i><span>跳过次数</span>
                  </div>
                </div>
                <div class="proj-echart" id="vx-echart2"></div>
                    </div>
                </section>
                <section class="proj-side">
            <ul class="rss-list">
                <li v-for="x in rss">
                    <div class="brand">
                          <span v-if="g.val==x.group"  v-for="g in rssGroup" 
                          class="team" :style="g.style">
                           {{g.text}}</span>
                     <span class="time"> {{x.date_time}}</span>
                      </div>
                    <div class="info">{{x.content}}</div>
                </li>
                <li v-if="rss.length<1" class="empty">
                   :-) 没有任何版本记录
                  </li>
             </ul>   
             <div class="qr-warp">
                  <i class="qr-tip"></i>
                <i class="split"></i>
                <div class="qr-code">
                </div>
             </div>
                </section>
              </div>
    </div>
</template>
<script>
const Page_Rect = [4208, 2516];
var Page_Scale = { x: 1, y: 1 };
function ScalePage() {
  var el = document.querySelector("#app");
  if (!el) {
    return setTimeout(ScalePage, 50);
  }
  Page_Scale.x = innerWidth / Page_Rect[0];
  Page_Scale.y = innerHeight / Page_Rect[1];
  var { x, y } = Page_Scale;
  document.body.overflow = "hidden";
  el.style.transform = `translateZ(0) scaleX(${x}) scaleY(${y})`;
}
onresize = ScalePage;

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
    colors = ["#F5A623", "#FF052C", "#50E3C2"],
    Data = vm.data,
    Total = Data.map(v => +v.total),
    xMarks = Data.map((v, i) => ++i),
    Skipped = Data.map(v => +v.skipped),
    Errors = Data.map(v => +v.errors),
    Filures = Data.map(v => +v.failures),
    formatter = params => {
      var lines = params.filter(x => x.seriesType == "line"),
        i = lines[0].dataIndex,
        data = Data[i] || {};
      return `<div class="echart-tip"><div class="br">${i + 1}</div>
    <div class="br">版本信息 : ${data.pro_version} </div>
    <div class="br">创建时间 : ${BeijingTime(data.rc_time)} </div>
    ${lines
      .map(
        x =>
          `<div class="br"><i class="spot" style="background:${x.color}"></i>${
            x.seriesName
          } : ${x.value}</div>`
      )
      .join("")}</div`;
    };
  function toMax(x) {
    var n = x.max,
      a = 10,
      s = n % a;
    return n + a + (s == 0 ? 0 : a - s);
  }
  function getOpt() {
    return {
      tooltip: {
        trigger: "axis",
        formatter
      },
      toolbox: {
        show: !1
      },
      grid: {
        left: "45px",
        right: "78px",
        top: "80px",
        bottom: "50px",
        containLabel: true
      }
    };
  }
  getOpt.axis = function(show) {
    return {
      nameTextStyle: {
        color: "#fff",
        fontSize: 32
      },
      // x轴的字体样式
      axisLabel: {
        show: true,
        margin: 30,
        textStyle: {
          color: "#fff",
          fontSize: 32
        }
      },
      // 控制网格线是否显示
      splitLine: {
        show: show,
        lineStyle: {
          color: "#666",
          width: 1,
          type: "solid"
        }
      },
      // xy轴的颜色和宽度
      axisLine: {
        show: !show,
        lineStyle: {
          color: "#D8DDDE",
          width: 2 //这里是坐标轴的宽度,可以去掉
        }
      }
    };
  };
  getOpt.series = function(color, grad) {
    return {
      type: "line",
      smooth: true,
      symbol: "emptyCircle", //拐点图例
      symbolSize: 38, //拐点大小
      // label: {
      //   normal: {
      //     show: true,
      //     position: "top",
      //     textStyle: {
      //       //color: "#fff",
      //       fontSize: 32
      //     }
      //   }
      // },
      itemStyle: {
        show: !0,
        normal: {
          lineStyle: {
            width: 10,
            color,
            shadowColor: "rgba(0,0,0,0.4)"
          }
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, grad)
        }
      }
    };
  };
  myChart1.setOption({
    ...getOpt(),
    color: ["#5793f3"],
    xAxis: {
      ...getOpt.axis(!1),
      type: "category",
      boundaryGap: !1,
      data: xMarks,
      splitArea: {
        show: !0,
        areaStyle: {
          color: ["rgba(0,0,0,0)", "rgba(255,255,255,.05)"]
        }
      }
    },
    yAxis: {
      type: "value",
      ...getOpt.axis(!0),
      name: "次数（次）",
      max: toMax
    },
    series: [
      {
        ...getOpt.series("#347EFF", [
          {
            offset: 0,
            color: "rgba(68,136,255,0.40)"
          },
          {
            offset: 1,
            color: "rgba(68,136,255,0)"
          }
        ]),
        name: "总次数",
        data: Total
      }
    ]
  });
  myChart2.setOption({
    ...getOpt(),
    color: colors,
    // legend: {
    //   data: ["错误次数", "失败次数", "跳过次数"]
    // },
    xAxis: {
      ...getOpt.axis(!1),
      type: "category",
      boundaryGap: !1,
      data: xMarks,
      splitArea: {
        show: !0,
        areaStyle: {
          color: ["rgba(0,0,0,0)", "rgba(255,255,255,.05)"]
        }
      }
    },
    yAxis: {
      ...getOpt.axis(!0),
      type: "value",
      name: "次数（次）",
      max: toMax
    },
    series: [
      {
        ...getOpt.series(colors[0], [
          {
            offset: 0.02,
            color: "rgba(245,166,35,0.52)"
          },
          {
            offset: 0.98,
            color: "rgba(245,128,35,0.00)"
          }
        ]),
        name: "错误次数",
        data: Errors
      },
      {
        ...getOpt.series(colors[1], [
          {
            offset: 0,
            color: "rgba(255,68,68,0.40)"
          },
          {
            offset: 1,
            color: "rgba(255,68,68,0.00)"
          }
        ]),
        name: "失败次数",
        data: Filures
      },
      {
        ...getOpt.series(colors[2], [
          {
            offset: 0.02,
            color: "rgba(68,136,255,0.40)"
          },
          {
            offset: 0.98,
            color: "rgba(68,136,255,0.00)"
          }
        ]),
        name: "跳过次数",
        data: Skipped
      }
    ]
  });
  setTimeout(() => {
    SlideTooltop(myChart1);
    SlideTooltop(myChart2);
  }, 5e3);
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
      .map(x => [x.position[0] * Page_Scale.x, x.position[1] * Page_Scale.y]),
    wait = 5e3;
  function moveTo(i, s) {
    if (spots.length < 1 || i >= spots.length) {
      //播放下一个项目
      setTimeout(() => (location.href = `?inx=${next_proj.inx}`), wait);
      dispatch(el, "mousemove", rect.left, rect.top);
      //return moveTo(i - 1, -1);
    }
    var [x, y] = spots[i];
    dispatch(
      el,
      "mousemove",
      rect.left + x + (i < 1 ? 5 : 0),
      rect.top + y - 20
    );
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
        {
          text: "开发组",
          val: "dev",
          style: {
            background: "linear-gradient(270deg, #FCF53C 0%, #F8E71C 100%)",
            color: "#7B7200"
          }
        },
        {
          text: "测试组",
          val: "test",
          style: { background: "#7ED321", color: "#3A6C00" }
        }
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
                  width: 520,
                  height: 520,
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
  },
  mounted() {
    this.$nextTick(ScalePage);
  }
};
</script>
<style   lang=less rel="stylesheet/less">
#app {
  width: 4208px;
  height: 2516px;
  transform-origin: top left;
  display: flex;
  flex-direction: column;
  background: #242429;
  color: #fff;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft Yahei", "微软雅黑", "arial", "宋体",
    "sans-serif";
  .proj-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 220px;
    background: linear-gradient(180deg, #34343b 0%, #242429 100%);
    box-shadow: 0 2px 4px 0 rgba(255, 255, 255, 0.26),
      0 18px 40px 0 rgba(0, 0, 0, 0.4);
    .icon {
      height: 110px;
      width: 110px;
      font-size: 50px;
      background: url(../../assets/img/logo.png) no-repeat center;
    }
    .split {
      margin: 0 47.5px;
      height: 109px;
      width: 4px;
      opacity: 0.3;
      background-color: #fff;
    }
    .name {
      height: 126px;
      font-size: 90px;
      font-weight: 500;
      line-height: 126px;
      text-transform: uppercase;
    }
  }
  .proj-display {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .proj-chart {
    flex: 1;
  }
  .chart-wrap {
    width: 2672px;
    margin: 0 auto;
    padding-top: 102px;
  }
  .chart-title {
    position: relative;
    line-height: 84px;
    height: 84px;
    opacity: 0.7;
    font-size: 60px;
    .legend {
      display: flex;
      align-items: center;
      position: absolute;
      top: 9px;
      right: 0;
      height: 67px;
      font-size: 48px;
      line-height: 67px;
    }
    .spot {
      height: 40px;
      width: 40px;
      margin: 0 16px 0 52px;
      border-radius: 50%;
    }
  }
  .proj-echart {
    position: relative;
    height: 843px;
    margin: 48px 0 127px;
    pointer-events: none;
    &::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.3;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.2) 100%
      );
      box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.4);
    }
    > div:last-child {
      border-radius: 14px !important;
      padding: 0 !important;
    }
  }
  .echart-tip {
    padding: 30px 24px 30px 40px;
    line-height: 50px;
    font-size: 36px;
    font-weight: 500;
    border-radius: 14px;
    background-color: rgba(0, 0, 0, 0.3);
    .br {
      margin: 8px 0;
    }
    .spot {
      display: inline-block;
      margin-right: 17px;
      width: 33px;
      height: 33px;
      border-radius: 50%;
    }
  }
  .proj-side {
    display: flex;
    flex-direction: column;
    width: 1202px;
  }
  .rss-list {
    margin: 0;
    padding: 112px 50px 0 50px;
    flex: 1;
    list-style: none;
    /* height: calc(~"100% - 400px"); */
    overflow: hidden;
    li {
      border-top: 2px solid #ccc;
      &:first-child {
        border-top: none;
      }
      &:first-of-type {
        .brand {
          padding-top: 0;
        }
      }
    }
    .empty {
      padding: 28px 0 36px 0;
      font-size: 52.8px;
      font-weight: 500;
      line-height: 74px;
      opacity: 0.7;
    }
    .brand {
      padding-top: 54px;
    }

    .team {
      display: inline-block;
      margin-right: 40px;
      height: 77.44px;
      width: 166.5px;
      border-radius: 11.44px;
      font-size: 44px;
      font-weight: 600;
      line-height: 77px;
      text-align: center;
    }
    .time {
      height: 77.44px;
      width: 475px;
      opacity: 0.7;
      font-size: 49.28px;
      line-height: 77px;
    }
    .info {
      padding: 28px 0 36px 0;
      font-size: 52.8px;
      font-weight: 500;
      line-height: 74px;
    }
  }
  .qr-warp {
    height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    .split {
      position: relative;
      margin: 0 42.5px;
      height: 20px;
      width: 106px;
      &::before {
        position: absolute;
        content: "";
        width: 20px;
        height: 100%;
        background: #919194;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        border-radius: 50%;
        box-shadow: 43px 0 0 0 #919194, 86px 0 0 0 #919194;
      }
    }
  }
  .qr-tip {
    height: 305px;
    width: 305px;
    border: 4.5px solid #fff;
    opacity: 0.5;
    border-radius: 50%;
    background: url(../../assets/img/scan_qr.png) no-repeat center;
  }
  .qr-code {
    width: 520px;
    height: 520px;
    padding: 30px;
    background: #fff;
    border-radius: 16px;
  }
}
</style>



