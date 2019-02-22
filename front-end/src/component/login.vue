<template>
    <div id="register">
        <el-form class="formRewrite"  :model="form1">
            <el-form-item id="item1" label="用户ID" prop="id">
                <el-input type="text" v-model="loginUserName" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item id="item2" label="密码" prop="pass">
                <el-input type="password" v-model="loginPassWord" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
        </el-form>
    </div>
</template>
<script>
    import EM from '../EventEmitter.js'
    export default {
        name:"login",
        data:function () {
            return{
                form1:null,
                loginUserName:null,
                loginPassWord:null,
                sf:0
            }
        },
        methods:{
            onSubmit(){
                this.$http.get(
                    'http://localhost:3040/auth/2280/060038',
                ).then((response) => {
                    this.body=response.body;
                    console.log(this.body);
                    console.log(response.body);
                });
            },
            comunicate(){
                this.sf=1;
                console.log('sf'+this.sf);
                EM.emit('foo',this.sf);
            },
            login(){
                if(this.loginUserName&&this.loginPassWord){
                    var url= 'http://localhost:3000/login/'+encodeURI(this.loginUserName)+'/'+this.loginPassWord;
                    this.$http.get(
                        url,
                    ).then((response) => {
                        this.comunicate();
                        this.$notify({
                            title: '成功',
                            message: '您已成功登入专属NBA',
                            type: 'success'
                        });
                        console.log("login success!");
                    },()=>{
                       alert("登录异常！");
                    });
                }else{
                        this.$notify({
                            title: '失败',
                            message: '登录异常',
                            type: 'warning'
                        });
                };
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