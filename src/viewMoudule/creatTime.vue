<template>
    <div>
        <time-detail :is-edit="false"></time-detail>
    </div>
</template>

<script>
    import TimeDetail from './goodsComponents/timeDetail'
    export default {
        name: "timeCreat",
        components:{
            TimeDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>