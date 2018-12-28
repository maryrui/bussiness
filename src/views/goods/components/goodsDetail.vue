<template>
    <div class="createPost-container">
        <el-form :model="postForm" ref="postForm" :rules="goodsRules">
            <sticky :className="'sub-navbar '+postForm.status">
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                    发布
                </el-button>
                <el-button v-loading="loading" type="warning" @click="priveiw">预览</el-button>
            </sticky>
            <template>
                <div class="createPost-main-container">
                    <el-row>
                        <el-form-item label="封面：" label-width="100px" prop="coverImage">
                            <el-upload
                                class="avatar-uploader"
                                :action="baserUrl+'/api/FileApi/UploadFile'"
                                :show-file-list="false"
                                accept="image/*"
                                :on-success="handleAvatarSuccess"
                                :data="uploadData"
                                :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="dialogCoverImageUrl" :src="dialogCoverImageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span style="color:#999;">建议尺寸360*360，封面大小小于2MB</span>
                        </el-form-item>
                        <el-form-item label="相册：" label-width="100px" prop="imagesList">
                            <el-upload
                                    :action="baserUrl+'/api/FileApi/UploadFile'"
                                    list-type="picture-card"
                                    accept="image/*"
                                    :on-preview="handlePictureCardPreview"
                                    :limit='6'
                                    :file-list="fileList"
                                    :on-success="uploadSuccess"
                                    :on-remove="handleRemove"
                                    :before-upload="beforeAvatarUpload"
                                    :data="uploadData"
                                >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                            <span style="color:#999;">建议尺寸1125*600，封面大小小于2MB</span>
                        </el-form-item>
                    </el-row>
                    <div>
                        <el-row>
                            <el-col :span="4" >
                                <el-form-item label="是否上架：" label-width="100px" prop="is_enable">
                                    <el-select v-model="postForm.is_enable">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="排序：" label-width="100px" prop="sort_no">
                                    <el-input placeholder="请输入整数" v-model="postForm.sort_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="活动类型：" label-width="100px" label-position="right" prop="storeActivityType_id">
                                    <el-select v-model="postForm.storeActivityType_id">
                                        <el-option v-for="(item,index) in list" :label="item.typeName" :value="item.typeId" :key="item.typeId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="margin-left:15px;">
                                <el-button icon="el-icon-circle-plus-outline" @click="$router.push('/goods/typeList')">前往新增类型</el-button>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="活动时间：" label-width="100px" label-position="right" prop="etime">
                                    <el-date-picker
                                        v-model="selectTime"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4" >
                                <el-form-item label="时间轴：" label-width="100px" label-position="right" prop="timeBlock_id">
                                    <el-select v-model="postForm.timeBlock_id">
                                        <el-option label="" v-for="(item,index) in dataList" :label="item.groupName"  :value="item.timeBlock_id" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" >
                                <el-form-item>
                                    <i class="el-icon-circle-plus-outline creatTimeBtn" @click="$router.push('/goods/creatTime')">创建时间轴</i>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" >
                                <el-form-item>
                                    <el-button type="primary" size="mini" :disabled="!postForm.timeBlock_id" @click="getTimeDetailOne">查看当前时间轴详情</el-button>
                                    <el-dialog title="时间轴详情" :visible.sync="dialogFormVisible">
                                        <h2>{{gridData.groupName}}</h2>
                                        <el-table :data="gridData.timePeriod">
                                            <el-table-column type="index"  width="150"></el-table-column>
                                            <el-table-column property="stime" label="开始时间" width="200"></el-table-column>
                                            <el-table-column property="etime" label="结束时间"></el-table-column>
                                        </el-table>
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="活动标题：" prop="title">
                                <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入标题" v-model="postForm.title">
                                </el-input>
                            </el-form-item>
                        </el-row>
                    </div>
                    <!--富文本-->
                    <div class="editor-container">
                        <UE :defaultMsg=defaultMsg :config=config ref="ue1"></UE>
                    </div>
                </div>
            </template>
        </el-form>
        <div class="mask" v-show="previewShow">
            <div class="preview_box">
                <div class="preview_content">
                    <i class="close" @click="previewShow=false">X</i>
                    <p class="nav_status"><img src="../../../../static/img/statusbar.png" alt=""></p>
                    <p class="preview_nav">
                        <span class="svg-container">
                            <svg-icon icon-class="back" />
                        </span>
                        <span class="svg-container">
                            <svg-icon icon-class="more" />
                        </span>
                    </p>
                    <div class="content">
                        <h2 class="preview_title">{{postForm.title}}</h2>
                        <div v-html="postForm.content">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sticky from '@/components/Sticky' // 粘性header组件
    import {baseUrl} from "../../../utils/env";
    import MDinput from '@/components/MDinput'
    import UE from '@/components/ue'
    import {mapGetters} from 'vuex'
    import {getTimerList,getActiveType,creatActive,getDetail,getTimeDetail} from "@/api/goods";

    const defaultForm = {
        title:"",  //标题
        store_id:'',
        content:"",
        activityguidelines:"100",
        storeActivity_id:'0',
        stime:"",
        etime:"",
        sort_no:"99",
        storeActivityType_id:"",
        is_enable:"1",
        timeBlock_id:"",
        coverImage:"",
        imageList:[]
    }
    export default {
        name: "articleDetail",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            moduleType:{
                type:Number,
                default:0
            },
            isActive:{
                type:Number,
                default:0
            }
        },
        components:{
            Sticky,
            MDinput,
            UE
        },
        data(){
            const validateRequire = (rule, value, callback) => {
                if (value === '') {
                    this.$message({
                        message: rule.field + '为必传项',
                        type: 'error'
                    })
                    callback(null)
                } else {
                    callback()
                }
            }
            return {
                postForm:Object.assign({},defaultForm),
                loading:false,
                dialogVisible:false,
                baserUrl:baseUrl,
                selectTime:[],
                defaultMsg:"请输入内容",
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                dataList:[],
                dialogImageUrl:"",
                dialogCoverImageUrl:"",// 封面
                previewShow:false,
                fileList:[],
                list:[],
                validates:false,
                contentId:"",  //编辑获取url的文章id
                dialogFormVisible:false, //时间轴详情
                gridData:[],
                uploadData:{
                    moduleType:6
                },
                //验证规则
                goodsRules:{
                    coverImage:[{required:true,trigger:'dbclick'}],
                    title:[{required:true,message:"标题是必填项"}],
                    etime:[{required:true,trigger:'dbclick'}],
                    sort_no:[{required:true,trigger:'dbclick'}],
                    is_enable:[{required:true,trigger:'dbclick'}],
                    timeBlock_id:[{required:true,trigger:'dbclick'}],
                    storeActivityType_id:[{required:true,trigger:'dbclick'}],

                }
            }
        },
        created(){
            this.getTypeLists();
            this.getTimeList();

        },
        mounted(){
            this.postForm.imageList=[];
            if(this.isEdit){
                this.postForm.storeActivity_id= this.$route.params.id;
                this.fetchData({storeActivityId:this.$route.params.id});
            }else{
                this.postForm=Object.assign({},defaultForm);
            }
        },
        computed: {
            ...mapGetters([
                'storeid',
                'userid'
            ])
        },
        methods:{
            //预览按钮
            priveiw() {
                if (this.$refs['ue1'].getUEContent().length === 0 || this.postForm.title.length === 0) {
                    this.$message({
                        message: '请填写必要的标题和内容',
                        type: 'warning'
                    })
                    return
                }
                this.postForm.content=this.$refs['ue1'].getUEContent();
                this.previewShow=true;
            },
            //上传成功
            uploadSuccess(res){
                if(res.Data.length>0){
                    this.postForm.imageList.push(res.Data[0])
                }
            },
            //获取文章类型
            getTypeLists(){
                getActiveType({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        this.list=res.Data;
                    }
                })
            },
            //获取时间轴
            getTimeList(){
                getTimerList({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        this.dataList=res.Data;
                    }
                })
            },
            //获取数据
            fetchData(data){
                getDetail(data).then(res=>{
                    if(res.Success){
                        this.postForm.title=res.Data.title;
                        this.postForm.content=res.Data.content;
                        this.postForm.sort_no=res.Data.sort_no;
                        this.postForm.timeBlock_id=res.Data.timeBlock ? parseInt(res.Data.timeBlock.timeBlock_id) : '';
                        this.defaultMsg=res.Data.content;
                        var sy=new Date(res.Data.stime).getFullYear();
                        var sm=new Date(res.Data.stime).getMonth()+1;
                        var sd=new Date(res.Data.stime).getDate();
                        var ey=new Date(res.Data.etime).getFullYear();
                        var em=new Date(res.Data.etime).getMonth()+1;
                        var ed=new Date(res.Data.etime).getDate();
                        this.selectTime=[new Date(sy,sm,sd,0,0),new Date(ey,em,ed,0,0)];
                        this.postForm.storeActivityType_id=parseInt(res.Data.storeActivityType_id);
                        var arr=res.Data.imagelist;
                       this.postForm.coverImage=res.Data.coverImage.path;
                       this.dialogCoverImageUrl=res.Data.coverImage.path;
                        for(let i=0;i<arr.length;i++){
                            this.fileList.push({
                                'name':arr[i].file_id,
                                'url':arr[i].path
                            });
                            this.postForm.imageList.push(arr[i].path);
                        }
                    }
                })
            },
            //提交
            submitForm(){
                this.postForm.content=this.$refs['ue1'].getUEContent();
                this.validatorArticle()
                if(this.validates){
                    this.postForm.store_id=this.storeid;
                    this.postForm.user_id=this.userid;
                    this.postForm.stime=this.selectTime[0];
                    this.postForm.etime=this.selectTime[1];
                    creatActive(this.postForm).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                type:"success",
                                message:res.Msg.message
                            })
                            this.fileList=[];
                            this.dialogCoverImageUrl='';
                            this.selectTime=[];
                            this.$refs['ue1'].setUEContent('',false);
                            this.postForm=Object.assign({},defaultForm);
                            if(this.isEdit){
                                this.$router.go(-1);
                            }
                        }
                    })
                }
            },
            //验证
            validatorArticle(){
                if(this.postForm.title.length===0){
                    this.$message({
                        showClose:true,
                        message:"标题为必填项",
                        type:'error'
                    })
                    return ;
                }
                if(!this.postForm.storeActivityType_id){
                    this.$message({
                        showClose:true,
                        message:"活动类型不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.content.length===0){
                    this.$message({
                        showClose:true,
                        message:"内容为必填项",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(!this.postForm.coverImage){
                    this.$message({
                        showClose:true,
                        message:"封面为必填项",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(!(/^([1-9]\d*|[0]{1,1})$/.test(this.postForm.sort_no))){
                    this.$message({
                        showClose:true,
                        message:"排序请输入一个整数数字",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(!this.selectTime){
                    this.$message({
                        showClose:true,
                        message:"活动时间不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                this.validates=true;
            },
            //删除图片
            handleRemove(file,filelist) {
                var url="";
                if(file.response){
                    url=file.response.Data.join('');
                }else{
                    url=file.url.replace(baseUrl,'');
                }
                for(var i=0;i<this.postForm.imageList.length;i++){
                    if(this.postForm.imageList[i]==url){
                        this.postForm.imageList.splice(i,1);
                    }
                }
            },
            //图片展示
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //点击查看时间轴按钮
            getTimeDetailOne(){
                this.dialogFormVisible=true;
                getTimeDetail({timeBlockId:this.postForm.timeBlock_id}).then(res=>{
                    this.gridData=res.Data;
                })
            },
            //封面上传之前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //上传封面
            //上传图片
            handleAvatarSuccess(res){
                this.postForm.coverImage=res.Data[0];
                this.dialogCoverImageUrl=res.Data[0];
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .createPost-main-container{
        padding:25px 30px 25px;
        .word-counter {
            width: 40px;
            position: absolute;
            right: -10px;
            top: 0px;
        }
    }
    .creatTimeBtn{
        font-size:16px;
        color:#409EFF;
        cursor:pointer;
        margin-left:15px;
    }
    .creatTimeBtn:hover{
        color:#ff5044;
    }
    .mask{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.3);
        z-index:1000;
        .preview_box{
            width:750px;
            margin:0 auto;
            background:#fff;
            height:100%;
        }
        .preview_content{
            border-top:1px solid transparent;
            position:relative;
            .close{
                position:absolute;
                top:40px;
                right:-50px;
                color:#fff;
                font-size:24px;
                font-weight:500;
                cursor:pointer;
                font-style:normal;
                display: inline-block;
                border:2px solid #e7e7e7;
                width:36px;
                height:36px;
                border-radius:50%;
                text-align:Center;
                line-height:36px;

            }
            .nav_status{
                margin:10px 30px ;
                img{
                    width:100%;
                }
            }
            .preview_nav{
                display:flex;
                height:50px;
                padding: 0 25px;
                font-size:30px;
                justify-content: space-between;
            }
            .content{
                padding: 0 32px;
                min-height:100%;
                & img{
                    max-width:100% !important;
                }
            }
        }
    }
</style>
