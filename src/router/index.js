import Vue from 'vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import decision from '../pages/decision/decision.vue'
import projectManage from '../pages/project-manage/project-manage.vue'
import sysinfo from '../pages/sysinfo/sysinfo.vue'
import serverStatu from '../pages/server-statu/server-statu.vue'

import feedback from '../pages/feedback/feedback.vue'
import testReport from '../pages/test-report/test-report.vue'
import userInfo from '../pages/user-info/user-info.vue'
import testChart from '../pages/testChart/testChart.vue'
import shareManage from '../pages/shareManage/shareManage.vue'
import userControl from '../pages/userControl/userControl.vue'


import home from '../pages/home/home.vue'
//import viewOne from './components/viewOne.vue'
/*const parentThree = resolve => require.ensure([], () => resolve(require('./components/parentThree.vue')), 'groupThree')
 const viewSix = resolve => require.ensure([], () => resolve(require('./components/viewSix.vue')), 'groupThree')
 const viewSeven = resolve => require.ensure([], () => resolve(require('./components/viewSeven.vue')), 'groupThree')*/

// viewTwo viewThree viewFive groupTwo groupThree 定义的是chunk名

const routes = [
    { path: '/decision', component: decision },
    { path: '/project-manage', component: projectManage },
    { path: '/sysinfo', component: sysinfo },
    { path: '/server-statu', component: serverStatu },
    { path: '/feedback', component: feedback },
    { path: '/test-report', component: testReport },
    { path: '/user-info', component: userInfo },
    { path: '/testChart', component: testChart },
    { path: '/shareManage', component: shareManage },
    { path: '/userControl', component: userControl },
    { path: '/', component: home }
];

export default new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || to.hash ? { selector: to.hash } : { x: 0, y: 0 }
    }
})
