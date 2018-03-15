<template>
    <div class="ggd-nav">
        <div class="logo">
            <router-link to="/" class="rlink"> xtest系统</router-link>
            </div>
        <div class="link-box">
            <div class="entries">
                <div class="first-level">
                    <div class="title"><span class="icon icon-setting"></span>数据管理</div>
                    <router-link to="/decision" class="second-level"> 判定测试</router-link>
                    <router-link to="/project-manage" class="second-level"> 项目管理</router-link>
                    <router-link to="/shareManage" class="second-level"> 分享管理</router-link>
                </div>
                <div class="first-level">
                    <div class="title"><span class="icon icon-setting"></span>账号管理</div>
                    <router-link to="/user-info" class="second-level"> 用户信息</router-link>
                </div>
              <div class="first-level">
                <div class="title"><span class="icon icon-setting"></span>关于系统</div>
                <router-link to="/sysinfo" class="second-level"> 系统信息</router-link>
                <!-- <router-link to="/server-statu" class="second-level"> 服务器状态</router-link> -->
                <!-- <router-link to="/feedback" class="second-level"> 信息反馈</router-link> -->
              </div>
                <!--<div class="first-level">-->
                    <!--<div class="title"> <span class="icon icon-pic"></span>内网系统</div>-->
                    <!--<a class="second-level" @click="goDama()"> <span class="icon-pic"></span></a>-->
                <!--</div>-->
                <!--<div class="first-level">-->
                    <!--<div class="title">事件</div>-->

                    <!--<router-link to="/event-general">事件概况</router-link>-->
                    <!--<router-link to="/event-analysis">事件分析</router-link>-->

                <!--</div>-->
            </div>
            <!--<div class="account">-->
               <!---->
            <!--&lt;!&ndash;<div class="first-level">&ndash;&gt;-->
                <!--&lt;!&ndash;<router-link to="/account-info">用户名</router-link>&ndash;&gt;-->
                <!--&lt;!&ndash;<a>登出</a>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</div>-->
        </div>
    </div>
</template>
<script>

    import {mapState} from 'vuex'
    export default{
        computed: {
            ...mapState(['serverUrl', 'token', 'loginUser'])
        }
    }
</script>

<style scoped lang=less rel="stylesheet/less">
    @import '../assets/public.less';
    @import "../../config/bootstrap.config.less";
    @list-padding-left: 4*@ggd-grid-width;
    .ggd-nav {
        display: flex;
        flex-direction: column;
        width: @nav-width;
        min-height: 668px;
        padding-top: @gtt-header;
        padding-bottom: 5.5*@ggd-grid-width;
        box-sizing: border-box;
        font-size: 14px;
        color: #fff;
        background: linear-gradient(180deg, #545C61 0%, #363E43 100%);
        flex: none;
        position: fixed;
        overflow-y:auto;
        height: 100%;
        .logo {
            height: 4*@ggd-grid-width;
            flex: none;
            line-height: 4*@ggd-grid-width;
            padding-left: @list-padding-left;
        }
        .rlink{
                display: block;
                height: 40px;
                color: #fff;
                line-height: 40px;
                padding-left: @list-padding-left;
                }
        .link-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            // height: 600px;
            flex-grow: 1;
            padding-top: 3.5*@ggd-grid-width;
            .first-level {
                display: flex;
                flex-direction: column;
            }
            a{
                display: block;
                height: 40px;
                color: #fff;
                opacity: 0.7;
                line-height: 40px;
                padding-left: @list-padding-left;
                cursor: pointer;
                &.router-link-active {
                    @border-width:2px;
                    opacity: 1;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-left: @border-width #fff solid;
                    padding-left: @list-padding-left + 35px  - @border-width;
                }}
            .title {
                display: flex;
                align-items: center;
                opacity: 0.4;
                color: #FFFFFF;
                height: 40px;
                line-height: 40px;
                padding-left: @list-padding-left;
            }
            .second-level {
                padding-left: @list-padding-left + 35px;
            }
        }
    }

    @media (max-width: @screen-md-min) {
        .ggd-nav{
            width: 176px;
        }
    }
</style>

