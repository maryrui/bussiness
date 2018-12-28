<template>
    <div>
        <time-detail :is-edit="true"></time-detail>
    </div>
</template>

<script>
    import TimeDetail from './goodsComponents/timeDetail'
    export default {
        name: "timeEditor",
        components:{
            TimeDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>