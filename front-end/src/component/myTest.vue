<template>
    <div id="myTest">
        <el-row class="demo-autocomplete">
            <div class="sub-title">检索新的内容</div>
                <br/>
                <br/>
                <el-autocomplete
                        class="inline-input"
                        v-model="state1"
                        :fetch-suggestions="querySearch"
                        placeholder="球员、球队或者教练"
                        @select="handleSelect"
                ></el-autocomplete>
        </el-row>
        <p v-show="isTrue" class="fontRed">找不到的类型！请输入正确的标签</p>
        <br/>
        <br/>
        <div v-show="!isTrue">
            <el-button @click="getWordArray()" type="info" round>探索新的资讯</el-button>
            <div v-show="isIndex">
                <el-collapse v-model="activeNames" @change="handleChange" v-for="item in this.NewData" :key="item.id">
                    <el-collapse-item v-bind:title="item.title">
                        <img src="../assets/allStar.jpg">
                        <p>{{item.content}}</p>
                    </el-collapse-item>
                </el-collapse>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                restaurants: [],
                //绑定当前的数据
                state1: '',
                state2: '',
                isTrue:true,
                isIndex:false,
                valArray:[],
                wNum:null,
                NewData:[],
                activeNames: [],
            };
        },
        methods: {
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                //console.log(item);
            },
            getWordArray(){
                if(this.wNum!=null) {
                    var url = 'http://localhost:3000/getWordArray/' + this.wNum;
                    this.$http.get(
                        url,
                    ).then((response) => {
                        console.log(response.body);
                        this.NewData=response.body;
                        this.isIndex=true;
                        //这里标志着检索成功
                        //开始注册兴趣池
                        var url = 'http://localhost:3000/registerInterest/' + encodeURI(this.state1);
                        this.$http.get(
                            url,
                        ).then((response) => {
                            console.log("在兴趣池注册成功！");
                        });
                    }, () => {
                        alert("服务器异常！");
                    });
                }
            }
        },
        mounted() {
            var url= 'http://localhost:3000/downloadTotalWords';
            this.$http.get(
                url,
            ).then((response) => {
                //response是数据
                //在这里修改视图
                this.restaurants=response.body;
                for(let i=0;i<this.restaurants.length;i++) {
                    this.valArray.push(this.restaurants[i].value);
                }
            },()=>{
                alert("服务器异常！");
            });
        },
        beforeUpdate(){
            if(this.valArray.indexOf(this.state1)>=0){
                this.isTrue=false;
                this.wNum=this.valArray.indexOf(this.state1);
                //console.log("修改了isTrue");
            }else{
                this.isTrue=true;
                //console.log("复位了isTrue");
            }
        }
    }
</script>
<style>
    .fontRed{
        color:red;
    }
</style>