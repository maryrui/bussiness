<template>
    <div class="createPost-container">
        <el-form :model="postForm" ref="postForm" :rules="articleRules">
            <sticky :className="'sub-navbar '+postForm.status">
                <el-dropdown trigger="click">
                    <el-button plain>{{!postForm.comment_disabled?'评论已打开':'评论已关闭'}}
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu class="no-padding" slot="dropdown">
                        <el-dropdown-item>
                            <el-radio-group style="padding: 10px;" v-model="postForm.is_discuss">
                                <el-radio :label="true">关闭评论</el-radio>
                                <el-radio :label="false">打开评论</el-radio>
                            </el-radio-group>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-select v-model="postForm.contentType" placeholder="请选择文件类型" @change="selectFileType" :disabled="isEdit">
                    <el-option label="图文" :value="1"></el-option>
                    <el-option label="视频" :value="2"></el-option>
                    <el-option label="音频" :value="3"></el-option>
                </el-select>
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                    发布
                </el-button>
                <el-button v-loading="loading" type="warning" @click="priveiw">预览</el-button>
            </sticky>
            <template>
                <div class="createPost-main-container">
                    <el-row>
                        <el-form-item label="封面：" label-width="100px" prop="imagesList">
                            <el-upload
                                class="avatar-uploader"
                                :action="baserUrl+'/api/FileApi/UploadFile'"
                                :show-file-list="false"
                                accept="image/*"
                                :on-success="handleAvatarSuccess"
                                :data="uploadData"
                                :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span style="color:#999;">建议尺寸360*360，封面大小小于2MB</span>
                        </el-form-item>
                        <el-form-item label="文件上传：" label-width="100px">
                            <el-upload
                                class="upload-demo"
                                :action="baserUrl+'/api/FileApi/UploadFile'"
                                :on-change="handleChange"
                                :accept="fileType"
                                :limit="limitNum"
                                :on-exceed="handleExceed"
                                :on-success="uploadSuccess"
                                :file-list="fileList"
                                :data="uploadData"
                                :on-remove="handleRemove"
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">视频，音频为必填项，图文可不上传</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 40px;" prop="title" label="标题：" label-width="100px">
                            <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                                标题
                            </MDinput>
                            <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
                        </el-form-item>
                    </el-row>
                    <div>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="是否显示：" label-width="100px" prop="statusName">
                                    <el-select v-model="postForm.statusName">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="排序：" label-width="80px" prop="sort_no">
                                   <el-input placeholder="请输入整数" v-model="postForm.sort_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="文章类型：" label-width="100px" label-position="right" prop="contentType_id">
                                   <el-select v-model="postForm.contentType_id">
                                       <el-option v-for="item in list" :label="item.typeName" :value="item.typeId" :key="item.typeId"></el-option>
                                   </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="margin-left:15px;">
                                <el-button icon="el-icon-circle-plus-outline" @click="$router.push('/article/typeList')">前往新增类型</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item style="margin-bottom: 40px;"  label="摘要：" prop="summarize" label-width="100px">
                                <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入摘要内容" v-model="postForm.summarize">
                                </el-input>
                                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                            </el-form-item>
                        </el-row>
                    </div>
                    <!--富文本-->
                    <div class="editor-container">
                        <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
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
    import {getTypeList,getArticleDetail,submitArticle,DelImg} from "@/api/article";

    const defaultForm = {
        moduleType:'',
        title:"",  //标题
        store_id:'',
        contentType:1,
        user_id:"",
        content:"",
        content_id:0,
        sort_no:99,
        is_discuss:false,
        contentType_id:"",
        statusName:"1",
        summarize:"",
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
                contentType_id:[],
                defaultMsg:"请输入内容",
                fileType:"image/*",
                fileList3:[],
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                dialogImageUrl:"",
                previewShow:false,
                fileList:[],
                limitNum:6, //文件限制数量
                list:[],
                validates:false,
                contentId:"",  //编辑获取url的文章id
                uploadData:{
                  moduleType:3
                },
                //验证规则
                articleRules:{
                    imagesList:[{required:true,trigger:'dbclick'}],
                    title:[{required:true,message:"标题是必填项",trigger:'dbclick'}],
                    statusName:[{required:true,trigger:'dbclick'}],
                    is_top:[{required:true,trigger:'dbclick'}],
                    contentType_id:[{required:true,trigger:'dbclick'}],
                    sort_no:[{required:true,trigger:'dbclick'}],
                }
            }
        },
        created(){
            this.getTypeLists();

        },
        mounted(){
            this.postForm.imageList=[];
            if(this.isEdit){
                this.postForm.content_id= this.$route.params.id;
                this.fetchData({contentId:this.$route.params.id,moduleType:this.moduleType});
                // this.$refs['ue'].setUEContent(this.defaultMsg,false);

            }else{
                this.postForm=Object.assign({},defaultForm);
            }
        },
        computed: {
            contentShortLength() {
                return this.postForm.summarize.length
            },
            ...mapGetters([
                'storeid',
                'userid'
            ])
        },
        methods:{
            //预览
            priveiw() {
                if (this.$refs['ue'].getUEContent().length === 0 || this.postForm.title.length === 0) {
                    this.$message({
                        message: '请填写必要的标题和内容',
                        type: 'warning'
                    })
                    return
                }
                this.postForm.content=this.$refs['ue'].getUEContent();
                this.previewShow=true;
            },
            //文件上传成功
            uploadSuccess(res){
                if(res.Data.length>0){
                    this.postForm.imageList.push(res.Data[0])
                }
            },
            //获取文章类型
            getTypeLists(){
                getTypeList({storeId:this.storeid,moduleType:this.moduleType}).then(res=>{
                    if(res.Success){
                        this.list=res.Data;
                    }
                })
            },
            //选择文件类型
            selectFileType(val){
                this.decide(val);
            },
            //判断contentType
            decide(val){
                if(val==1){
                    this.limitNum=6;
                    this.fileType="image/*";
                }
                else if(val==3){
                    this.limitNum=1;
                    this.fileType="audio/*";
                }
                else{
                    this.limitNum=1;
                    this.fileType="video/*";
                }
            },
            //编辑获取数据
            fetchData(data){
                getArticleDetail(data).then(res=>{
                    if(res.Success){
                        this.postForm.title=res.Data.title;
                        this.postForm.contentType=res.Data.contentType;
                        this.decide(this.postForm.contentType);
                        this.postForm.summarize=res.Data.summarize;
                        this.defaultMsg=res.Data.content;
                        this.postForm.is_discuss=res.Data.is_discuss;
                        this.postForm.coverImage=res.Data.coverImage.path;
                        this.dialogImageUrl=res.Data.coverImage.path;
                        this.postForm.statusName=res.Data.statusName;
                        this.postForm.sort_no=res.Data.sort_no;
                        this.postForm.contentType_id=res.Data.storeContentType.storeContentType_id;
                        var arr=res.Data.imagelist;
                        for(let i=0;i<arr.length;i++){
                            this.fileList.push({
                                'name':baseUrl+arr[i].path,
                                'url':baseUrl+arr[i].path
                            });
                            this.postForm.imageList.push(arr[i].path);
                        }
                    }
                })
            },
            //提交
            submitForm(){
                this.postForm.content=this.$refs['ue'].getUEContent();
              this.validatorArticle()
               if(this.validates){
                   sessionStorage.setItem('isEdit',this.isEdit);
                  this.postForm.store_id=this.storeid;
                  this.postForm.user_id=this.userid;
                  this.postForm.moduleType=this.moduleType;
                  this.loading=true;
                   submitArticle(this.postForm).then(res=>{
                       if(res.Success){
                           this.$message({
                               showClose:true,
                               type:"success",
                               message:res.Msg.message
                           })
                           this.loading=false;
                           this.fileList=[];
                           this.postForm.imageList=[];
                           this.postForm.content='';
                           this.postForm.summarize='';
                           this.postForm.coverImage='';
                           this.postForm.coverImage='';
                           this.postForm.contentType_id='';
                           this.dialogImageUrl='';
                           this.postForm.title='';
                           this.$refs.ue.setUEContent('');
                           // this.postForm=Object.assign({},defaultForm);
                           if(this.isEdit){
                               this.$router.go(-1);
                           }
                       }
                   })
               }
            },
            //验证规则
            validatorArticle(){
                if(this.postForm.title.length===0){
                    this.$message({
                        showClose:true,
                        message:"标题为必填项",
                        type:'error'
                    })
                    return ;
                }
                if(!this.postForm.contentType_id){
                    this.$message({
                        showClose:true,
                        message:"文章类型不能为空",
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
                if(this.postForm.contentType!=1&&this.postForm.imageList.length===0){
                    this.$message({
                        showClose:true,
                        message:"文件不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(!this.postForm.coverImage){
                    this.$message({
                        showClose:true,
                        message:"封面图不能为空",
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
                this.validates=true;
            },
            //上传图片
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

            //文件上传
            handleChange(file,fileList){
                console.log(file,fileList)
            },

            //封面图片
            handleAvatarSuccess(res){
                this.postForm.coverImage=res.Data[0];
                this.dialogImageUrl=res.Data[0];
            },
            //文件上传错误处理
            handleExceed(files,fileList){
                this.$message.warning(`当前限制选择 ${this.limitNum}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            //封面上传之前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传封面图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传封面图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
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
