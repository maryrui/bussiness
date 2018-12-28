<template>
    <div>
        <article-detail :isEdit="false" :moduleType="1"></article-detail>
    </div>
</template>

<script>
    import articleDetail from './fatherStudyComponents/studyDetail'
    export default {
        name: "created",
        components:{
            articleDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>