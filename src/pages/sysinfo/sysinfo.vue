<template>
  <div class="sysinfo-main" v-loading.body="isloading">

  <table class="table-sysinfo">
    <caption>系统信息</caption>
    <tbody v-if="!isloading">
      <tr>
        <td>当前时间</td>
        <td>{{data.req_time}}</td>
      </tr>
      <tr>
        <td>server</td>
        <td>{{data.server}}</td>
      </tr>
      <tr>
        <td>app_version</td>
        <td>{{data.app_version}}</td>
      </tr>
      <tr>
        <td>dtlib_version</td>
        <td>{{data.dtlib_version}}</td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
    import {mapState,mapMutations,mapActions} from 'vuex'
    import filters from '../../filters/filters'
    var BeijingTime=filters.BeijingTime;
    function isOK(rsp) {
        var a=rsp.data;
        return a&&a.code==200
    }

  export default{
      data() {
          return {
              isloading:!0,
              data: {}
            /*
  server: "tornado",
  req_time: "2018-01-11 14:53:15",
  app_version: "3.17.5.16.1",
  dtlib_version: "3.17.5.16.1"
  */
  }
  },
      computed: {
          ...mapState(['serverUrl', 'token', 'loginUser'])
      },

      methods: {
          getSysInfo(){
              var vm = this;

              function onfail() {
                  vm.isloading = !1;
                  vm.$alert('获取系统信息发生错误', '提示', {type: 'error'})
              }

              vm.$http.get(
                  `${vm.serverUrl}app-info/`, {
                      params: {token: vm.token}
                  }).then(res => {
                  vm.isloading = !1;
                  if (isOK(res)) {
                      vm.data = res.data.data
                  } else {
                      onfail()
                  }
              }).catch(onfail);
          }},
      created()
      {
          this.getSysInfo();
      }
    }
</script>
<style scoped lang=less rel="stylesheet/less">
.table-sysinfo{
  margin: 1rem auto;
  width: 80%;
  border-collapse: collapse;
  caption{
  display: block;
  font-size: 2rem;
  margin: 1rem auto .6rem auto;
  width: 95%;
  text-align: left;
  }
  tbody{
  tr{background-color: #fff;}
  tr:hover{background-color: #e6e6e6;}
  tr:nth-child(odd){background-color: #f5f5f5;}
  td{   height: 2rem; border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  text-align: center;
  padding:8px;
  padding-left: 2rem;}
  tr td:last-child{text-align:left}
  }
  }
</style>





