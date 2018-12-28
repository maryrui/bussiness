import {loginByUsername,logout,getUserInfo} from '@/api/login'
import {getToken,removeToken,setToken,setUserId,getUserId} from "@/utils/auth"

const user={
    state:{
        name:"",
        userid:getUserId(),
        roles:[],
        storeid:"",
        phone:"",
        gradeId:"",
        token:getToken(),
        menuList:JSON.parse(sessionStorage.getItem('menuList')),
    },
    mutations:{
        SET_TOKEN:(state,token)=>{
            state.token=token
        },
        SET_NAME:(state,name)=>{
            state.name=name
        },
        SET_ROLES:(state,role)=>{
            state.roles[0]=role
        },
        SET_USERID:(state,userid)=>{
            state.userid=userid
        },
        SET_STOREID:(state,storeid)=>{
            state.storeid=storeid
        },
        SET_AVATAR:(state,avatar)=>{
            state.avatar=avatar
        },
        SET_PHONE:(state,phone)=>{
            state.phone=phone
        },
        SET_MENULIST:(state,menuList)=>{
            state.menuList=menuList
        },
        SET_GRADEID:(state,gradeId)=>{
            state.gradeId=gradeId
        }
    },
    actions:{
        LoginByUsername({commit},userInfo){
            const username=userInfo.username.trim();
            return new Promise((resolve,reject)=>{
                loginByUsername(username,userInfo.password,userInfo.usertype).then(res=>{
                    const data=res.Data;
                    commit('SET_TOKEN',data.token);
                    commit('SET_USERID',data.userId);
                    setToken(res.Data.token);
                    setUserId(res.Data.userId);
                    resolve(res)
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        GetUserInfo({commit,state}){
            return new Promise((resolve,reject)=>{
                getUserInfo(state.userid).then(res=>{
                    if(!res.Data){
                        reject('error')
                    }
                    const data =res.Data;
                   /* if(data.grade.userRole&&data.grade.userRole.length>0){
                        commit('SET_ROLES',data.grade.userRole)
                    }else{
                        reject('getInfo：roles must be a non-null array!')
                    }*/
                    commit('SET_NAME',data.name);
                    commit('SET_PHONE',data.phone);
                    commit('SET_GRADEID',data.grade.gradeId);
                    commit('SET_MENULIST',data.businessUser.perssions);
                    sessionStorage.setItem('menuList',JSON.stringify(res.Data.businessUser.perssions))
                    var arr=[];
                    for(var i=0;i<res.Data.businessUser.buttonPerssions.length;i++){
                        arr.push(res.Data.businessUser.buttonPerssions[i].menuButtons)
                    }
                    sessionStorage.setItem('perssions',JSON.stringify(arr))
                    if(res.Data.businessUser){
                        commit('SET_STOREID',res.Data.businessUser.store.store_id);
                    }
                    commit('SET_USERID',data.user_id);
                    resolve(res)
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        LogOut({commit,state}){
            return new Promise((resolve,reject)=>{
                logout(state.token).then(()=>{
                    commit('SET_TOKEN','');
                    removeToken();
                    resolve()
                })
            })
        },
        FedLogOut({commit},role){
            return new Promise(resolve=>{
                commit('SET_TOKEN', '');
                commit('menuList', '');
                removeToken();
                resolve();
            })
        }
    }
}

export default user