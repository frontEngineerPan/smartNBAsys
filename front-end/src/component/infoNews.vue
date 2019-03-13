<template>
    <div id="#infoNews">
         <div v-show="isLogouted">
              你还没有登录，请先登录！
         </div>
         <div v-show="isLogined">
             <p>......加载的当前资讯如下，可以点击“猜你喜欢”挖掘你的潜在兴趣</p>
             <el-collapse v-model="activeNames" @change="handleChange(item.id)" v-for="item in this.newsData" :key="item.id">
                 <el-collapse-item v-bind:title="item.title">
                     <img src="../assets/allStar.jpg">
                     <p>{{item.content}}</p>
                 </el-collapse-item>
             </el-collapse>
         </div>
         <br/>
         <br/>
         <div>
             <el-button type="info" plain @click="guessYourLove" id="buttonYourLove">猜你喜欢</el-button>
         </div>
        <div v-show="isGuess">
            <el-collapse v-model="activeNames2" @change="handleChange2(item.id)" v-for="item in this.newsData2" :key="item.id">
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
                 isGuess:false,
                 interestLabel:{
                     mate:"科比",
                     team:"湖人",
                     coach:"沃顿"
                 },
                 newsData:[],
                 newsData2:[],
                 activeNames: [],
                 activeNames2:[],
                 imgSrc:"../assets/title_images/lakers/1.jpg",
                 arr:[]
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
            handleChange2(val) {
                console.log(val);
            },
            handleChange(val) {
                console.log("选项卡当前对应nba文档的id是 "+val);
                var stateNow=2;
                if(this.arr.length>0){
                    let isPreviouslyRegistered=false;
                    for(let i=0;i<this.arr.length;i++){
                        if(this.arr[i].wNum===val){
                            //表示该选项卡之前注册过
                            isPreviouslyRegistered=true;
                            //状态转换
                            if(this.arr[i].state===1){
                                console.log("选项卡之前被注册过,状态是 "+this.arr[i].state);
                                this.arr[i].state=2;
                                stateNow=2;
                            }else{
                                //如果之前是关闭的,现在打开
                                console.log("选项卡之前被注册过,状态是 "+this.arr[i].state);
                                this.arr[i].state=1;
                                stateNow=1;
                            }
                        }
                    }
                    //这个逻辑的确有点绕:如果有选项卡被注册过，但是不是这个，那么新注册一个选项卡
                    if(!isPreviouslyRegistered){
                        //如果之前没有被注册,直接设置为打开(1)
                        var obj_k={
                            wNum:val,
                            state:1
                        }
                        console.log("这是个新被注册的选项卡,状态是 "+obj_k.state);
                        this.arr.push(obj_k);
                        stateNow=1;
                    }
                }else{
                    //如果之前没有被注册,直接设置为打开(1)
                    var obj_a={
                        wNum:val,
                        state:1
                    }
                    console.log("这是首个被注册的选项卡,状态是 "+obj_a.state);
                    this.arr.push(obj_a);
                    stateNow=1;
                }
                console.log("传输前stateNow状态是 "+stateNow);
                if(stateNow===1) {
                    var url= 'http://localhost:3000/recognizeInterest/'+val;
                    this.$http.get(
                    url,
                    ).then((response) => {
                        console.log(response);
                   },()=>{
                    alert("服务器异常！");
                   });
                }
                if(stateNow===2){
                    var url= 'http://localhost:3000/endTimeAccount/'+val;
                    this.$http.get(
                        url,
                    ).then((response) => {
                        console.log(response);
                    },()=>{
                        alert("服务器异常！");
                    });
                }
            },
            guessYourLove(){
                if(document.getElementById("buttonYourLove").innerText==="猜你喜欢") {
                    document.getElementById("buttonYourLove").innerText = "感知兴趣";
                }else{
                    document.getElementById("buttonYourLove").innerText = "猜你喜欢";
                }
                var url= 'http://localhost:3000/getBySecondaryLabel';
                this.$http.get(
                    url,
                ).then((response) => {
                    //response是数据
                    //在这里修改视图
                    this.newsData2=response.body;
                    if(!this.newsData2){
                        alert("兴趣池内没有内容");
                    }
                },()=>{
                    alert("加载资讯信息异常！");
                });
                this.isGuess=true;
            }
        }
    }
</script>
<style>
</style>