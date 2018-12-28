<template>
    <div>
        <article-detail :isEdit="false" :moduleType="3"></article-detail>
    </div>
</template>

<script>
    import articleDetail from './articleComponents/articleDetail'
    export default {
        name: "created",
        components:{
            articleDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>