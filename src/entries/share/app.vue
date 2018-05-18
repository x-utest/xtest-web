<template>
    <div id="app">
        <div class="header">
        </div>
        <div class="container">
            <h1>判定测试详细信息
    <el-popover title="手机扫描二维码访问当前分享页面" ref="QRpopover"  placement="bottom"  trigger="click">
   <div id="urlQrcode" draggable="false" style="padding:10px;"></div>
</el-popover>
  <el-button class="btn-share" type="info" size="large" icon="share" v-popover:QRpopover @click="shareQrcode">手机二维码访问</el-button>
            </h1>
            <div class="main">
                <table class="tb1">
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td>{{details._id}}</td>
                        </tr>
                        <tr>
                            <td>项目代号</td>
                            <td>{{details.pro_name}}</td>
                        </tr>
                        <tr>
                            <td>版本号</td>
                            <td>{{details.pro_version}}</td>
                        </tr>
                        <tr>
                            <td>测试日期</td>
                            <td>{{details.rc_time|BeijingTime}}</td>
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
                <div id="ng-echart"></div>
            </div>
            <table class="tb2">
                <thead>
                    <tr>
                        <td style="width:50px"> # </td>
                        <td>测试脚本</td>
                        <td>状态</td>
                        <td>详情说明</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in details.details">
                        <td>{{index+1}}</td>
                        <td class="td-detail">{{item.test_case}}</td>
                        <td>
                            <img width="24px" height="25px" :src="item.status =='failures'?failuresImg :errorsImg" :title="item.status">
                        </td>
                        <td class="td-detail">{{item.explain}}</td>
                        <td>
                            <span class="sp_more" @click="showNote(item)">更多</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ul class="tb3">
                <li v-for="(item,index) in details.details">
                    <i>{{index+1}}</i>
                    <h5>{{item.test_case}}</h5>
                    <div class="info">
                        <div class="exp">{{item.explain}}</div>
                        <div class="bar" @click="item.show=!item.show">
                            <img :src="item.status =='failures'?failuresImg :errorsImg" :title="item.status">
                            <span class="more">{{item.show?'折叠':'更多'}}</span>
                        </div>
                    </div>
                    <p class="note" v-show="item.show">{{item.note}}</p>
                </li>
            </ul>
        </div>
        <el-dialog :visible.sync="popInfo.show" size="small">
            <b slot="title">{{popInfo.case}} 详情说明</b>
            <textarea class="txt-desc" readonly :value="popInfo.note"></textarea>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="popInfo.show = !1">确 定</el-button>
            </span>
        </el-dialog>   
        <div class="footer">
            {{version}}
        </div>
 </div></template>
<script>
import axios from "axios";
import gttHeader from "../../components/header.vue";
import gttFooter from "../../components/footer.vue";
import failuresImg from "../../assets/img/failures.png";
import errorsImg from "../../assets/img/errors.png";
import Qrcode from "../../assets/qrcode.js";
import { queryParser } from "../../assets/utils";
import { mapState } from "vuex";
import { apiHost as serverUrl } from "../../config";
import pageConfig from "../../sysConfig/page";

