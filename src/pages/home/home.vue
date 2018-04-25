<template>
    <div class="home">
            <a class="help-link" href="http://xtest.readthedocs.io" target="_blank">使用说明</a>
    </div>
</template>

<script>
 export default{
        data() {
            return {}
        },
        computed: {},
        methods: {},
        props: {},
        watch: {},
        created() {
        },
        mounted(){
        },
        components: {}
    }

</script>

<style scoped lang=less rel="stylesheet/less">
    @import '../../assets/public.less';
    .home {
        position: relative;
        height: 100%;
        background-color: #F6F9F9;
        .date-picker {
            padding-left: 2*@ggd-grid-width+2;
            padding-top: 4*@ggd-grid-width;
        }
        .chart {
            height: 304px;
            margin: 2*@ggd-grid-width  2*@ggd-grid-width 0  2*@ggd-grid-width;
            background-color: #FFFFFF;
            box-shadow: 0 0 6px 0 #CFD5D6;
        }
        .help-link{
            position: absolute;
            display: block;
            width:260px;
            top:20%;
            left: 50%;
            transform: translate(-50%,-50%);
            line-height: 2;
            white-space: nowrap;
            cursor: pointer;
            background: #50bfff;
            border: 1px solid #bfcbd9;
            color: #fff;
            -webkit-appearance: none;
            text-align: center;
            box-sizing: border-box;
            outline: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            padding: 10px 15px;
            font-size: 30px;
            border-radius: 4px;
        }
    }
</style>





