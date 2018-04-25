export default {
    title:{
        text:'TOP10 OS分布',
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
        name:'ua访问次数',
        nameLocation:'middle',
        position:"top",
        nameGap:25
    },
    yAxis: {
        type: 'category',
        data: ["mac", "ios", "android", "black"],
        inverse:true,
    },
    series: [
        {
            name: 'ua访问次数',
            type: 'bar',
            data: [34, 45, 53, 45]
        },

    ]
}
