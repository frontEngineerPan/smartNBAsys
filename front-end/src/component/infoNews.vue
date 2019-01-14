<template>
    <div id="#infoNews">
         <div v-show="isLogouted">
              你还没有登录，请先登录！
         </div>
         <div v-show="isLogined">
         </div>
    </div>
</template>
<script>
    export default{
        data:function () {
             return{
                 isLogouted:true,
                 isLogined:false
             }
        }
    }
</script>
<style>
</style>