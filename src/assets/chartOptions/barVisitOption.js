export default {
    title:{
        text:'当前页面访问时长分布',
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
        data: ["(0,5)", "(3,10)", "(38,60)", "(50,50)"],
        inverse:true,
    },
    series: [
        {
            name: 'ua访问次数',
            type: 'bar',
            data: [343, 2456, 5355, 4500]
        },

    ]
}
