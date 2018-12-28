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
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-form label-position="left" inline class="demo-table-expand" v-for="(item,index) in scope.row.babys" :key="index">
                        <el-form-item label="宝宝姓名：">
                            <span>{{item.nikename}}</span>
                        </el-form-item>
                        <el-form-item label="宝宝年龄：">
                            <span>{{item.age}}月</span>
                        </el-form-item>
                        <el-form-item label="宝宝体重：">
                            <span>{{item.weight}}KG</span>
                        </el-form-item>
                        <el-form-item label="宝宝生日：">
                            <span>{{item.birthday}}</span>
                        </el-form-item>
                        <el-form-item label="宝宝身高：">
                            <span>{{item.height}}CM</span>
                        </el-form-item>
                        <el-form-item label="宝宝性别：">
                            <span>{{item.sex ? '王子' : '公主'}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
            <el-table-column label="用户头像" align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.pic">
                        <img src="scope.row.pic" alt=""  style="width:50px;height:50px;">
                    </p>
                    <p v-else style="font-size:35px;margin:0;">
                        <svg-icon :icon-class="scope.row.pic ? 'man' : 'men'"></svg-icon>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="用户名" align="center" prop="name"></el-table-column>
            <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                    {{scope.row.sex ? '宝爸' : '宝妈'}}
                </template>
            </el-table-column>
            <el-table-column label="生日" align="center" prop="birthday"></el-table-column>
            <el-table-column label="地址" align="center" prop="address"></el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="map.page" :page-sizes="[10,20,30, 50]" :page-size="map.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="map.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getUserList} from '@/api/user'
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
 ;                   if(res.Success){
                        console.log(res.Data);
                        this.list=res.Data;
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
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>