<template>
    <div>
        <article-detail :isEdit="true" :moduleType="3"></article-detail>
    </div>
</template>

<script>
    import articleDetail from './components/articleDetail'
    export default {
        name: "editor",
        components:{
            articleDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>