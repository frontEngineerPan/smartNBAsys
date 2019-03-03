<template>
    <div id="#infoNews">
         <div v-show="isLogouted">
              你还没有登录，请先登录！
         </div>
         <div v-show="isLogined">
             <el-collapse v-model="activeNames" @change="handleChange" v-for="item in this.newsData" :key="item.id">
                 <el-collapse-item v-bind:title="item.title">
                     <img src="../assets/allStar.jpg">
                     <p>{{item.content}}</p>
                 </el-collapse-item>
             </el-collapse>
         </div>
    </div>
</template>
<script>
    import EM from '../EventEmitter.js'
    export default{
        data:function () {
             return{
                 index_1:1,
                 isLogouted:false,
                 isLogined:true,
                 interestLabel:{
                     mate:"科比",
                     team:"湖人",
                     coach:"沃顿"
                 },
                 newsData:[],
                 activeNames: [],
                 imgSrc:"../assets/title_images/lakers/1.jpg"
             }
        },
        mounted:function(){
            EM.on('foo', (p) => {
                this.isLogouted=false;
                this.isLogined=true;
                console.log('P '+p);
            });
             //如果明确有用户登录
             if(this.isLogouted===false&&this.isLogined===true){
                 //操作
                 var url= 'http://localhost:3000/displayDocs/'+encodeURI(this.interestLabel.mate)+'/'+encodeURI(this.interestLabel.team)+'/'+encodeURI(this.interestLabel.coach);
                 this.$http.get(
                     url,
                 ).then((response) => {
                     //response是数据
                     //在这里修改视图
                     this.newsData=response.body;
                 },()=>{
                     alert("加载资讯信息异常！");
                 });
             }
        },
        created:function () {
        },
        methods:{
            handleChange(val) {
                console.log(val);
            }
        }
    }
</script>
<style>
</style>