<template>
    <div>
        <study-detail :isEdit="true" :moduleType="1"></study-detail>
    </div>
</template>

<script>
    import studyDetail from './components/groupDetail'
    export default {
        name: "created",
        components:{
            studyDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>