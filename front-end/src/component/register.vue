<template>
    <div id="register">
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
</template>
<script>
    export default {
        name:"register",
        data:function () {
            return{
                form2:null,
                body:'123',
                username:null,
                password:null
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
                        console.log("register success!");
                    });
                }
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