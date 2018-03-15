/**
 * Created by 张瑞年 on 2017/4/28.
 */
export default {
    title: {
        text: '规则特征',
        // x:"center"
    },
    tooltip: {},
    /*legend: {
        data: ['规则。。。。']
    },*/
    radar: {
        // shape: 'circle',
        indicator: [
            { name: '直接请求访问', max: 6500 },
            { name: '异常访问链访问', max: 16000 },
            { name: '页面关键标签检查', max: 30000 },
            { name: '浏览器特性检查', max: 38000 },
            { name: '行为关键标签检查', max: 52000 },
            { name: '高频访问检查', max: 25000 }
        ]
    },
    series: [{
        name: '？？？',
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value : [4300, 10000, 28000, 35000, 50000, 19000],
                name : '规则。。。。'
            }
        ]
    }]
}
