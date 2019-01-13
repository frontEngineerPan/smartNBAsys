<template>
    <div id="register">
        <el-form class="formRewrite"  :model="form1">
            <el-form-item id="item1" label="用户ID" prop="id">
                <el-input type="text"  autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item id="item2" label="密码" prop="pass">
                <el-input type="password" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form>
    </div>
</template>
<script>
    export default {
        name:"register",
        data:function () {
            return{
                form1:null,
                body:'456'
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