var qs = queryParser();
export default {
  data() {
    return {
      stoken: "",
      details: {},
      failuresImg: failuresImg,
      errorsImg: errorsImg,
      popInfo: { show: false, case: "", note: "" },
      version: pageConfig.version
    };
  },
  methods: {
    shareQrcode() {
      var el = document.getElementById("urlQrcode");
      !el.querySelector("img") &&
        new Qrcode(el, {
          text: location.href,
          width: 260,
          height: 260,
          correctLevel: Qrcode.CorrectLevel.H
        });
    },
    getData() {
      var vm = this,
        stoken = this.stoken;
      function onfail(e) {
        e = !!e;
        vm.$alert(
          e ? "获取信息发生错误，请点击确定再次尝试" : "页面地址无效",
          "提示",
          { type: e ? "info" : "error" }
        );
        // .then(_ => e && vm.getData());
      }
      axios
        .get(`${serverUrl}share/get-utest-share-data/`, {
          params: { stoken }
        })
        .then(res => {
          if (res.data.code != 200) {
            return onfail();
          }
          var ds = res.data.data;
          ds.details.map(x => (x.show = !1));
          vm.details = ds;
          var echarts = require("echarts");
          return;
          vm.$nextTick(() => {
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
                    { value: ds.failures, name: "失败个数" },
                    {
                      value: ds.errors,
                      name: "错误个数",
                      itemStyle: {
                        normal: {
                          color: "#D48265"
                        }
                      }
                    },
                    {
                      value: ds.total - (ds.failures + ds.errors + ds.skipped),
                      name: "成功个数",
                      itemStyle: {
                        normal: {
                          color: "#54BECC"
                        }
                      }
                    },
                    { value: ds.skipped, name: "跳过个数" }
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
          });
        })
        .catch(onfail);
    },
    showNote(item) {
      this.popInfo = { show: true, case: item.test_case, note: item.note };
    }
  },
  components: {
    gttHeader,
    gttFooter
  },
  created() {
    var vm = this;
    vm.stoken = qs.stoken;
    if (!vm.stoken) {
      return vm.$alert("页面地址无效", "提示", { type: "error" });
    }
    vm.getData();
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
  @media only screen and (max-width: 920px) {
    .main {
      margin: 0 !important;
      width: 100% !important;
    }
    #ng-echart,
    .tb1 {
      float: none !important;
      width: 90% !important;
      margin: 20px auto !important;
    }
    .tb1 tbody tr td:first-child {
      width: 40%;
    }
    .btn-share,
    .tb2 {
      display: none;
    }
    .tb3 {
      display: block !important;
      width: 90%;
      padding: 0;
      margin: 20px auto 80px;
      list-style: none;
      li {
        position: relative;
        border: 1px solid #ddd;
        border-top-width: 0;
        &:first-child {
          border-top-width: 1px;
        }
        i {
          position: absolute;
          top: 0;
          left: 0;
          width: 36px;
          line-height: 36px;
          background: #e8e8e8;
          font-weight: bold;
          text-align: center;
          border-right: 1px solid #ddd;
          font-style: normal;
        }
        h5 {
          text-indent: 50px;
          line-height: 36px;
          font-size: 18px;
          margin: 0;
          color: #333;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }
        .info {
          position: relative;
          padding: 20px 80px 20px 10px;
          .exp {
            word-break: break-all;
            min-height: 40px;
          }
          .bar {
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            min-height: 60px;
            background: #ddd;
            background: #ddd;
            img {
              display: block;
              width: 32px;
              height: 32px;
              margin: 4px auto;
            }
            .more {
              display: block;
              line-height: 40px;
              color: #fff;
              text-align: center;
              background: #20a0ff;
            }
          }
        }
        .note {
          margin: -1px 0 0;
          padding: 16px 10px;
          word-break: break-all;
          color: #888;
          border-top: 1px dashed #ccc;
          font-size: 14px;
          white-space: pre-line;
        }
      }
    }
  }
  .container {
    min-height: 89vh;
  }

  h1 {
    display: block;
    padding-top: 45px;
    font-size: 2rem;
    margin: 0 auto 0.6rem auto;
    width: 90%;
    text-align: left;
  }
  .btn-share {
    float: right;
    margin-right: 80px;
  }
  table {
    margin: 0 auto 50px;
    width: 95%;
    border-collapse: collapse;
    .pageName {
      font-size: 0.5rem;
    }
    .tb2 thead tr {
      border-bottom: 2px solid black;
    }
    tr:nth-child(odd) {
      background-color: #f5f5f5;
    }
    tr:nth-child(even) {
      background-color: #fff;
    }
    td {
      height: 2rem;
      text-align: center;
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
    }
  }
  .main {
    width: 1000px;
    margin: 20px auto 0;
    overflow: hidden;
  }
  #ng-echart {
    width: 450px;
    height: 350px;
    float: left;
    margin-left: 10px;
  }
  .tb1 {
    width: 420px;
    float: right;
    margin-right: 10px;
    td {
      height: 2.5rem;
    }
  }
  .tb2 thead {
    border-bottom: 2px solid #000;
  }
  .tb3 {
    display: none;
  }
  .sp_more {
    color: #20a0ff;
    padding: 10px 0;
    font-size: 14px;
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
  .footer {
    height: 40px;
    line-height: 40px;
    background: linear-gradient(180deg, #545c61 0%, #363e43 100%);
    color: white;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    position: fixed;
    width: 100%;
    bottom: 0px;
    span {
      float: right;
      font-size: 12px;
      margin-right: 10px;
      color: rgba(86, 123, 146, 0.69);
    }
  }
}
</style>






