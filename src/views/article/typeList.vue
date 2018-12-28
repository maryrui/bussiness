<template>
    <div class="typeList_box">
        <div class="filter-container">
            <el-input placeholder="类型名称" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
            <el-date-picker
                    v-model="map.selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addModel">新增</el-button>
        </div>
        <el-table :data="dataList">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="类型编号" prop="typeId"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.ctime}}
                </template>
            </el-table-column>
            <el-table-column label="类型名称" prop="timeBlock_id" >
                <template slot-scope="scope">
                    <template v-if="scope.row.isEditor">
                       <el-row>
                            <el-col :span="20"> <el-input v-model="scope.row.typeName" size="small"></el-input></el-col>
                            <el-col :span="4"><el-button type="warning" size="mini" @click="scope.row.isEditor=false" style="margin-left:5px;">取消</el-button></el-col>
                       </el-row>
                    </template>
                    <span v-else>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <p v-if="isAuth('role:articleTypeList:edit')"><el-button type="primary" size="mini" @click="scope.row.isEditor=1" v-if="!scope.row.isEditor">编辑</el-button><el-button type="success" size="mini" @click="submit(scope.$index,scope.row)" v-else>确定</el-button></p>
                    <p v-if="isAuth('role:articleTypeList:del')"><el-button  @click="remove(scope.$index,scope.row)" size="mini">删除</el-button></p>
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
    import {getTypeLists,addType,removeType} from '@/api/article'
    import {mapGetters} from 'vuex'
    export default {
        name: "typeList",
        data(){
            return {
                dataList:[],
                map:{
                    selectTime:"",
                    key:"",
                    status:1,
                    total:0,
                    page:1,
                    pageSize:20,
                    starttime:"",
                    endtime:""
                },
                isEditor:false,
                postForm:{
                    typeId:0,
                    typeName:"",
                    storeId:'',
                    fid:0
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
                getTypeLists(data).then(res=>{
                    if(res.Success){
                        this.dataList=res.Data.searchList;
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
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeType({typeId:row.typeId}).then(res=>{
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
            },
            //添加模态框
            addModel(){
                this.$prompt('请输入类型名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
                    inputErrorMessage: '请输入类型名称'
                }).then(({ value }) => {
                    this.postForm.typeName=value;
                    this.postForm.storeId=this.storeid;
                    addType(this.postForm).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                message:res.Msg.message,
                                type:"success"
                            })
                            var timer=setTimeout(function(){
                                location.reload();
                            },1000)
                        }
                    })

                }).catch(() => {

                });
            },
            //编辑提交
            submit(index,row){
                if(!row.typeName){
                    this.$meesage({
                        showClose:true,
                        type:'error',
                        message:"类型名称不能为空"
                    })
                    return;
                }
                this.postForm.typeId=row.typeId;
                this.postForm.typeName=row.typeName;
                this.postForm.storeId=this.storeid;
                addType(this.postForm).then(res=>{
                    if(res.Success){
                        this.$message({
                            showClose:true,
                            message:res.Msg.message,
                            type:"success"
                        })
                        this.dataList[index].isEditor=0;
                    }
                })
            },
            //搜索
            searchBtn(){
                this.map.page=1;
                this.fetchData();
            }
        }
    }
</script>

<style scoped>
    .typeList_box{
        margin-left:25px;
        margin-top:25px;
    }
</style>