<template>
    <div class="project-manage" v-loading.body="isloading">
        <h1>项目信息</h1>
        <el-button type="info" size="small" @click="form={};FormVisible=!0;" style="margin-left: 45px;">添加项目</el-button>
    
        <el-table :data="projectItems" border style="width:90%;margin:10px 20px">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="名称" width="230">
                <template scope="scope">
                    <router-link :to="{path:'/testChart',query:{id:scope.row.id}}">{{scope.row.project_name}}</router-link>
                </template>
            </el-table-column>
            <el-table-column label="项目编号" width="150">
                <template scope="scope">
                    {{scope.row.id|SliceString(10)}}
                </template>
            </el-table-column>
            <el-table-column prop="mark" label="项目描述"></el-table-column>
            <el-table-column label="创建时间" width="200">
                <template scope="scope">
                    {{scope.row.rc_time |BeijingTime }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button type="info" size="mini" icon="information" title="查看配置信息" @click="popConfig(scope.row.id)"></el-button>
                    <el-button type="primary" size="mini" icon="edit" @click="alter(scope.row)"></el-button>
                    <el-button type="danger" size="mini" icon="delete" @click="del(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="height:20px"></div>
        <el-pagination layout="prev, pager, next" :page-count="totalPage" :page-size="1" :current-page="pageNum" @current-change="getProject">
        </el-pagination>
    
        <el-dialog :visible.sync="FormVisible" :close-on-click-modal="false">
            <b slot="title">{{form.id?'修改项目':'添加新项目'}}</b>
            <el-form :model="form">
                <el-form-item label="项目名称">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目描述">
                    <el-input v-model="form.mark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="FormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    
        <el-dialog :visible.sync="configShow">
            <b slot="title"> {{configInfo.project_name}} 配置信息</b>
            <table cellspacing="0" cellpadding="0" border="0" class="el-table my-table">
                <tr>
                    <td>project_id</td>
                    <td>{{configInfo.project_id}}</td>
                </tr>
                <tr>
                    <td>app_id</td>
                    <td>{{configInfo.app_id}}</td>
                </tr>
                <tr>
                    <td>app_key</td>
                    <td>{{configInfo.app_key}}</td>
                </tr>
            </table>
            <div slot="footer">
                <el-button type="primary" @click="configShow = false">确 定</el-button>
            </div>
        </el-dialog>
    
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
            isloading: !0,
            projectItems: [],
            pageNum: 1,
            totalPage: 1,
            currentProject: '全部项目',
            message: "",
            url: "",
            form: {},
            FormVisible: false,
            configInfo: {},
            configShow: false
        }
    },
    computed: {
        ...mapState(['serverUrl', 'token']),
    },
    methods: {
        popConfig(id) {
            var vm = this;
            function onfail() {
                vm.isloading = !1;
                vm.$alert('获取配置信息发生错误', '提示', { type: 'error' })
            }
            vm.isloading = !0;
            return vm.$http.get(`${vm.serverUrl}project/xtest-client-config/`, {
                params: {
                    project_id: id,
                    token: vm.token
                }
            }).then(res => {
                if (isOK(res)) {
                    vm.isloading = !1;
                    vm.configShow = true
                    vm.configInfo = res.data.data
                } else { onfail() }
            }).catch(onfail)
        },
        del(id) {
            var vm = this;

            function onfail() {
                vm.isloading = !1;
                vm.$alert('删除项目发生错误', '提示', { type: 'error' })
            }
            vm.$confirm('确定要删除该项目?', '提示', { type: 'warning' })
                .then(() => {
                    vm.isloading = !0;
                    vm.$http.get(`${vm.serverUrl}project/delete-test-project/`, {
                        params: {
                            id,
                            token: vm.token
                        }
                    }).then(res => {
                        if (isOK(res)) {
                            vm.isloading = !1;
                            vm.getProject()
                        } else { onfail() }
                    }).catch(onfail)
                }).catch(_ => _)
        },
        alter(item) {
            var vm = this;
            vm.form = { name: item.project_name, mark: item.mark, id: item.id };
            vm.FormVisible = !0;
        },
        save() {
            var vm = this,
                f = vm.form;
            f.token = vm.token;
            function onfail() {
                vm.isloading = !1;
                vm.$alert('保存项目信息发生错误', '提示', { type: 'error' })
            }
            if (!f.name) { return vm.$alert('请填写项目名称', '提示', { type: 'info' }) }
            vm.isloading = !0;
            vm.$http.post(`${vm.serverUrl}project/${f.id ? 'update' : 'create'}-test-project/`, f)
                .then(res => {
                    vm.isloading = !1;
                    if (isOK(res)) {
                        vm.FormVisible = !1;
                        if (!f.id) { vm.getProject() }
                        else {
                            let a = vm.projectItems.find(x => x.id == f.id) || {};
                            a.project_name = f.name;
                            a.mark = f.mark;
                            setTimeout(_ => vm.$message('修改成功'), 2e2)
                        }
                    } else { onfail() }
                }).catch(onfail)

        },
        getProject(page) {
            var vm = this, serverUrl = vm.serverUrl;
            if (page) { vm.pageNum = page }
            function onfail() {
                vm.isloading = !1;
                vm.$alert('获取项目信息发生错误', '提示', { type: 'error' })
            }
            vm.$http.get(`${serverUrl}project/list-projects/`, {
                params: {
                    token: vm.token,
                    page_idx: vm.pageNum
                }
            })
                .then(res => {
                    vm.isloading = !1;
                    vm.projectItems = res.data.page_data
                    vm.totalPage = res.data.page_total_cnts;
                }).catch(onfail)
        }
    },
    created() {
        this.getProject()
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
    .el-pagination {
        padding-left: 26px;
        margin-bottom: 50px;
    }
    .el-dropdown {
        font-size: 20px;
        margin-top: 5px;
    }
    .my-table td {
        border-right: 1px solid #dfe6ec;
        text-indent: 20px
    }
}
</style>





