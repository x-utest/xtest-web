<template>
    <div class="project-manage" v-loading.body="isloading">
        <h1>分享管理</h1>
        <div class="main-panel">
            <el-tabs v-model="current" @tab-click="change">
                <el-tab-pane label="判定测试">
                    <el-table :data="data" border style="width:100%">
                        <el-table-column type="index" width="60"></el-table-column>
                        <el-table-column prop="stoken" label="链接" width="240">
                            <template scope="scope">
                                <b style="margin-right:10px">{{scope.row.p_name}}</b>
                                <a target="_blank" :href="'/utest-report-share.html?stoken='+scope.row.stoken">{{scope.row.stoken|SliceString(8)}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cnt" label="浏览数" width="100"></el-table-column>
                        <el-table-column label="备注">
                            <template scope="scope">
                                <el-input placeholder="备注信息" v-model="scope.row.mark" :data-id="scope.row._id" class="txt-mark"></el-input>
                                <el-button type="info" size="mini" icon="edit" @click="editMark(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" width="200">
                            <template scope="scope">
                                {{scope.row.rc_time |BeijingTime }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template scope="scope">
                                <el-button type="danger" size="mini" icon="delete" @click="del(scope.row._id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="height:20px"></div>
                    <el-pagination layout="prev, pager, next" :page-count="totalPage" :page-size="1" :current-page="page" @current-change="getData">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="项目成长">
                    <el-table :data="data2" border style="width:100%">
                        <el-table-column type="index" width="60"></el-table-column>
                        <el-table-column prop="stoken" label="链接" width="240">
                            <template scope="scope">
                                <b style="margin-right:10px">{{scope.row.p_name}}</b>
                                <a target="_blank" :href="'/pro-report-share.html?stoken='+scope.row.stoken">{{scope.row.stoken|SliceString(8)}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cnt" label="浏览数" width="100"></el-table-column>
                        <el-table-column label="备注">
                            <template scope="scope">
                                <el-input placeholder="备注信息" v-model="scope.row.mark" :data-id="scope.row._id" class="txt-mark"></el-input>
                                <el-button type="info" size="mini" icon="edit" @click="editMark(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" width="200">
                            <template scope="scope">
                                {{scope.row.rc_time |BeijingTime }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template scope="scope">
                                <el-button type="danger" size="mini" icon="delete" @click="del(scope.row._id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="height:20px"></div>
                    <el-pagination layout="prev, pager, next" :page-count="totalPage2" :page-size="1" :current-page="page2" @current-change="getData">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
function isOK(rsp) {
    var a = rsp.data;
    return a && a.code == 200
}
import { mapState } from 'vuex'
export default {
    data() {
        return {
            current: '0',
            isloading: !0,
            data: [],
            page: 1,
            totalPage: 1,
            data2: [],
            page2: 1,
            totalPage2: 1
        }
    },
    computed: {
        ...mapState(['serverUrl', 'token']),
    },
    methods: {
        del(id) {
            var vm = this;
            function onfail() {
                vm.isloading = !1;
                vm.$alert('删除分享发生错误', '提示', { type: 'error' })
            }
            vm.$confirm('确定要删除该分享?', '提示', { type: 'warning' })
                .then(() => {
                    vm.isloading = !0;
                    vm.$http.get(`${vm.serverUrl}share/delete-${vm.current == 0 ? 'utest' : 'project'}-share/`, {
                        params: {
                            share_id: id,
                            token: vm.token
                        }
                    }).then(res => {
                        if (isOK(res)) {
                            vm.isloading = !1;
                            vm['getData' + (vm.current == 0 ? '' : '2')]();
                        } else { onfail() }
                    }).catch(onfail)
                }).catch(_ => _)
        },
        change() {
            var vm = this;
            vm['getData' + (vm.current == 0 ? '' : '2')]();
        },
        getData(page) {
            var vm = this, serverUrl = vm.serverUrl;
            if (page) {
                if (page == vm.page) { return }
                vm.page = page;
            }
            function onfail() {
                vm.isloading = !1;
                vm.$alert('获取信息发生错误', '提示', { type: 'error' })
            }
            vm.$http.get(`${serverUrl}share/my-utest-share/`, {
                params: {
                    token: vm.token,
                    page_idx: vm.page,
                    page_size: 30
                }
            }).then(res => {
                vm.isloading = !1;
                vm.data = res.data.data.page_data;
                vm.totalPage = res.data.page_total_cnts;
            }).catch(onfail)
        },
        getData2(page) {
            var vm = this, serverUrl = vm.serverUrl;
            if (page) {
                if (page == vm.page2) { return }
                vm.page2 = page;
            }
            function onfail() {
                vm.isloading = !1;
                vm.$alert('获取信息发生错误', '提示', { type: 'error' })
            }
            vm.$http.get(`${serverUrl}share/my-project-share/`, {
                params: {
                    token: vm.token,
                    page_idx: vm.page2,
                    page_size: 30
                }
            }).then(res => {
                vm.isloading = !1;
                vm.data2 = res.data.data.page_data;
                vm.totalPage2 = res.data.page_total_cnts;
            }).catch(onfail)
        },
        editMark(item) {
            var vm = this, token = vm.token,
                share_id = item._id,
                mark = item.mark||'';
            function onfail() {
                vm.isloading = !1;
                vm.$alert('修改备注发生错误', '提示', { type: 'error' })
            }
            vm.isloading = !0;
            vm.$http.post(`${vm.serverUrl}share/update-${vm.current == 0 ? 'utest' : 'project'}-share/`,
                { token, share_id, mark }
            ).then(res => {
                if (isOK(res)) {
                    vm.isloading = !1;
                } else { onfail() }
            }).catch(onfail)
        }
    },
    created() {
        this.getData()
    }

}


</script>

<style scoped lang=less rel="stylesheet/less">
@import '../../assets/public.less';

.project-manage {
    background-color: #F6F9F9;
    height: 100vh;
    h1 {
        font-size: 2rem;
        margin: 0 1rem 0.6rem 2.5%;
        text-align: left;
    }
    .txt-mark {
        margin: 3px 10px 3px 3px;
        width: calc(~'100% - 40px')
    }
    .main-panel {
        margin: 30px 50px;
        .el-tabs__item {
            padding: 0 30px;
            font-size: 18px
        }
    }
    .el-pagination {
        padding-left: 26px;
        margin-bottom: 50px;
    }
    .el-dropdown {
        font-size: 20px;
        margin-top: 5px;
    }
}
</style>





