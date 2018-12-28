<template>
    <div class="timeList_box">
        <el-table :data="dataList">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-col :span="3" v-for="(item,index) in scope.row.timePeriod" :key="index" >
                        <el-form label-width="90px" style="border:1px solid #ddd;">
                            <el-form-item label="设置时间：">
                                <span>{{item.stime+'-'+item.etime}}</span>
                            </el-form-item>
                            <el-form-item label="接待人数：">
                                <span>{{item.numberPeople}}</span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>
            </el-table-column>
            <el-table-column label="时间轴ID" prop="timeBlock_id"></el-table-column>
            <el-table-column label="时间轴名称" prop="groupName"></el-table-column>
            <el-table-column label="创建时间" prop="ctime"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <p><el-button  @click="remove(scope.$index,scope.row)" size="mini">删除</el-button></p>
                    <router-link :to="'/goods/timeEditor/'+scope.row.timeBlock_id">
                        <p><el-button type="primary" size="mini">编辑</el-button></p>
                    </router-link>
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
    import {getTimerList,removeOne} from '@/api/goods'
    import {mapGetters} from 'vuex'
    export default {
        name: "timeList",
        data(){
            return {
                dataList:[],
                map:{
                    total:0,
                    page:1,
                    pageSize:20,
                }
            }
        },
        computed:{
            ...mapGetters([
                'storeid'
            ])
        },
        created(){
            this.fetchData();
        },
        methods:{
            //获取数据
            fetchData(){
                getTimerList({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        this.dataList=res.Data;
                    }
                })
            },
            //改变数据数量
            handleSizeChange(val){
                this.map.pageSize=val;
                this.getTimerList();
            },
            //改变页数
            handleCurrentChange(val){
                this.map.page=val;
                this.getTimerList();
            },
            //删除
            remove(index,row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeOne({id:row.timeBlock_id}).then(res=>{
                        if(res.Success){
                            this.dataList.splice(index,1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })

                }).catch(() => {

                });
            }
        }
    }
</script>

<style scoped>
    .timeList_box{
        margin-left:25px;
    }
</style>