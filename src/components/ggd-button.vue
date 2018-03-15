<template>
    <button class="ggd-button" :class="[{active:isActive}]"><slot></slot></button>
</template>

<script>
    export default{
        data() {
            return {}
        },
        methods: {},
        props: {
            isActive:{
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped lang=less rel="stylesheet/less">
    @import '../assets/public.less';

    .ggd-button {
        width: 140px;
        height: 40px;
        font-size: 13px;
        font-family: PingFangSC-Light, "Microsoft YaHei", Tahoma, "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
        text-align: center;
        border: 1px solid black;
        color: black;
        border-radius: 5px;
        background-color: transparent;
        cursor: pointer;
        &.active {
            background-color: rgba(22, 155, 213, 1);
            color: white;
            border-radius: 5px;
            border-color: transparent;
        }
    }
</style>
