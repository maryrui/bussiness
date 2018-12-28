<template>
    <div>
        <goods-detail :is-edit="false" :isActive="0"></goods-detail>
    </div>
</template>

<script>
    import GoodsDetail from './goodsComponents/goodsDetail'
    export default {
        name: "creat",
        components:{
            GoodsDetail
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>