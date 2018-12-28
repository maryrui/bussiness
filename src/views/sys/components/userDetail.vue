<template>
    <div class="userBox">
        <el-col :span="12">
            <el-form label-width="80px" :rules="userRules" :model="postForm" ref="postForm">
                <el-form-item label="头像：">
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
                </el-form-item>
                <el-form-item label="角色姓名" prop="name">
                    <el-input placeholder="请输入用户名称" v-model="postForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色昵称" prop="nikeName">
                    <el-input placeholder="请输入用户昵称" v-model="postForm.nikeName"></el-input>
                </el-form-item>
                <el-form-item label="所属组别" prop="gradeId">
                        <el-select v-model="postForm.gradeId">
                            <el-option v-for="(item,index) in groups" :label="item.gradeName" :value="item.gradeId" :key="index"></el-option>
                        </el-select>
                           <el-button icon="el-icon-circle-plus" @click="$router.push('/sys/groupCreated')">新增组别</el-button>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input placeholder="该手机号码是登录账号，一经确认不可更改" v-model="postForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="账号密码" prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="postForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPass">
                    <el-input type="password" placeholder="请再次输入密码" v-model="postForm.confirmPass"></el-input>
                </el-form-item>
                <el-form-item label="角色性别" prop="sex">
                    <el-switch
                            v-model="postForm.sex"
                            active-text="男"
                            inactive-text="女">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否禁用" prop="isEnable">
                    <el-switch
                            v-model="postForm.isEnable"
                            active-text="是"
                            inactive-text="否">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitClick('postForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utils/env";
    import {validatePhone} from "../../../utils/validate";
    import {getUserDetail,createUser,getGroupList} from "@/api/sys";
    import {mapGetters} from 'vuex'

    const defaultForm ={
        userId:0,
        phone:"",
        isEnable:true,
        name:"",
        nikeName:"",
        password:"",
        confirmPass:"",
        sex:true,
        imagePath:"",
        gradeId:"",
        userType:"businessUser"
    }
    export default {
        name: "userDetail",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.postForm.password !== '') {
                        this.$refs.postForm.validateField('confirmPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.postForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var ValidatePhone=(rule,value,callback)=>{
                if(!value){
                    return callback(new Error('手机号是必填项，不能为空'))
                }
                else if(validatePhone(value)){
                    return callback(new Error('请输入正确的手机格式'))
                }
                else{
                    callback()
                }
            }
            return {
                baseUrl:baseUrl,
                dialogImageUrl:baseUrl+"/static/img/man.png",
                uploadData:{
                    moduleType:7
                },
                postForm:Object.assign({},defaultForm),
                groups:[],

                userRules: {
                    name: [{
                        required: true, message: "请输入姓名", trigger: "blur"
                    }],
                    nikeName:[{
                        required: true, message: "请输入昵称", trigger: "blur"
                    }],
                    gradeId:[{
                        required: true, message: "请选择组别", trigger: "change"
                    }],
                    phone:[{
                        required: true, validator:ValidatePhone, trigger: "change"
                    }],
                    password:[{
                        required: true,validator:validatePass,trigger:'blur'
                    }],
                    confirmPass:[{
                        required: true,validator:validatePass2,trigger:'blur'
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
        computed:{
            ...mapGetters([
                'storeid'
            ])
        },
        created(){
            this.getGradeList();
            if(this.isEdit){
                this.postForm.userId=this.$route.params.id;
                this.fetchData({id:this.postForm.userId})
            }
        },
        methods:{
            //编辑获取详情
            fetchData(data){
                getUserDetail(data).then(res=>{
                    if(res.Success){
                        this.postForm.imagePath=res.Data.imagePath;
                        this.postForm.name=res.Data.name;
                        this.postForm.nikeName=res.Data.nikeName;
                        this.postForm.password=res.Data.password;
                        this.postForm.confirmPass=res.Data.password;
                        this.postForm.phone=res.Data.phone;
                        this.postForm.gradeId=res.Data.grade.gradeId;
                        this.postForm.isEnable=res.Data.isEnable ?  true : false;
                        this.postForm.sex=res.Data.sex ?  true : false;
                        this.dialogImageUrl=res.Data.imagePath;
                    }
                })
            },
            //头像图片
            handleAvatarSuccess(res){
                this.postForm.imagePath=res.Data[0];
                this.dialogImageUrl=res.Data[0];
            },
            //头像上传之前
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
            },
            //获取组别
            getGradeList(){
                getGroupList({storeId:this.storeid}).then(res=>{
                    if(res.Success){
                        this.groups=res.Data;
                    }
                })
            },
            //提交数据
            submitClick(formName){
                this.$refs[formName].validate(valid=>{

                    if(valid){
                        var data={
                            userId:this.postForm.userId,
                            phone:this.postForm.phone,
                            isEnable:this.postForm.isEnable ? 1 : 0,
                            name:this.postForm.name,
                            nikeName:this.postForm.nikeName,
                            password:this.postForm.password,
                            sex:this.postForm.sex ? 1 : 0,
                            imagePath:this.postForm.imagePath,
                            storeId:this.storeid,
                            gradeId:this.postForm.gradeId,
                            userType:"businessUser"
                        }
                        createUser(data).then(res=>{
                            if(res.Success){
                                this.$message({
                                    showClose:true,
                                    message:res.Msg.message,
                                    type:"success"
                                })
                                this.postForm=defaultForm;
                                if(this.isEdit){
                                    this.$router.go(-1);
                                }
                            }else{
                                this.$message({
                                    showClose:true,
                                    message:res.Msg.message,
                                    type:"error"
                                })
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
.userBox{
    margin:25px;
}
</style>