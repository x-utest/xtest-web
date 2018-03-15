<template>
    <button class="ggd-tab" :class="[{active:isActive},size]">
        <slot></slot>
    </button>
</template>

<script>
    export default{
        data() {
            return {}
        },
        methods: {},
        props: {
            isActive: {
                type: Boolean,
                default: false
            },
            size: {
                type: Boolean,
                default: 'S'
            }
        }
    }
</script>

<style scoped lang=less   rel="stylesheet/less">
    @import '../assets/public.less';

    .ggd-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border: none;
        color: #3D454A;
        border-radius: 2px;
        cursor: pointer;
        background-color: #E4E9EA;
        &.S {
            height: 32px;
            width: 80px;
            &.active {
                color: #FFFFFF;
                background: linear-gradient(151.93deg, #778288 0%, #4E575D 100%);
            }
        }
        &.M {
            height: 32px;
            width: 96px;
            &.active {
                color: #FFFFFF;
                background: linear-gradient(151.93deg, #778288 0%, #4E575D 100%);
            }
        }

        &.L {
            font-size: 14px;
            height: 48px;
            width: 192px;
            &.active {
                color: #FFFFFF;
                background: linear-gradient(20.08deg, #779BFD 0%, #4764F5 100%);
            }
        }
    }


</style>
