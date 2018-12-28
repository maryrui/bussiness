<template>
    <div class="app-container calendar-list-container">
        <p>
            <el-badge :value="count1" class="item">
                <el-button size="small" :type="map.status==0 ? 'primary' : ''" @click="swichBtn(0)">待处理</el-button>
            </el-badge>
            <el-badge :value="count2" class="item" style="margin-left:15px;">
                <el-button size="small" :type="map.status==1 ? 'primary' : ''" @click="swichBtn(1)">已处理</el-button>
            </el-badge>
        </p>
        <div class="filter-container">
            <el-input placeholder="手机号/编号" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
            <el-date-picker
                    v-model="map.selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
        </div>
        <el-table fit highlight-current-row style="width:100%;" :data="list">
            <el-table-column label="预约编号" prop="appointment_no" align="center"></el-table-column>
            <el-table-column label="手机号" align="center" prop="user.phone"></el-table-column>
            <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                    {{parseInt(scope.row.user.userdtl.sex) ? '宝爸' : '宝妈'}}
                </template>
            </el-table-column>
            <el-table-column label="预约时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.appointment_time}} <br>
                    {{scope.row.appointmentPeriod.stime+'-'+scope.row.appointmentPeriod.etime}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==0" type="warning">预约中</el-tag>
                    <el-tag v-if="scope.row.status==1" type="success">预约成功</el-tag>
                    <el-tag v-if="scope.row.status==2" type="danger">预约失败</el-tag>
                    <el-tag v-if="scope.row.status==3" type="info">预约取消</el-tag>
                    <el-tag v-if="scope.row.status==4" type="success">预约完成</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="!map.status">
                <template slot-scope="scope">
                    <el-button size="mini" @click="passBtn(scope.$index,scope.row,1)" type="primary">确认</el-button>
                    <el-button size="mini" @click="passBtn(scope.$index,scope.row,2)" type="danger">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="map.page" :page-sizes="[10,20,30, 50]" :page-size="map.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="map.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getList,getCount,pass} from "../../api/appointment";
    import {mapGetters} from 'vuex'
    export default {
        name: "appointment",
        data(){
            return {
                list:[],
                map:{
                    selectTime:"",
                    status:0,
                    type:"",
                    total:0,
                    page:1,
                    pageSize:20,
                    starttime:"",
                    endtime:""
                },
                count1:0,
                count2:0
            }
        },
        created(){
            this.fetchData();
            getCount({storeId:this.storeid}).then(res=>{
                if(res.Success){
                    console.log(res);
                    this.count1=parseInt(res.Data[0].totalCount);
                    this.count2=parseInt(res.Data[1].totalCount);
                }
            })
        },
        computed:{
            ...mapGetters([
                'storeid'
            ])
        },
        methods:{
            //获取列表
            fetchData(){
                if(this.map.selectTime){
                    this.map.starttime=this.map.selectTime[0];
                    this.map.endtime=this.map.selectTime[1];
                }
                var data={
                    storeId:this.storeid,
                    pageindex:this.map.page,
                    pagesize:this.map.pageSize,
                    startDate:this.map.starttime,
                    endDate:this.map.endtime,
                    keyword:this.map.key,
                    moduleType:6,
                    status:this.map.status
                }
                getList(data).then(res=>{
                    if(res.Success){
                        console.log(res.Data)
                        this.list=res.Data.searchList;
                        this.map.total=res.Data.totalCount;
                    }
                })
            },
            //通过拒绝按钮
            passBtn(index,row,val){
                this.$confirm(' 是否继续执行?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    pass({appointmentId:row.storeAppointment_id,status:val}).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                type:'success',
                                message:res.Msg.message
                            })
                            this.list.splice(appointerMent,1)
                        }
                    })
                }).catch(() => {

                });
            },
            //导航切换
            swichBtn(val){
                this.map.status=val;
                this.fetchData();
            },
            //改变数据数量
            handleSizeChange(val){
                this.map.pageSize=val;
                this.fetchData();
            },
            //改变页数
            handleCurrentChange(val) {
                this.map.page = val;
                this.fetchData();
            },
            //搜索
            searchBtn(){
                this.map.page=1;
                this.fetchData();
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>