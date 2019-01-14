<template>
  <div id="app">
    <el-menu :default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#3170a7" text-color="white" active-text-color="yellow">
      <el-menu-item index="1"><router-link to="/welcome">欢迎</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/login">登录</router-link></el-menu-item>
      <el-menu-item index="3"><router-link to="/register">注册</router-link></el-menu-item>
      <el-menu-item index="4"><router-link to="/infoNews">资讯</router-link></el-menu-item>
      <el-menu-item index="5">myZone</el-menu-item>
    </el-menu>
       <router-view id="router_view_1"></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueRouter);
Vue.use(VueResource);
export default {
  methods: {
  }
}
</script>
<style>
#router_view_1 {
  font-family: Helvetica, sans-serif;
  text-align:  center;
}

</style>
