<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="名称" style="width:200px;" v-model="map.key" @keyup.enter.native="getList"></el-input>
            <el-date-picker
                    v-model="map.selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </div>
        <el-table fit highlight-current-row style="width:100%;" :data="list">
            <el-table-column label="标题" align="center" prop="title"></el-table-column>
            <el-table-column label="评论状态">
                <template slot-scope="scope">
                   <el-tag type="info">关闭</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="评论数">
                <template slot-scope="scope">
                    {{scope.row.store.brand.brand_name}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/goods/editor/'+scope.row.storeActivity_id">
                        <el-button type="" size="mini" icon="el-icon-view" type="primary">查看</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" @click="closeDiscussBtn(scope.$index,scope.row)">关闭评论</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center">
                 <template slot-scope="scope">
                    <p> <el-button type="" size="mini" icon="el-icon-edit" type="danger" @click="putawayBtn(0,'下架此活动')">下架</el-button></p>
                     <el-button type="" size="mini" icon="el-icon-edit" type="primary" @click="putawayBtn(1,'上架此活动')">上架</el-button>
                 </template>
             </el-table-column>-->
        </el-table>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="map.page" :page-sizes="[10,20,30, 50]" :page-size="map.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="map.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getActiveList,getActiveCount,updateStatus} from '@/api/goods'
    import {mapGetters} from 'vuex'
    export default {
        name: "list",
        data(){
            return {
                list:null,
                map:{
                    selectTime:"",
                    key:"",
                    total:0,
                    page:1,
                    pageSize:20,
                    starttime:"",
                    endtime:""
                },
                upActiveCount:0,
                downActiveCount:0
            }
        },
        computed:{
            ...mapGetters([
                'storeid'
            ])
        },
        created(){
            this.getList();
            getActiveCount({storeId:this.storeid}).then(res=>{
                if(res.Success){
                    this.upActiveCount=res.Data[0].totalCount;
                    this.downActiveCount=res.Data[1].totalCount;
                }
            })
        },
        methods:{
            getList(){
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
                    status:this.map.status,
                    keyword:this.map.key,
                    moduleType:'6'
                }
                getActiveList(data).then(res=>{
                    if(res.Success){
                        this.list=res.Data.searchList;
                        this.map.total=res.Data.totalCount;
                    }
                })
            },
            //输入key enter键搜索
            inputSubmit(val){
                this.map.key=val;
                this.getList();
            },
            //改变数据数量
            handleSizeChange(val){
                this.map.pageSize=val;
                this.getList();
            },
            //切换导航
            swichBtn(val){
                this.map.status=val;
                this.getList();
            },
            //改变页数
            handleCurrentChange(val){
                this.map.page=val;
                this.getList();
            },
            //上下架按钮
            putawayBtn(index,row,status){
                this.$confirm('是否继续执行?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    updateStatus({activityId:row.storeActivity_id,status:status}).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                message:res.Msg.message,
                                type:'success'
                            })
                            this.list.splice(index,1);
                            if(this.map.status==1){
                                this.upActiveCount--;
                                this.downActiveCount++
                            }else{
                                this.upActiveCount++;
                                this.downActiveCount--
                            }
                        }
                    })
                }).catch(() => {
                });
            },
            removeBtn(){

            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>