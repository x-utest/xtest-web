<template>
    <div class="footer">
        {{version}}

    </div>
</template>
<script>
import { version } from "../sysConfig/page";
export default {
  data() {
    return { version };
  }
};
</script>
<style scoped lang=less rel="stylesheet/less">
@import "../assets/public.less";
.footer {
  height: @gtt-header;
  line-height: @gtt-header;
  background: linear-gradient(180deg, #545c61 0%, #363e43 100%);
  color: white;
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
  position: fixed;
  width: 100%;
  bottom: 0px;
  & > span {
    margin-left: 3*@ggd-grid-width;
  }
}
</style>

