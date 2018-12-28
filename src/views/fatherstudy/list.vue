<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="标题" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
            <el-date-picker
                    v-model="map.selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="map.fcModuleType">
                <el-option label="居家学院" :value="1"></el-option>
                <el-option label="公开课" :value="2"></el-option>
                <el-option label="情绪魔法师" :value="3"></el-option>
                <el-option label="听世界" :value="4"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
        </div>
        <el-table fit highlight-current-row style="width:100%;" :data="list">
            <el-table-column label="课程编号" prop="courses_id" width="60"></el-table-column>
            <el-table-column label="课程标题" align="center" prop="title"></el-table-column>
            <el-table-column label="所属模块" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.fcModuleType=='1'" type="danger">居家学院</el-tag>
                    <el-tag v-if="scope.row.fcModuleType=='2'" type="primary">公开课</el-tag>
                    <el-tag v-if="scope.row.fcModuleType=='3'" type="success">情绪魔法师</el-tag>
                    <el-tag v-if="scope.row.fcModuleType=='4'" type="info">听世界</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="价格" align="center" prop="price"></el-table-column>
            <el-table-column label="内容类型" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.coursesType==2 ? 'warning' : 'primary'">{{scope.row.coursesType==2 ? '课程' : '专辑'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="支付方式" align="center" prop="consumptionType">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.consumptionType=='money'" type="danger">金钱</el-tag>
                    <el-tag v-if="scope.row.consumptionType=='integral'" type="warning">积分</el-tag>
                    <el-tag v-if="scope.row.consumptionType=='moneyAndIntegral'" type="warning">积分抵扣</el-tag>
                    <el-tag v-if="scope.row.consumptionType=='free'" type="warning">免费</el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column label="折扣" align="center" prop="sort_no"></el-table-column>-->
            <el-table-column label="积分" align="center" prop="score"></el-table-column>
            <el-table-column label="发布时间" align="center" prop="ctime"></el-table-column>
            <el-table-column label="学习数量" align="center" prop="studyNumber"></el-table-column>
            <el-table-column label="课程状态" align="center" prop="reads">
                <template slot-scope="scope">
                    <el-tag v-if=" scope.row. statusName== 0 " type="info">审核中</el-tag>
                    <el-tag v-if=" scope.row. statusName== 1 " type="success">审核成功</el-tag>
                    <el-tag v-if=" scope.row. statusName== 2 " type="warning">审核失败</el-tag>
                    <el-tag v-if=" scope.row. statusName== 4 " type="danger">已删除</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <p><el-button type="primary" size="mini" icon="el-icon-edit" @click="$route.push('/fatherstudy/editor/'+scope.row.courses_id)">编辑</el-button></p>
                    <p><el-button type="danger" size="mini" icon="el-icon-remove-outline" @click="removeBtn(scope.$index,scope.row)">删除</el-button></p>
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
    import {getList,delone} from '@/api/fatherstudy'
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
                    endtime:"",
                    fcModuleType:""
                }
            }
        },
        created(){
            this.getList();
        },
        computed:{
            ...mapGetters([
                'userid'
            ])
        },
        methods:{
            //获取列表
            getList(){
                if(this.map.selectTime){
                    this.map.starttime=this.map.selectTime[0];
                    this.map.endtime=this.map.selectTime[1];
                }
                var data={
                    userId:this.userid,
                    startDate:this.map.starttime,
                    endDate:this.map.endtime,
                    title:this.map.key,
                    pageindex:this.map.page,
                    pagesize:this.map.pageSize,
                    fcModuleType:this.map.fcModuleType ?  this.map.fcModuleType : 0
                }
                getList(data).then(res=>{
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
            //改变页数
            handleCurrentChange(val){
                this.map.page=val;
                this.getList();
            },
            //删除按钮
            removeBtn(index,row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delone({userId:this.userid,coursesId:row.courses_id,coursesDetailId:row.coursesDetailId}).then(res=>{
                        if(res.Success){
                            this.list.splice(index,1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                }).catch(() => {

                });
            },
            //搜索
            searchBtn(){
                this.map.page=1;
                this.getList();
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>