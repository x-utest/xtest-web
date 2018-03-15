<template>
    <div class="footer">
        CopyRight©2018 版权所有 版本号: 2.5.1

    </div>
</template>
<script>
    export default{
    }
</script>
<style scoped lang=less rel="stylesheet/less">
    @import '../assets/public.less';
    .footer {
        height: @gtt-header;
        line-height: @gtt-header;
        background: linear-gradient(180deg, #545C61 0%, #363E43 100%);
        color: white;
        text-align: center;
        font-size: 14px;
        vertical-align: middle;
        position: fixed;
        width: 100%;
        bottom: 0px;
        &>span {
            margin-left: 3*@ggd-grid-width;
        }
    }
</style>

