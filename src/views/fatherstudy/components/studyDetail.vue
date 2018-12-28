<template>
    <div class="createPost-container">
        <el-form :model="postForm" ref="postForm" :rules="studyRules">
            <sticky :className="'sub-navbar '+postForm.status">
                <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                    发布
                </el-button>
            </sticky>
            <template>
                <div class="createPost-main-container">
                    <el-row>
                        <el-form-item label="封面：" label-width="100px" prop="imagesList">
                            <el-upload
                                class="avatar-uploader"
                                :action="baseUrl+'/api/FileApi/UploadFile'"
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
                        <el-form-item style="margin-bottom: 40px;" prop="title" label="内容标题：" label-width="100px">
                            <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                                请输入标题
                            </MDinput>
                            <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
                        </el-form-item>
                    </el-row>
                    <div>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="内容类型：" label-width="100px" prop="coursesType">
                                    <el-select v-model="postForm.coursesType" :disabled="isEdit">
                                        <el-option label="课程" value="2"></el-option>
                                        <el-option label="专辑" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="所属模块：" label-width="100px" prop="fcModuleType">
                                    <el-select v-model="postForm.fcModuleType">
                                        <el-option label="居家学院" :value="1"></el-option>
                                        <el-option label="公开课" :value="2"></el-option>
                                        <el-option label="情绪魔法师" :value="3"></el-option>
                                        <el-option label="听世界" :value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="4" >
                                <el-form-item label="内容小类：" label-width="100px" label-position="right" prop="coursesType">
                                    <el-cascader
                                        :options="options"
                                        v-model="litterClass"
                                        :disabled="!postForm.coursesType"
                                        >
                                    </el-cascader>
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="4">
                                <el-form-item label="作者：" label-width="100px" prop="author">
                                    <el-input v-model="postForm.author"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="积分：" label-width="100px" prop="integral">
                                    <el-input v-model="postForm.integral"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="支付方式：" label-width="100px" prop="consumptionType">
                                    <el-select v-model="postForm.consumptionType" @change="selectMoneyType">
                                        <el-option label="金钱" value="money"></el-option>
                                        <el-option label="积分" value="integral"></el-option>
                                        <el-option label="免费" value="free"></el-option>
                                        <el-option label="积分抵扣" value="moneyAndIntegral"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="学习次数：" label-width="100px" prop="totalNumber">
                                    <el-input v-model="postForm.totalNumber" placeholder="请输入需要学习的次数" :disabled="postForm.consumptionType=='free'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="价格：" label-width="100px" prop="price">
                                    <el-input v-model="postForm.price" :disabled="postForm.consumptionType=='free'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="折扣：" label-width="100px" prop="discount">
                                    <el-input v-model="postForm.discount" placeholder="1为不打折"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5" >
                                <el-form-item label="是否显示：" label-width="100px" prop="statusName">
                                    <el-select v-model="postForm.statusName">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4">
                                <el-form-item label="标签：" label-width="100px">
                                    <el-input v-model="postForm.keydes"></el-input>
                                </el-form-item>
                            </el-col>
                           <!-- <el-col :span="4">
                                <el-form-item label="会员是否免费：" label-width="150px">
                                    <el-switch
                                            v-model="postForm.vip_label"
                                            active-text="是"
                                            inactive-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-col>-->
                        </el-row>
                        <el-form-item label="附件上传：" label-width="100px">
                            <template>
                                <el-button icon="el-icon-circle-plus-outline" @click="addBtn">新增</el-button><span style="color:#ff5044;margin-left:5px;"><i class="el-icon-warning"></i>已上传的文件，切换内容类型会清空数据，请谨慎操作</span>
                                <el-form style="margin-top:15px;" :rules="studyRules">
                                    <el-form-item v-for="(item,index) in accessory" :key="index">
                                        <el-row style="margin-top:15px">
                                            <el-col :span="6">
                                                <el-form-item label="附件标题：" label-width="110px" prop="content">
                                                    <el-input placeholder="请输入附件标题" v-model="item.title"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2" style="text-align:center">
                                                <el-form-item>
                                                    <el-upload
                                                        ref="upload-fu"
                                                        :action="baseUrl+'/api/FileApi/UploadFile'"
                                                        :on-change="fhandleChange"
                                                        accept="video/*||audio/*"
                                                        :limit="1"
                                                        :on-exceed="handleExceed"
                                                        :on-success="fuploadSuccess"
                                                        :data="uploadData"
                                                        :file-list="fileList[index]"
                                                        :disabled="!postForm.coursesType"
                                                        :before-upload="uploadBefore"
                                                        :on-remove="handleRemove"
                                                    >
                                                        <el-button type="primary" @click="getIndex(index)" :disabled="!postForm.coursesType">点击上传</el-button>
                                                    </el-upload>

                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="3">
                                                <el-form-item label="时长（秒）：" label-width="110px" prop="content">
                                                    <el-input placeholder="请输入时长" v-model="item.duration"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2" style="text-align:center">
                                                <el-button icon="el-icon-remove-outline" @click="removeBtn(index)">删除</el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-form-item label="附件内容：" label-width="110px" style="margin-top:15px">
                                                <el-input type="textarea" v-model="item.content" placeholder="请输入附件内容"></el-input>
                                            </el-form-item>
                                        </el-row>
                                    </el-form-item>

                                </el-form>
                            </template>
                        </el-form-item>
                        <el-row>
                            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="内容介绍：" prop="content">
                                <el-input type="textarea" class="article-textarea" rows="4" autosize placeholder="请输入摘要内容" v-model="postForm.content" resize="none">
                                </el-input>
                                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item style="margin-bottom: 40px;" label-width="100px" label="适用人群：" prop="practicalPeople">
                                <el-input type="textarea" class="article-textarea" rows="4" autosize placeholder="请输入适用人群" v-model="postForm.practicalPeople" resize="none">
                                </el-input>
                                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="购买须知："  label-width="100px" prop="purchaseNotes">
                                <el-input type="textarea" rows="4" placeholder="请输入购买须知" v-model="postForm.purchaseNotes" resize="none">
                                </el-input>
                            </el-form-item>
                        </el-row>
                    </div>
                </div>
            </template>
        </el-form>
        <video style="display:none;" controls="controls" id="aa"></video>>
    </div>
