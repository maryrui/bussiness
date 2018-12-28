<template>
    <div class="box">
        <el-form label-width="120px" :model="timer" ref="timer">
            <el-form-item label="时间轴名称"
                          prop="groupName"
                          :rules="[
                { required: true, message: '请输入时间轴名称', trigger: 'blur' }

            ]"
            >
                <el-row>
                    <el-col :span="15">
                        <el-input placeholder="请输入名称" v-model="timer.groupName"></el-input>
                    </el-col>
                    <el-col :span="4" style="text-align:center"><el-button icon="el-icon-circle-plus" @click="addList">新增</el-button></el-col>
                </el-row>
            </el-form-item>
            <el-form-item  v-for="(item,index) in timer.timePeriod" :label="'设置时间'+index" :key="index" >
                <el-row >
                    <el-col :span="6">
                        <el-form-item
                                :prop="'timePeriod.' + index + '.stime'"
                                :rules="[
                        { required: true, message: '请输入开始时间', trigger: 'blur' }
                        ]"
                        >
                            <el-time-select
                                    v-model="item.stime"
                                    :picker-options="{
                                        start: '08:00',
                                        step: '00:15',
                                        end: '22:00'
                                      }"
                                    placeholder="选择时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align:center" :span="2">-</el-col>
                    <el-col :span="6">
                        <el-form-item
                                :prop="'timePeriod.' + index + '.etime'"
                                :rules="[
                        { required: true, message: '请输入结束时间', trigger: 'blur' }
                        ]"
                        >
                            <el-time-select
                                    v-model="item.etime"
                                    :picker-options="{
                                        start: '08:00',
                                        step: '00:15',
                                        end: '22:00'
                                      }"
                                    placeholder="选择时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        &nbsp;
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                                :prop="'timePeriod.' + index + '.numberPeople'"
                                :rules="[
                        { required: true, message: '请输入接待人数', trigger: 'blur' },
                        { type:'number', message: '请输入数字', trigger: 'blur' }
                        ]"
                        >
                            <el-input placeholder="接待人数" v-model.number="item.numberPeople"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="text-align:center"><el-button icon="el-icon-remove-outline" @click="removeList(item)">删除</el-button></el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('timer')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {submitTimer,getTimeDetail} from '@/api/goods'
    import {mapGetters} from 'vuex'
    export default {
        name: "creatTime",
        data(){
            return {
                timer:{
                    store_id:"",
                    groupName:"",
                    timeBlock_id:0,
                    timePeriod:[
                        {
                            stime:"",
                            etime:"",
                            numberPeople:"",
                            sort_no:"99"
                        }
                    ]
                }
            }
        },
        props:{
            isEdit:{
                type:Boolean
            },
        },
        computed:{
            ...mapGetters([
                'storeid',
            ])
        },
        mounted(){
            if(this.isEdit){
                this.timer.timeBlock_id=this.$route.params.id;
                this.fetchData({timeBlockId:this.$route.params.id});
            }
        },
        methods:{
            fetchData(data){
                getTimeDetail(data).then(res=>{
                    if(res.Success){
                        this.timer.groupName=res.Data.groupName;
                        this.timer.store_id=res.Data.groupName;
                        var arr=[];
                        for(var i=0;i<res.Data.timePeriod.length;i++){
                            arr.push({
                                stime:res.Data.timePeriod[i].stime,
                                etime:res.Data.timePeriod[i].etime,
                                numberPeople:parseInt(res.Data.timePeriod[i].numberPeople),
                                sort_no:"99"
                            })
                        }
                        this.timer.timePeriod=arr;
                    }
                })
            },
            addList(){
                this.timer.timePeriod.push({
                    stime:"",
                    etime:"",
                    numberPeople:"",
                    sort_no:"99"
                })
            },
            removeList(item){
                var index=this.timer.timePeriod.indexOf(item);
                if(index!=-1){
                    this.timer.timePeriod.splice(index,1);
                }
            },
            submit(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        this.timer.store_id=this.storeid;
                        submitTimer(this.timer).then(res=>{
                            if(res.Success){
                                this.$message({
                                    showClose:true,
                                    type:"success",
                                    message:res.Msg.message
                                })
                                this.$refs[formName].resetFields();
                                if(this.isEdit){
                                    this.$router.go(-1);
                                }

                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped >
    .box{
        width:50%;
        margin-top:80px;
    }
</style>