<template>
    <div >
        <el-col>
            <el-form label-width="80px"  :model="postForm" ref="postForm" :rules="groupRules">
                <sticky :className="'sub-navbar '+postForm.status">
                    <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm('postForm')">
                        提交
                    </el-button>
                </sticky>
               <el-col :span="12" style="margin:25px;">
                   <el-form-item label="组别名称" prop="gradeName">
                       <el-input placeholder="请输入组别名称" v-model="postForm.gradeName"></el-input>
                   </el-form-item>
                   <el-form-item label="别称" prop="alias">
                       <el-input placeholder="请输入别称,格式为字母" v-model="postForm.alias"></el-input>
                   </el-form-item>
                   <el-form-item label="备注" prop="description">
                       <el-input placeholder="请输入备注" v-model="postForm.description"></el-input>
                   </el-form-item>
                   <el-form-item size="mini" label="授权">
                       <el-row>
                           <el-tree
                                   :default-expand-all="true"
                                   :data="data3"
                                   :leafOnly="true"
                                   show-checkbox
                                   ref="tree"
                                   node-key="id">
                           </el-tree>
                       </el-row>
                   </el-form-item>
               </el-col>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import Sticky from '@/components/Sticky' // 粘性header组件
    import {getMenuList,createGroup,getGroupDetail} from '@/api/sys'
    import {mapGetters} from 'vuex'

    const defaultPostForm={
        gradeId:0,
        status:"",
        description:"",
        alias:"",
        gradeName:"",
        storeId:"",
        userType:"1",
        perssions:"",
        sortNo:"99"
    }

    export default {
        name: "groupDetail",
        data(){
            return {
                data3: [],
                postForm:Object.assign({},defaultPostForm),
                loading:false,
                groupRules:{
                    gradeName:[{
                        required:true,message:'请先输入组别名称',trigger:'blur'
                    }],
                    alias:[{
                        required:true,message:'请先输入别称',trigger:'blur'
                    }]
                }
            }
        },
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
        },
        created(){
            this.getMenuListFn();
            if(this.isEdit){
                this.postForm.gradeId=this.$route.params.id
                this.fetchData({id:this.postForm.gradeId})
            }
        },
        mounted(){

        },
        computed:{
            ...mapGetters([
                'gradeId',
                'storeid'
            ])
        },

        components:{
            Sticky
        },
        methods:{
            //编辑获取数据
            fetchData(data){
                getGroupDetail(data).then(res=>{
                    if(res.Success){
                        this.postForm.description=res.Data.description;
                        this.postForm.gradeId=res.Data.gradeId;
                        this.postForm.alias=res.Data.alias;
                        this.postForm.gradeName=res.Data.gradeName;
                        this.postForm.perssions=res.Data.perssions ? res.Data.perssions.split('|') : [];
                        this.$refs.tree.setCheckedKeys( this.postForm.perssions);
                    }
                })
            },
            //获取menuList
            getMenuListFn(){
                getMenuList({gradeId:this.gradeId}).then(res=>{
                    if(res.Success){
                    this.data3= this.disposeData(res.Data)

                    }
                })
            },
            //数据处理
            disposeData(arr){
                var temp=[];
                if(arr.length<1){return []}
                for(var i=0;i<arr.length;i++){
                    temp.push({
                        id:arr[i].menuId,
                        label:arr[i].menuName,
                        children:this.disposeData(arr[i].children)
                    })
                }
                return temp;
            },
            //提交
            submitForm(formName){
                this.$refs[formName].validate(valid=>{
                    if(valid){
                        if(this.$refs.tree.getCheckedNodes().length<1){
                            this.$message({
                                showClose:true,
                                type:"error",
                                message:"授权不能为空"
                            })
                            return
                        }
                        console.log(this.$refs.tree.getCurrentKey());
                        this.postForm.perssions=this.$refs.tree.getCheckedKeys().join('|');
                        this.postForm.storeId=this.storeid;
                        createGroup(this.postForm).then(res=>{
                            if(res.Success){
                                this.postForm.gradeName='';
                                this.postForm.alias='';
                                this.postForm.description='';
                                this.$refs.tree.setCheckedKeys([])
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

<style scoped>
.groupBox{
    margin:25px;
}
</style>