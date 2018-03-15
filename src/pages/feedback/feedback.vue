<template>
  <div class="feedback" v-loading.body="isloading">
    <el-input
    class="txt-msg"
    type="textarea"
    :rows="10"
    placeholder="请输入反馈内容"
    v-model="msg">
    </el-input>

    <div class="bk-row">
      <el-button type="primary" v-on:click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
    function isOK(rsp) {
        var a=rsp.data;
        return a&&a.code==200
    }
    import {mapState,mapMutations,mapActions} from 'vuex'
  export default{
      data() {
          return {
              msg: '',
              isloading: !1
          }
      },
      computed: {
          ...mapState(['serverUrl', 'token', 'loginUser'])
      },
      methods: {
          submit(){
              var vm = this,
                  _ = {
                      token: vm.token,
                      msg: vm.msg
                  };

              function onfail() {
                  vm.isloading = !1;
                  vm.$alert('提交反馈发生错误', '提示', {type: 'error'})
              }

              if (!_.msg || _.msg.replace(/\s+/g, '').length < 1) {
                  return vm.$alert('请填写有效的反馈信息','提示',{type:'info'})
              }
              vm.isloading = !0;
              vm.$http.post(`${vm.serverUrl}feedback/`, _).then(res => {
                  vm.isloading = !1;
                  if (isOK(res)) {
                      vm.$alert('提交成功','提示',{type:'success'})
                  }
                  else {
                      onfail()
                  }
              }).catch(onfail)
          }
      }
  }
</script>

<style scoped lang=less rel="stylesheet/less">
  .feedback{
  width:60%;
  margin:20px 100px;
  
  .bk-row{
  overflow:hidden;
  button{margin:20px 0;float:right}
  }
  }
</style>





