<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="手机号/姓名" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
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
            <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
            <el-table-column label="用户头像" align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.imagePath">
                        <img :src="scope.row.imagePath" alt=""  style="width:50px;height:50px;">
                    </p>
                    <p v-else style="font-size:35px;margin:0;">
                        <svg-icon :icon-class="scope.row.pic ? 'man' : 'men'"></svg-icon>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="用户名" align="center" prop="name"></el-table-column>
            <el-table-column label="所属组别" align="center" prop="grade.gradeName"></el-table-column>
            <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                    {{scope.row.sex ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column label="是否禁用" align="center">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isEnable"
                            active-color="#13ce66"
                            inactive-color="#cccccc"
                            :active-value="1"
                            :inactive-value="0"
                            @change="switchBtn(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <p>
                        <el-button size="mini" type="primary" @click="$router.push('/sys/editor/'+scope.row.userId)">编辑</el-button>
                    </p>
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
    import {getUserList,delUser} from '@/api/sys'
    import {mapGetters} from 'vuex'
    export default {
        name: "user",
        data(){
            return {
                list:null,
                map:{
                    selectTime:"",
                    type:"",
                    key:"",
                    total:0,
                    page:1,
                    pageSize:20,
                    starttime:"",
                    endtime:""
                }
            }
        },
        created(){
            this.getList();
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
                    keyword:this.map.key,
                    pageindex:this.map.page,
                    pagesize:this.map.pageSize
                }
                getUserList(data).then(res=>{
                    if(res.Success){
                        console.log(res.Data);
                        this.list=res.Data.searchList;
                        this.map.total=res.Data.totalCount;
                    }
                })
            },

            //单页数量
            handleSizeChange(val){
                this.map.pageSize=val;
                this.getList();
            },
            //分页
            handleCurrentChange(val){
                this.map.page=val;
                this.getList();
            },
            //搜索
            searchBtn(){
                this.map.page=1;
                this.getList();
            },
            switchBtn(row){
                delUser({id:row.userId,value:row.isEnable}).then(res=>{
                    if(res.Success){
                        this.$message({
                            showClose:true,
                            message:res.Msg.message,
                            type:'success'
                        })
                    }else{
                        this.$message({
                            showClose:true,
                            message:res.Msg.message,
                            type:'eroor'
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>