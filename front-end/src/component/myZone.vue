<template>
    <div id="#myZone">
        <p>你当前感兴趣的标签是:</p>
<el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
    {{tag}}
</el-tag>
        <br/>
        <br/>
        <div v-show="isAdd">
<el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新的兴趣</el-button>
        </div>
        <br/>
        <br/>
        <br/>
        <el-button type="success" icon="el-icon-check" @click="updateAppData()" circle></el-button><span>更新你的兴趣</span>
    </div>
</template>

<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>

<script>
    export default {
        data() {
            return {
                dynamicTags: ['兴趣一', '兴趣二', '兴趣三'],
                inputVisible: false,
                inputValue: '',
                isAdd:false,
                tmpInterest:["科比布莱恩特","火箭","沃顿"]
            };
        },
        beforeMount:function(){
            var url= 'http://localhost:3000/getLabel';
            this.$http.get(
                url,
            ).then((response) => {
                //response是数据
                console.log(response);
                //在这里修改视图
                this.dynamicTags=response.body;
            },()=>{
                alert("加载资讯信息异常！");
            });
        },
        beforeUpdate:function () {
            if(this.dynamicTags.length<3){
               this.isAdd=true;
            }
            if(this.dynamicTags.length===3){
                this.isAdd=false;
            }
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            updateAppData(){
                console.log("现在开始测试");
                console.log("dynamicTags"+this.dynamicTags);
                console.log("tmpInterest"+this.tmpInterest);
                if(this.dynamicTags.length===3&&this.dynamicTags!=this.tmpInterest){
                console.log("现在开始提交请求");
                var url= 'http://localhost:3000/updateAppData/'+encodeURI(this.dynamicTags[0])+'/'+encodeURI(this.dynamicTags[1])+'/'+encodeURI(this.dynamicTags[2]);
                this.$http.get(
                    url,
                ).then((response) => {
                    //response是数据
                    console.log(response.bodyText);
                },()=>{
                    alert("传输信息异常！");
                });}
            }
        }
    }
</script>