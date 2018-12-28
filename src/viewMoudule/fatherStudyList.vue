<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="绘本标题" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
            <el-select v-model="map.contentType_id">
                <el-option v-for="item in typeList" :label="item.typeName" :value="item.typeId" :key="item.typeId" placeholder="绘本类型"></el-option>
            </el-select>
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
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="绘本编号" align="center" prop="content_id"></el-table-column>
            <el-table-column label="绘本标题" align="center" prop="title"></el-table-column>
            <el-table-column label="绘本类型" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{scope.row.contentCategory.categoryName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" align="center" prop="ctime"></el-table-column>
            <el-table-column label="是否推荐" align="center">
                <template slot-scope="scope">
                    {{scope.row.reds ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column label="是否置顶" align="center" prop="is_top">
                <template slot-scope="scope">
                    {{scope.row.is_top ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column label="阅读量" align="center" prop="reads"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/schoolroom/editor/'+scope.row.content_id">
                        <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="scope.row.isDeleted ? true :false">编辑</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-remove-outline" @click="removeBtn(scope.$index,scope.row)">删除</el-button>
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
    import {getList,delone,getCategory} from '@/api/schoolroom'
    import {mapGetters} from 'vuex'
    export default {
        name: "list",
        data(){
            return {
                list:null,
                typeList:[],
                map:{
                    selectTime:"",
                    key:"",
                    total:0,
                    page:1,
                    pageSize:20,
                    starttime:"",
                    endtime:"",
                    contentType_id:""
                }
            }
        },
        created(){
            this.getList();
            this.getTypeLists();
        },
        computed:{
            ...mapGetters([
                'storeid'
            ])
        },
        methods:{
            //获取数据
            getList(){
                if(this.map.selectTime){
                    this.map.starttime=this.map.selectTime[0];
                    this.map.endtime=this.map.selectTime[1];
                }
                var data={
                    storeId:this.storeid,
                    startDate:this.map.starttime,
                    endDate:this.map.endtime,
                    moduleType:1,
                    keyword:this.map.key,
                    pageindex:this.map.page,
                    pagesize:this.map.pageSize,
                    typeId:this.map.contentType_id ? this.map.contentType_id : 0
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
                    delone({id:row.content_id,moduleType:1,value:4}).then(res=>{
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
            },
            //获取类型
            getTypeLists(){
                getCategory().then(res=>{
                    if(res.Success){
                        this.typeList=res.Data;
                    }
                })
            },
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>