<template>
    <div>
        <goods-detail :is-edit="true" :isActive="1"></goods-detail>
    </div>
</template>

<script>
    import GoodsDetail from './goodsComponents/goodsDetail'
    export default {
        name: "created",
        components:{
            GoodsDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>