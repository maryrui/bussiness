<template>
    <div class="home_box">
        <div>
            <ul>
                <li>
                    <p><svg-icon icon-class="sumPeople"></svg-icon></p>
                    <div>
                        <span>预约总人数</span>
                        <h3>{{sumData[0]}}</h3>
                    </div>
                </li>
                <li>
                    <p><svg-icon icon-class="sumPeople"></svg-icon></p>
                    <div>
                        <span>预约完成总人数</span>
                        <h3>{{sumData[1]}}</h3>
                    </div>
                </li>
                <li>
                    <p><svg-icon icon-class="month"></svg-icon></p>
                    <div>
                        <span>当月预约总人数</span>
                        <h3>{{sumData[2]}}</h3>
                    </div>
                </li>
                <li>
                    <p><svg-icon icon-class="month"></svg-icon></p>
                    <div>
                        <span>当月预约完成数</span>
                        <h3>{{sumData[3]}}</h3>
                    </div>
                </li>
                <li>
                    <p><svg-icon icon-class="day"></svg-icon></p>
                    <div>
                        <span>当天预约总人数</span>
                        <h3>{{sumData[4]}}</h3>
                    </div>
                </li>
                <li>
                    <p><svg-icon icon-class="day"></svg-icon></p>
                    <div>
                        <span>当天预约完成数</span>
                        <h3>{{sumData[5]}}</h3>
                    </div>
                </li>
            </ul>
            <div id="charts" class="charts" ref="charts" style="width:100%;height:600px;margin-top:30px;padding-top:60px;">

            </div>
        </div>
       <!-- <div v-else>

            <p>业务简介：通过深入研究中国家庭普遍存在的隔代教育、盲目教育、对比教育等本土化教育问题，专门为0-6岁的儿童家庭提供月龄式早教方案的移动应用软件，它集合基因检测、行为自检、教具、玩具、绘本、家庭游戏、视频，问答，育儿等功能，让父母成为孩子的家庭教练，在多元立体地亲子玩乐中完成对孩子的智能教育。</p>
        </div>-->
    </div>

</template>

<script>
    import echarts from 'echarts'
    import {getSumNum} from '@/api/home'
    import {mapGetters} from 'vuex'
    export default {
        name: "index",
        data(){
            return {
                mychart:null,
                sumData:[],
                xData1:[],
                xData4:[],
                yData:[]
            }
        },
        mounted(){
            this.initChart();
        },
        computed:{
            ...mapGetters([
                'storeid',
                'roles'
            ])
        },
        methods:{
            initChart(){
                this.mychart=echarts.init(this.$refs['charts']);
                getSumNum({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        var arr=[];
                        for(var i=0;i<res.Data.length;i++){
                            if(res.Data[i].statisType=='year'){
                                if(res.Data[i].appointmentType==1){
                                    this.xData1.push(res.Data[i].totalCount)
                                    this.yData.push(res.Data[i].statisDescription.split('月')[0]+'月');
                                }else{
                                    this.xData4.push(res.Data[i].totalCount)
                                }
                            }else{
                                if(res.Data[i].statisType=='all'&&res.Data[i].appointmentType==1){
                                    arr[0]=res.Data[i].totalCount;
                                }
                                else if(res.Data[i].statisType=='all'&&res.Data[i].appointmentType==4){
                                    arr[1]=res.Data[i].totalCount;
                                }
                                else if(res.Data[i].statisType=='month'&&res.Data[i].appointmentType==1){
                                    arr[2]=res.Data[i].totalCount;
                                }
                                else if(res.Data[i].statisType=='month'&&res.Data[i].appointmentType==4){
                                    arr[3]=res.Data[i].totalCount;

                                }
                                else if(res.Data[i].statisType=='day'&&res.Data[i].appointmentType==1){
                                    arr[4]=res.Data[i].totalCount;
                                }
                                else if(res.Data[i].statisType=='day'&&res.Data[i].appointmentType==4){
                                    arr[5]=res.Data[i].totalCount;
                                }
                            }
                        }
                        this.sumData=arr;
                        this.mychart.setOption({
                            title: {
                                text: '店铺预约统计图'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['预约人数','预约完成人数']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: this.yData
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name:'预约人数',
                                    type:'line',
                                    stack: '总量',
                                    data:this.xData1
                                },
                                {
                                    name:'预约完成人数',
                                    type:'line',
                                    stack: '总量',
                                    data:this.xData4
                                }
                            ]
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    .home_box{
        background:#F0F2F5;
        padding:30px 40px;
        .charts{
            background:#fff;
            padding:0 10px;
        }
        ul{
            overflow:hidden;
            list-style:none;
            padding:0;
            border:1px solid transparent;
            li{
                float:left;
                width:15.83%;
                background:#fff;
                box-sizing: border-box;
                &:not(:last-child){
                    margin-right:1%;
                }
                p{
                    float:left;
                    width:50%;
                    font-size:80px;
                    margin:0;
                    padding-left:10%;
                }
                div{
                    float:left;
                    margin-top:20px;
                }
            }
        }
    }
</style>