</template>

<script>
    import Sticky from '@/components/Sticky' // 粘性header组件
    import {baseUrl} from "../../../utils/env";
    import MDinput from '@/components/MDinput'
    import {mapGetters} from 'vuex'
    import {submit,getDetail,getCategory} from "@/api/fatherstudy";

    const defaultForm = {
        moduleType:'',
        title:"",  //标题
        fcModuleType:"",// 模块
        author:'',
        price:0,
        purchaseNotes:"",  //购买须知
        userId:"",
        content:"",
        statusName:"1",
        keydes:"",   //标签
        coursesType:"",  //2课程 3 专辑
        classify_id:0,  //小类
        practicalPeople:"",   //适用人群
        totalNumber:0,  //需要学习次数
        integral:0,   //积分
        article_source:"原创",
        coursesId:0,  //课程id
        discount:1,   //折扣
        consumptionType:"" ,   //付款方式
        coverImage:"",  //封面
        consumptionDetails:[]
    }
    export default {
        name: "studyDetail",
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
                fileType:"image/*",
                baseUrl:baseUrl,
                dialogImageUrl:"",
                validates:false,
                currentIndex:"",
                flag:true,  //给上传视频格式做判断
                fileList:[],
                options:[],  //内容小类
                // litterClass:[],
                uploadData:{
                    moduleType:1
                },
                accessory:[
                    {
                        title:"",
                        content:"",
                        path:"",
                        duration:""
                    }
                ],
                //验证规则
                studyRules:{
                    imagesList:[{required:true}],
                    title:[{required:true,message:"标题是必填项",trigger:'dbclick'}],
                    statusName:[{required:true,trigger:'dbclick'}],
                    is_top:[{required:true,trigger:'dbclick'}],
                    contentType_id:[{required:true,trigger:'dbclick'}],
                    sort_no:[{required:true,trigger:'dbclick'}],
                    price:[{required:true,trigger:'dbclick'}],
                    coursesId:[{required:true,trigger:'dbclick'}],
                    discount:[{required:true,trigger:'dbclick'}],
                    consumptionType:[{required:true,trigger:'dbclick'}],
                    totalNumber:[{required:true,trigger:'dbclick'}],
                    content:[{required:true,trigger:'dbclick'}],
                    practicalPeople:[{required:true,trigger:'dbclick'}],
                    purchaseNotes:[{required:true,trigger:'dbclick'}],
                    coursesType:[{required:true,trigger:'dbclick'}],
                    integral:[{required:true,trigger:'dbclick'}],
                    author:[{required:true,trigger:'dbclick'}],
                    fcModuleType:[{required:true,trigger:'dbclick'}],
                }
            }
        },
        created(){

        },
        mounted(){
            this.postForm.imageList=[];
            defaultForm.author=this.name;
            if(this.isEdit){
                this.postForm.coursesId= this.$route.params.id;
                this.fetchData({coursesId:this.$route.params.id,userId:this.userid});
            }else{
                this.postForm=Object.assign({},defaultForm);
            }
        },
        computed: {
            contentShortLength() {
                return
            },
            ...mapGetters([
                'userid',
                'name'
            ])
        },
        methods:{
            //动态改变获取小类
            getTypeLists(){
                getCategory({contentTypeEnum:this.postForm.coursesType}).then(res=>{
                    if(res.Success){
                        var arr=[];
                        if(res.Data.length==0){
                            return ;
                        }
                        for(var i=0;i<res.Data.length;i++){
                            if(res.Data[i].classifys==0){
                                arr.push({
                                    value:res.Data[i].classify_id,
                                    label:res.Data[i].classifyName,
                                })
                            }else{
                                arr.push({
                                    value:res.Data[i].classify_id,
                                    label:res.Data[i].classifyName,
                                    children:[]
                                })
                                for(var j=0;j<res.Data[i].classifys.length;j++){
                                    arr[i].children.push({
                                        value:res.Data[i].classifys[j].classify_id,
                                        label:res.Data[i].classifys[j].classifyName,
                                    })
                                }
                            }
                        }
                        console.log(arr);
                        this.options=arr;
                    }
                })
            },

            //获取详情
            fetchData(data){
                getDetail(data).then(res=>{
                    if(res.Success){
                        this.postForm.title=res.Data.title;
                        this.postForm.content=res.Data.content;
                        this.postForm.coursesType=res.Data.coursesType+'';
                        this.purchaseNotes=res.Data.purchaseNotes;
                        this.postForm.score=res.Data.score;
                        this.postForm.studyNumber=res.Data.studyNumber;
                        this.postForm.price=res.Data.price;
                        this.postForm.price=res.Data.price;
                        this.postForm.author=res.Data.author;
                        this.postForm.fcModuleType=res.Data.fcModuleType;
                       /* this.getTypeLists();
                        if(res.Data.classify.fid!=1000){
                            this.litterClass=[res.Data.classify.fid,res.Data.classify.classify_id]
                        }else{
                            this.litterClass=[res.Data.classify.classify_id]
                        }*/

                        this.postForm.practicalPeople=res.Data.practicalPeople;
                        this.postForm.purchaseNotes=res.Data.purchaseNotes;
                        this.postForm.consumptionType=res.Data.consumptionType;
                        this.postForm.keydes=res.Data.keydes;
                        this.postForm.coverImage=res.Data.image.path;
                        this.dialogImageUrl=res.Data.image.path;
                        this.postForm.statusName=res.Data.statusName;
                        var arr=res.Data.consumptionDetails;
                        var arr1=[];
                        var arr2=[];
                        for(let i=0;i<arr.length;i++){
                            arr1.push({
                                'path':arr[i].file.path,
                                'content':arr[i].content,
                                'title':arr[i].title,
                                'duration':arr[i].duration,

                            });
                            arr2.push([{
                                url:arr[i].file.path,
                                uid:arr[i].file.path,
                                name:arr[i].file.path
                            }])
                        }
                        this.fileList=arr2;
                        this.accessory=arr1;

                    }
                })
            },
            //提交数据
            submitForm(){
                this.validatorArticle();
                if(this.validates){
                    this.postForm.userId=this.userid;
                    this.postForm.moduleType=this.moduleType;
                   /* if(this.litterClass.length>1){
                        this.postForm.classify_id=this.litterClass[1];
                    }else{
                        this.postForm.classify_id=this.litterClass[0];
                    }*/

                    this.postForm.consumptionDetails=this.accessory;
                    submit(this.postForm).then(res=>{
                        if(res.Success){
                            this.$message({
                                showClose:true,
                                type:"success",
                                message:res.Msg.message
                            })
                            this.postForm=Object.assign({},defaultForm);
                            this.dialogImageUrl='';
                            // this.litterClass=[];
                            this.accessory=[{
                                    title:"",
                                    content:"",
                                    path:"",
                                    duration:""
                                }]
                            this.fileList=[[]];
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
                if(!this.postForm.coursesType){
                    this.$message({
                        showClose:true,
                        message:"内容类型不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.content.length===0){
                    this.$message({
                        showClose:true,
                        message:"课程介绍为必填项",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                if(this.postForm.purchaseNotes.length===0){
                    this.$message({
                        showClose:true,
                        message:"购买须知不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                if(this.postForm.practicalPeople.length===0){
                    this.$message({
                        showClose:true,
                        message:"适用人群不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                if(!this.postForm.consumptionType){
                    this.$message({
                        showClose:true,
                        message:"支付方式不能为空",
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
                if(this.accessory.length==0){
                    this.$message({
                        showClose:true,
                        message:"附件内容不能为空，必须至少新增一个",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
               /* if(this.litterClass.length==0){
                    this.$message({
                        showClose:true,
                        message:"内容小类不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }*/
                if(!this.postForm.fcModuleType){
                    this.$message({
                        showClose:true,
                        message:"所属模块不能为空",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }
                for(var i=0;i<this.accessory.length;i++){
                    if(!this.accessory[i].title||!this.accessory[i].path){
                        this.$message({
                            showClose:true,
                            message:"附件标题、文件，不能为空",
                            type:"error"
                        })
                        this.validates=false;
                        return ;
                    }
                }

                if(!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(this.postForm.price)){
                    this.$message({
                        showClose:true,
                        message:"价格请输入一个整数数字或者两位小数",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                if(!(/^([1-9]\d*|[0]{1,1})$/.test(this.postForm.integral))){
                    this.$message({
                        showClose:true,
                        message:"积分请输入一个整数数字",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                if(this.postForm.consumptionType!=3&&!(/^([1-9]\d*|[0]{1,1})$/.test(this.postForm.totalNumber))){
                    this.$message({
                        showClose:true,
                        message:"需要学习总数请输入一个整数数字",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                if(!(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(this.postForm.discount))){
                    this.$message({
                        showClose:true,
                        message:"折扣请输入一个整数数字",
                        type:"error"
                    })
                    this.validates=false;
                    return ;
                }

                this.validates=true;
            },
            //附件文件删除
            handleRemove(file) {
                var url=file.path;
                console.log(file);
                for(var i=0;i<this.accessory.length;i++){
                    if(this.accessory[i].path==url){
                        this.accessory.splice(i,1);
                    }
                }
                console.log(this.accessory);
            },

           /* //删除前
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },*/

            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
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
            //课程上传错误处理
            handleExceed(files,fileList){
                console.log(files);
            },
            //附件添加按钮
            addBtn(){
                for(var i=0;i<this.accessory.length;i++){
                    if(!this.accessory[i].path){
                        this.$message({
                            showClose:true,
                            message:"点击新增前请先上传当前的附件文件",
                            type:"error"
                        })
                        this.validates=false;
                        return ;
                    }
                }
                this. accessory.push({
                    title:"",
                    content:"",
                    path:"",
                    duration:""
                })
            },
            //附件删除按钮
            removeBtn(index){
                this.accessory.splice(index,1);
                this.fileList.splice(index,1);
                this.$refs['upload-fu'][index].abort();

            },
            //附件change
            fhandleChange(files){
                var ele= document.getElementById("aa");
                var video = files.raw;
                var url = URL.createObjectURL(video);
                ele.src = url;
                setTimeout(()=>{
                    this.accessory[this.currentIndex].duration=ele.duration ? parseInt(ele.duration) : 0;
                },800)

            },
            //附件上传成功函数
            fuploadSuccess(res){
                if(res.Success){
                    this.accessory[this.currentIndex].path=res.Data[0];
                }
            },
            //附件上传之前钩子
            uploadBefore(files){
               if(files.type){
                   if(files.type!='video/mp4'&&this.postForm.coursesType==2){
                       this.$message({
                           showClose:true,
                           type:'error',
                           message:'选择内容类型为课程，必须上传MP4格式'
                       })
                       this.accessory[this.currentIndex].duration='';
                       return false;
                   }
                   else if(files.type!='audio/mp3'&&this.postForm.coursesType==3){
                       this.$message({
                           showClose:true,
                           type:'error',
                           message:'选择内容类型为课程，必须上传MP3格式'
                       })
                       this.accessory[this.currentIndex].duration='';
                       return false;
                   }
               }
            },
            //附件点击上传按钮
            getIndex(index){
              this.currentIndex=index;
            },

            //切换大类获取小类
            getLitterClass(){
                this.litterClass=[];
                this.accessory=[
                    {
                        title:"",
                        content:"",
                        path:"",
                        duration:""
                    }
                ]
                this.fileList=[];
                // this.$refs.upload.clearFiles()
                console.log(this.$refs['upload-fu'])
                // this.$refs['upload-fu'].clearFiles();
                for(var i=0;i<this.$refs['upload-fu'].length;i++){
                    this.$refs['upload-fu'][i].clearFiles()
                }

                this.getTypeLists();
            },
            //改变消费方式,需要学习次数就为0
            selectMoneyType(){
                if(this.postForm.consumptionType=='free'){
                     this.postForm.totalNumber=0;
                     this.postForm.price=0;
                }
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

