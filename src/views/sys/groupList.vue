<template>
    <div class="app-container calendar-list-container">
        <!--<div class="filter-container">
            <el-input placeholder="组别名称" style="width:200px;" v-model="map.key" @keyup.enter.native="searchBtn"></el-input>
            <el-date-picker
                    v-model="map.selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchBtn">搜索</el-button>
        </div>-->
        <el-table fit highlight-current-row style="width:100%;" :data="list">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column label="组别名称" align="center" prop="gradeName"></el-table-column>
            <el-table-column label="昵称" align="center" prop="alias"></el-table-column>

            <el-table-column label="创建时间" align="center" prop="ctime"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                   <p>
                       <el-button size="mini" type="primary" @click="$router.push('/sys/groupEditor/'+scope.row.gradeId)">编辑</el-button>
                   </p>
                    <el-button size="mini" type="danger" @click="removeBtn(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

       <!-- <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="map.page" :page-sizes="[10,20,30, 50]" :page-size="map.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="map.total">
            </el-pagination>
        </div>-->
    </div>
</template>

<script>
    import {getGroupList,delGroup} from '@/api/sys'
    import {mapGetters} from 'vuex'
    export default {
        name: "user",
        data(){
            return {
                list:null,

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
                getGroupList({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        console.log(res.Data);
                        this.list=res.Data;
                    }
                })
            },
            //删除按钮
            removeBtn(index,row){
                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delGroup({id:row.gradeId}).then(res=>{
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
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>