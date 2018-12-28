<template>
    <div class="login-container">
        <div class="login-form">
            <div>
                <h2>一家老小商家管理后台</h2>
            </div>
            <el-form :rules="loginRule" :model="login" ref="login">
                <el-form-item  prop="username" class="form-item-content">
                    <span class="svg-container svg-container_login">
                        <svg-icon icon-class="phone" />
                    </span>
                    <el-input v-model="login.username" autofocus></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                     <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input v-model="login.password" type="password" @keyup.enter.native="submitLogin('login')"></el-input>
                </el-form-item>
                <el-form-item  prop="usertype">
                    <el-select v-model="login.usertype" style="width:100%;" placeholder="请输入登录类型" class="typeSelect">
                        <el-option  label="商家" value="businessUser"></el-option>
                        <el-option  label="家庭教练" value="coachUser"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" :loading="loading" @click="submitLogin('login')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {validatePhone} from '@/utils/validate'
    export default {
        name: "index",
        data(){
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
                loading:false,
                login:{
                    username:"",
                    password:"",
                    usertype:"businessUser"
                },
                loginRule:{
                    username:[{required:true,validator:ValidatePhone,trigger:'change'}],
                    password:[{required:true,trigger:'blur',message:"密码是必填项，请输入密码"}],
                    usertype:[{required:true,trigger:'change',message:"登录类型是必填项，请选择登录类型"}]
                }
            }
        },
        methods:{
            submitLogin(fromName){
                this.$refs[fromName].validate((valid)=>{
                    if(valid){
                        this.loading=true;
                        this.$store.dispatch('LoginByUsername',this.login).then((res)=>{
                            this.loading=false;
                            if(res.Success){
                                this.$router.push('/home');
                            }else{
                                this.$message({
                                    showClose:true,
                                    type:'error',
                                    message:res.Msg.message
                                })
                            }

                        }).catch(()=>{
                            this.loading=false;
                        })
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg:#2d3a4b;
    .login-container{
        position:fixed;
        width:100%;
        height:100%;
        background:$bg;
        .login-form{
            width:25%;
            text-align:center;
            color:#fff;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-60%);
            .el-input{

                input{
                    height:45px;
                    color:#fff;
                    background:transparent;
                    border:1px solid rgba(255,255,255,.1)
                }
            }
        }
        .el-form-item__content{
            margin-top:15px;
            position:relative;
            .svg-container{
                position:absolute;
                top:0;
                left:11px;
                font-size:20px;
            }
            .svg-container_login{
                font-size:24px;
            }
        }
        .el-input__inner{
            padding-left:45px;
        }
        .typeSelect input{
            padding-left:10px;
        }

    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
    .login-container h2{
        margin-bottom:40px;
    }

</style>