<template>
    <div>
        <article-detail :isEdit="true" :moduleType="1"></article-detail>
    </div>
</template>

<script>
    import articleDetail from './fatherStudyComponents/studyDetail'
    export default {
        name: "editor",
        components:{
            articleDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>