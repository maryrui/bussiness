<template>
    <div>
        <article-detail :isEdit="true" :moduleType="3"></article-detail>
    </div>
</template>

<script>
    import articleDetail from './articleComponents/articleDetail'
    export default {
        name: "editor",
        components:{
            articleDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>