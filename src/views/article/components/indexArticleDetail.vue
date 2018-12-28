<template>
    <div class="createPost-container">
        <el-form :model="postForm" ref="postForm" :rules="indexRules">
            <sticky :className="'sub-navbar '+postForm.status">
                <el-dropdown trigger="click">
                    <el-button plain>{{!postForm.comment_disabled?'评论已打开':'评论已关闭'}}
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                    <el-select v-model="postForm.contentType" placeholder="请选择文件类型" @change="selectFileType" :disabled="isEdit">
                        <el-option label="图文" :value="1"></el-option>
                        <el-option label="视频" :value="2"></el-option>
                        <el-option label="音频" :value="3"></el-option>
                    </el-select>
                    <el-dropdown-menu class="no-padding" slot="dropdown">
                        <el-dropdown-item>
                            <el-radio-group style="padding: 10px;" v-model="postForm.is_discuss">
                                <el-radio :label="true">关闭评论</el-radio>
                                <el-radio :label="false">打开评论</el-radio>
                            </el-radio-group>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                    发布
                </el-button>
                <el-button v-loading="loading" type="warning" @click="priveiw">预览</el-button>
            </sticky>
            <template>
                <div class="createPost-main-container">
                    <el-row>
                        <el-form-item label="封面：" label-width="120px" prop="imagesList">
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
                        <el-form-item label="文件上传：" label-width="120px">
                            <el-upload
                                class="upload-demo"
                                :action="baserUrl+'/api/FileApi/UploadFile'"
                                :accept="fileType"
                                :limit="limitNum"
                                :on-success="uploadSuccess"
                                :file-list="fileList"
                                :data="uploadData"
                                :on-remove="handleRemove"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">视频，音频为必填项，图文可不上传</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 40px;" prop="title" label="标题：" label-width="120px">
                            <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                                标题
                            </MDinput>
                            <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
                        </el-form-item>
                    </el-row>
                    <div>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="最小适合年龄：" label-width="120px" label-position="right" prop="syear">
                                    <el-col :span="11">
                                        <el-select v-model="yearForm.syear" placeholder="岁">
                                            <el-option v-for="(item,index) in yearForm.year" :value="item.value" :label="item.label" :key="item.label"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center"></el-col>
                                    <el-col :span="11">
                                        <el-select v-model="yearForm.smonth" placeholder="月">
                                            <el-option v-for="(item,index) in yearForm.month" :value="item.value" :label="item.label" :key="item.label"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="是否显示：" label-width="100px" prop="statusName">
                                    <el-select v-model="postForm.statusName">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="排序：" label-width="100px" prop="sort_no">
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
                        </el-row>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="最大适合年龄：" label-width="120px" label-position="right" prop="eyear">
                                    <el-col :span="11">
                                        <el-select v-model="yearForm.eyear" placeholder="岁">
                                            <el-option v-for="(item,index) in yearForm.year" :value="item.value" :label="item.label" :key="item.label"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="2" style="text-align:center"></el-col>
                                    <el-col :span="11">
                                        <el-select v-model="yearForm.emonth" placeholder="月">
                                            <el-option v-for="(item,index) in yearForm.month" :value="item.value" :label="item.label" :key="item.label"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="是否置顶：" label-width="100px" prop="is_top">
                                    <el-select v-model="postForm.is_top">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="是否热门：" label-width="100px" prop="is_hot">
                                    <el-select v-model="postForm.is_hot">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="是否推荐：" label-width="100px" prop="is_red">
                                    <el-select v-model="postForm.is_red">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="标签：" label-width="120px" >
                                    <el-input placeholder="请输入标签" v-model="postForm.keydes"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:" prop="summarize">
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
        content:"",
        content_id:0,
        is_top:0,
        is_hot:0,
        start_time:"",
        end_time:"",
        is_red:0,
        keydes:"",
        sort_no:99,
        is_discuss:false,
        contentType:1,
        contentType_id:"",
        statusName:"1",
        summarize:"",
        coverImage:"",
        user_id:"",
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
                limit:6,
                dialogImageUrl:"",
                defaultMsg:"",
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                fileType:"image/*",
                limitNum:6,
                previewShow:false,
                fileList:[],
                list:[],
                yearForm:{
                    year:[
                                          {
                                          label:"0岁",
                                          value:"0"
                                         },
                                          {
                                              label:"1岁",
                                              value:"1"
                                          },
                                          {
                                              label:"2岁",
                                              value:"2"
                                          },
                                          {
                                              label:"3岁",
                                              value:"3"
                                          },
                                          {
                                              label:"4岁",
                                              value:"4"
                                          },
                                          {
                                              label:"5岁",
                                              value:"5"
                                          },
                                          {
                                              label:"6岁",
                                              value:"6"
                                          },
                                      ],
                    month:[
                                            {
                                            label:"0个月",
                                            value:"0"
                                            },
                                            {
                                                label:"1个月",
                                                value:"1"
                                            },
                                            {
                                                label:"2个月",
                                                value:"2"
                                            },
                                            {
                                                label:"3个月",
                                                value:"3"
                                            },
                                            {
                                                label:"4个月",
                                                value:"4"
                                            },
                                            {
                                                label:"5个月",
                                                value:"5"
                                            },
                                            {
                                                label:"6个月",
                                                value:"6"
                                            },
                                            {
                                                label:"7个月",
                                                value:"7"
                                            },
                                            {
                                                label:"8个月",
                                                value:"8"
                                            },
                                            {
                                                label:"9个月",
                                                value:"9"
                                            },
                                            {
                                                label:"10个月",
                                                value:"10"
                                            },
                                            {
                                                label:"11个月",
                                                value:"11"
                                            }
                                        ],
                    syear:"",
                    eyear:"",
                    smonth:"",
                    emonth:""
                },
                validates:false,
                contentId:"",  //编辑获取url的文章id
                uploadData:{
                    moduleType:3
                },
                //验证规则
                indexRules:{
                    imagesList:[{required:true}],
                    title:[{required:true,message:"标题是必填项"}],
                    syear:[{required:true,trigger:'dbclick'}],
                    eyear:[{required:true,trigger:'dbclick'}],
                    statusName:[{required:true,trigger:'dbclick'}],
                    is_top:[{required:true,trigger:'dbclick'}],
                    is_red:[{required:true,trigger:'dbclick'}],
                    is_hot:[{required:true,trigger:'dbclick'}],
                    contentType_id:[{required:true,trigger:'dbclick'}],
                    sort_no:[{required:true,trigger:'dbclick'}],
                }
            }
        },
        created(){
            this.getTypeLists();
            if(this.isEdit){
                this.postForm.content_id= this.$route.params.id;
                console.log(this.$route.params)
                console.log(111)
                this.fetchData({contentId:this.$route.params.id,moduleType:this.moduleType});
            }else{
                this.postForm=Object.assign({},defaultForm);
            }

        },
        mounted(){
            this.postForm.imageList=[];
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
                        this.decide(res.Data.contentType);
                        this.postForm.summarize=res.Data.summarize;
                        this.postForm.content=res.Data.content;
                        this.postForm.is_discuss=res.Data.is_discuss;
                        this.postForm.sort_no=res.Data.sort_no;
                        this.defaultMsg=res.Data.content;
                        this.postForm.is_red=res.Data.is_red;
                        this.postForm.is_top=res.Data.is_top;
                        this.postForm.is_hot=res.Data.is_hot;
                        this.postForm.keydes=res.Data.keydes;
                        this.yearForm.syear=parseInt(res.Data.start_time/12)+'';
                        this.yearForm.eyear=parseInt(res.Data.end_time/12)+'';
                        this.yearForm.smonth=res.Data.start_time%12+'';
                        this.yearForm.emonth=res.Data.end_time%12+'';
                        this.postForm.statusName=res.Data.statusName;
                        this.postForm.start_time=res.Data.start_time;
                        this.postForm.end_time=res.Data.end_time;
                        this.postForm.contentType_id=res.Data.storeContentType.storeContentType_id;
                        this.postForm.coverImage=res.Data.coverImage.path;
                        this.dialogImageUrl=res.Data.coverImage.path;
                        var arr=res.Data.imagelist;
                        for(let i=0;i<arr.length;i++){
                            this.fileList.push({
                                'name':arr[i].filetype_name,
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
                    this.postForm.start_time=this.yearForm.syear*12+(parseInt(this.yearForm.smonth));
                    this.postForm.end_time=this.yearForm.eyear*12+(parseInt(this.yearForm.emonth));
                    submitArticle(this.postForm).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                type:"success",
                                message:res.Msg.message
                            })
                            this.fileList=[];
                            this.postForm.imageList=[];
                            this.postForm.content='';
                            this.postForm.contentType_id='';
                            this.dialogImageUrl='';
                            this.postForm.coverImage='';
                            this.postForm.summarize='';
                            this.postForm.is_hot='';
                            this.postForm.is_top='';
                            this.postForm.is_red='';
                            this.postForm.keydes='';
                            this.postForm.summarize='';
                            this.postForm.title='';
                            this.$refs['ue'].setUEContent('');
                            this.yearForm.smonth='';
                            this.yearForm.emonth='';
                            this.yearForm.syear='';
                            this.yearForm.eyear='';
                            // this.postForm=Object.assign({},defaultForm);
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
                if(!this.postForm.coverImage){
                    this.$message({
                        showClose:true,
                        message:"请上传封面图",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.contentType!=1&&this.postForm.imageList.length===0){
                    this.$message({
                        showClose:true,
                        message:"请上传文件",
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
                if(!this.yearForm.syear||!this.yearForm.smonth){
                    this.$message({
                        showClose:true,
                        message:"最小适合年龄时间不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(!this.yearForm.eyear||!this.yearForm.emonth){
                    this.$message({
                        showClose:true,
                        message:"最大适合年龄时间不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if((this.yearForm.syear*12+parseInt(this.yearForm.smonth))>this.yearForm.eyear*12+parseInt(this.yearForm.emonth)){
                    this.$message({
                        showClose:true,
                        message:"最小适合年龄时间不能大于最大适合年龄",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.is_hot===''){
                    this.$message({
                        showClose:true,
                        message:"是否热门为必填项",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.is_top===''){
                    this.$message({
                        showClose:true,
                        message:"是否置顶为必填项",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.is_red===''){
                    this.$message({
                        showClose:true,
                        message:"是否推荐为必填项",
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
            //上传成功
            handleAvatarSuccess(res){
                this.postForm.coverImage=res.Data[0];
                this.dialogImageUrl=res.Data[0];
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
