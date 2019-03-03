<template>
    <div id="registerRoot">
    <div id="register" v-show="lb0">
        <el-form class="formRewrite"  :model="form2">
            <el-form-item id="item1" label="用户ID" prop="id">
                <el-input type="text" v-model="username" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item id="item2" label="密码" prop="pass">
                <el-input type="password" v-model="password" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
        </el-form>
    </div>
    <div id="label1" v-show="lb1">
        <!--mate-->
        <el-row class="demo-autocomplete">
            <div class="sub-title">请选择你最喜欢的球员</div>
            <br/>
            <br/>
            <el-autocomplete
                    class="inline-input"
                    v-model="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="球员"
                    @select="handleSelect"
            ></el-autocomplete>
        </el-row>
        <br/>
        <br/>
        <el-button type="warning" round @click="postLb1()">确认</el-button>
    </div>
    <div id="label2" v-show="lb2">
        <!--team-->
        <el-row class="demo-autocomplete">
            <div class="sub-title">请选择你最喜欢的球队</div>
            <br/>
            <br/>
            <el-autocomplete
                    class="inline-input"
                    v-model="state2"
                    :fetch-suggestions="querySearch2"
                    placeholder="球队"
                    @select="handleSelect"
            ></el-autocomplete>
        </el-row>
        <br/>
        <br/>
        <el-button type="warning" round @click="postLb2()">确认</el-button>
    </div>
    <div id="label3" v-show="lb3">
        <!--coach-->
        <el-row class="demo-autocomplete">
            <div class="sub-title">请选择你最喜欢的教练</div>
            <br/>
            <br/>
            <el-autocomplete
                    class="inline-input"
                    v-model="state3"
                    :fetch-suggestions="querySearch3"
                    placeholder="教练"
                    @select="handleSelect"
            ></el-autocomplete>
        </el-row>
        <br/>
        <br/>
        <el-button type="warning" round @click="postLb3()">确认</el-button>
    </div>
    </div>
</template>
<script>
    export default {
        name:"register",
        data:function () {
            return{
                form2:null,
                body:'123',
                username:null,
                password:null,
                lb0:true,
                lb1:false,
                lb2:false,
                lb3:false,
                mateData:[],
                mateDataArray:[],
                state1:[],
                teamData:[],
                teamDataArray:[],
                state2:[],
                coachData:[],
                coachDataArray:[],
                state3:[],
            }
        },
        methods:{
            onSubmit(){
                this.$http.jsonp(
                    'http://localhost:4100/complex.json',
                ).then((response) => {
                    this.body=response.body;
                    console.log(this.body);
                    console.log(response.body);
                });
            },
            register(){
                if(this.username&&this.password){
                    var url= 'http://localhost:3000/register/'+encodeURI(this.username)+'/'+this.password;
                    this.$http.get(
                        url,
                    ).then((response) => {
                        if(response!=null) {
                            this.lb0=false;
                            this.lb1=true;
                            var url1='http://localhost:3000/getMateData';
                            this.$http.get(
                                url1,
                            ).then((response1) => {
                                  this.mateData=response1.body;
                                  for(let i=0;i<this.mateData.length;i++){
                                      this.mateDataArray.push(this.mateData[i].value);
                                  }
                            });
                        }
                    });
                }
            },
            //选择的方法
            querySearch(queryString, cb) {
                var restaurants = this.mateData;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch2(queryString, cb) {
                var restaurants = this.teamData;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch3(queryString, cb) {
                var restaurants = this.coachData;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            postLb1(){
                if(this.mateDataArray.indexOf(this.state1)>=0&&this.state1.length>0){
                    var url='http://localhost:3000/postMateData/'+encodeURI(this.state1);
                    this.$http.get(
                        url,
                    ).then((response1) => {
                        console.log("更新Mate标签成功!");
                        console.log(response1);
                        var url2='http://localhost:3000/getTeamData/';
                        this.$http.get(
                            url2,
                        ).then((response2) => {
                            this.teamData=response2.body;
                            for(let i=0;i<this.teamData.length;i++){
                                this.teamDataArray.push(this.teamData[i].value);
                            }
                        });
                        this.lb1=false;
                        this.lb2=true;
                    });
                }else{
                    alert("请输入正确的球员标签!");
                }
            },
            postLb2(){
                if(this.teamDataArray.indexOf(this.state2)>=0&&this.state2.length>0){
                    var url='http://localhost:3000/postTeamData/'+encodeURI(this.state2);
                    this.$http.get(
                        url,
                    ).then((response) => {
                        console.log("更新Team标签成功!");
                        console.log(response);
                        var url3='http://localhost:3000/getCoachData/';
                        this.$http.get(
                            url3,
                        ).then((response3) => {
                            this.coachData=response3.body;
                            for(let i=0;i<this.coachData.length;i++){
                                this.coachDataArray.push(this.coachData[i].value);
                            }
                        });
                        this.lb2=false;
                        this.lb3=true;
                    });
                }else{
                    alert("请输入正确的球队标签!");
                }
            },
            postLb3(){
                if(this.coachDataArray.indexOf(this.state3)>=0&&this.state3.length>0){
                    var url='http://localhost:3000/postCoachData/'+encodeURI(this.state3);
                    this.$http.get(
                        url,
                    ).then((response) => {
                        console.log("更新Coach标签成功!");
                        console.log(response);
                        this.$notify({
                            title: '注册成功',
                            message: '您已成功注册你感兴趣的标签，赶快到资讯小窝浏览你的专属资讯吧！',
                            type: 'success'
                        });
                        this.lb3=false;
                        this.lb0=true;
                    });
                }else{
                    alert("请输入正确的教练标签!");
                }
            },

            handleSelect(item) {
                //console.log(item);
            }
        }
    }
</script>
<style>
    .formRewrite .el-form-item__label{
        clear: both!important;
        float:none!important;
    }
    #register{
        text-align: center;
    }
</style>