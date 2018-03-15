<template>
    <div class="ggd-sub-event" >
       <div class="box">
           <h2>设备信息</h2>
           <div class="charts">
                <div id="barOsChart"></div>
                <div id="pieBrowserChart"></div>
                <div id="barIpChart"></div>
                <div id="mapIpChart"></div>
           </div>
       </div>
        <div class="box">
            <h2>行为特征</h2>
            <div class="charts">
                <div id="barVisitChart"></div>
            </div>
        </div>
        <div class="box">
            <h2>规则特征</h2>
            <div class="charts">
                <div id="radarRuleChart"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import echarts from "echarts"
    import '../assets/chartOptions/china.js'
    import barOsOption from "../assets/chartOptions/barOsOption.js"
    import pieBrowserOption from "../assets/chartOptions/pieBrowserOption.js"
    import barIpOption from "../assets/chartOptions/barIpOption.js"
    import mapIpOption from "../assets/chartOptions/mapIpOption.js"
    import barVisitOption from "../assets/chartOptions/barVisitOption.js"
    import radarRuleOption from "../assets/chartOptions/radarRuleOption.js"
    export default{
        data() {
            return {
                barOsChart:null,
                pieBrowserChart:null,
                barIpChart:null,
                mapIpChart:null,
                barVisitChart:null,
                radarRuleChart:null,
            }
        },
        computed: {
        },
        methods: {},
        props: {
            subEvenData:{
//                type:Object,
            }
        },
        watch:{
           /* subEvenData(newData){
                this.barOsChart.
            }*/
        },
        created() {

        },
        mounted(){
            this.barOsChart = echarts.init(document.getElementById('barOsChart'))
            this.barOsChart.setOption(barOsOption)
            this.pieBrowserChart = echarts.init(document.getElementById('pieBrowserChart'))
            this.pieBrowserChart.setOption(pieBrowserOption)
            this.barIpChart = echarts.init(document.getElementById('barIpChart'))
            this.barIpChart.setOption(barIpOption)
            this.mapIpChart = echarts.init(document.getElementById('mapIpChart'))
            this.mapIpChart.setOption(mapIpOption)
            this.barVisitChart = echarts.init(document.getElementById('barVisitChart'))
            this.barVisitChart.setOption(barVisitOption)
            this.radaRuleChart = echarts.init(document.getElementById('radarRuleChart'))
            this.radaRuleChart.setOption(radarRuleOption)
        },
        components: {

        }
    }
</script>
<style scoped lang=less rel="stylesheet/less">
    @import '../assets/public.less';
    .ggd-sub-event {
        display: flex;
        flex-direction: column;
        width: 100%;
        .box{
            display: flex;
            flex-direction: column;
            h2{
                color: #868686;
                font-size: 20px;
                height: 40px;
                line-height: 40px;
                background-color: #F2F2F2;
            }
            .charts{
                display: flex;
                flex-wrap: wrap;
            }
        }
        #barOsChart{
            width:50% ;
            height: 400px;
        }
        #pieBrowserChart{
            width:50% ;
            height: 400px;
        }
        #barIpChart{
            width:45% ;
            height: 400px;
        }
        #mapIpChart{
            width:55% ;
            height: 400px;
        }
        #barVisitChart{
            width:50% ;
            height: 300px;
        }
        #radarRuleChart{
            width:70% ;
            height: 300px;
        }
    }
</style>

