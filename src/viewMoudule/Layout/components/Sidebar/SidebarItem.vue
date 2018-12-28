<template>
    <div class="menu-wrapper">
        <template v-for="item in routes" v-if="!item.hidden&&item.children">
            <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="item.menuUrl+'/'+item.children[0].menuUrl"
            :key="item.children[0].menuUrl"
            >
                <el-menu-item :index="item.menuName+'/'+item.children[0].menuUrl" :class="{'submenu-title-noDropdown': !isNest}">
                    <svg-icon v-if="item.children[0]&&item.children[0].iconClassName" :icon-class="item.children[0].iconClassName"></svg-icon>
                    <span v-if="item.children[0]&&item.children[0].menuName" slot="title">{{item.children[0].menuName}}</span>
                </el-menu-item>
            </router-link>

            <el-submenu v-else :index="item.menuName||item.menuUrl" :key="item.menuUrl">
                <template slot="title">
                    <svg-icon v-if="item&&item.iconClassName" :icon-class="item.iconClassName"></svg-icon>
                    <span v-if="item&&item.menuName" slot="title">{{item.menuName}}</span>
                </template>
                <template v-for="child in item.children" v-if="!child.hidden">
                    <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
                    <router-link v-else :to="item.menuUrl+'/'+child.menuUrl" :key="child.menuUrl">
                        <el-menu-item :index="item.menuUrl+'/'+child.menuUrl">
                            <svg-icon v-if="child&&child.iconClassName" :icon-class="child.iconClassName"></svg-icon>
                            <span v-if="child&&child.menuName" slot="title">{{child.menuName}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>
    export default {
        name: "SidebarItem",
        props:{
           routes:{
               type:Array
           },
            isNest:{
               type:Boolean,
                default:false
            }
        },
        methods:{
            hasOneShowingChildren(children){
                const showingChildren = children.filter(item=>{
                    return !item.hidden
                })
                if(showingChildren.length===1){
                    return true
                }
                return false;
            }
        }
    }
</script>
