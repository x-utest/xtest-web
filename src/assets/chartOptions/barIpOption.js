/**
 * Created by 张瑞年 on 2017/4/27.
 */
export default {
    title:{
        text:'TOP5 IP',
        x:'center'
    },
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        nameLocation:'middle',
        position:"top",
        nameGap:25
    },
    yAxis: {
        type: 'category',
        data: ["192.334.32.3", "192.334.32.3", "192.3.32.3", "192.34.32.3"],
        inverse:true,
    },
    series: [
        {
            name: 'ua访问次数',
            type: 'bar',
            data: [343, 245, 53, 45]
        },

    ]
}
