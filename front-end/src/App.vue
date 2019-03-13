<template>
  <div id="app">
    <el-menu :default-active="1" class="el-menu-demo width-all" mode="horizontal" @select="handleSelect" background-color="#3170a7" text-color="white" active-text-color="yellow">
      <el-menu-item index="1"><router-link to="/welcome">欢迎</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/login">登录</router-link></el-menu-item>
      <el-menu-item index="3"><router-link to="/register">注册</router-link></el-menu-item>
      <el-menu-item index="4"><router-link to="/infoNews">资讯小窝</router-link></el-menu-item>
      <el-menu-item index="5"><router-link to="/myZone">myZone</router-link></el-menu-item>
      <el-menu-item index="6"><router-link to="/myTest">探索</router-link></el-menu-item>
    </el-menu>
       <router-view id="router_view_1"></router-view>
    <div class="new-year-party">
      <div class="balloon">
        <h1 class="balloon__nr color-white">i</h1>
      </div>
      <div class="balloon balloon--happy">
        <h1 class="balloon__nr">篮</h1>
      </div>
      <div class="balloon balloon--new">
        <h1 class="balloon__nr">球</h1>
      </div>
      <div class="balloon balloon--happy">
        <h1 class="balloon__nr">小</h1>
      </div>
      <div class="balloon balloon--new">
        <h1 class="balloon__nr">窝</h1>
      </div>
    </div>
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
  .width-all{
       width:1903px;
       /*width: 100% !important;*/
  }
  .color-white{
    color: white;
  }
#router_view_1 {
  font-family: Helvetica, sans-serif;
  text-align:  center;
}
:root {
  --c01: #b29600;
  --c02: #2c2828;
  --c03: #fffdf6;
  --c04: #d2b793;
  --color_bg: #dfd3c3;
  --color_balloon: var(--c02);
  --balloon: 140px;
  --balloon_half: calc(var(--balloon) / 2);
  --knot: calc(var(--balloon) / 10);
  --border: 10px;
}
@media screen and (max-width: 50em) {
  :root {
    --balloon: 80px;
  }
}
@media screen and (min-width: 88em) {
  :root {
    --balloon: 200px;
  }
}

.balloon, .balloon:before, .balloon:after {
  transition: all 0.2s ease-in-out;
}
.new-year-party {
  width: calc(100vw - 20px);
  height: calc(100vh - 20px);
  box-sizing: border-box;
  display: flex;
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  margin: var(--border);
  overflow: hidden;
  padding-top: calc(var(--border) * 2);
}

.balloon {
  width: var(--balloon);
  height: var(--balloon);
  background-image: url("http://www.17sucai.com/preview/1528155/2019-01-03/balloons/img/glitter.jpg");
  background-position: 60% 50%;
  background-blend-mode: screen;
  background-color: var(--color_balloon);
  border-radius: 0 var(--balloon_half) var(--balloon_half);
  border: 1px solid transparent;
  position: relative;
  -webkit-transform: rotate(-135deg) translate(-100vh, -100vh);
  transform: rotate(-135deg) translate(-100vh, -100vh);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.balloon:not(:last-child) {
  margin-right: calc(var(--balloon_half) / 4);
}
.balloon:before {
  width: 0;
  height: 0;
  content: "";
  border-style: solid;
  border-width: calc(var(--knot) * 1.5) var(--knot) 0 var(--knot);
  border-color: var(--color_balloon) transparent transparent transparent;
  position: absolute;
  top: calc(var(--knot) / -1.4);
  left: calc(var(--knot) * -1);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.balloon:after {
  width: 1px;
  height: calc(var(--balloon) * 2.5);
  content: "";
  background-color: var(--c02);
  position: absolute;
  bottom: calc(var(--balloon) / 1.54);
  left: calc(var(--balloon) / -1.1);
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
  z-index: -1;
}
.balloon--happy {
  --color_balloon: var(--c01);
}
.balloon--new {
  --color_balloon: var(--c03);
}
.balloon__nr {
  display: inline-block;
  font-family: 'Alfa Slab One', cursive;
  font-size: calc(var(--balloon) * 0.19);
  -webkit-transform: rotate(135deg) translateY(-100%);
  transform: rotate(135deg) translateY(-100%);
  opacity: 0.75;
}
.balloon:nth-child(1) {
  -webkit-animation: fly_away 3s forwards, float_left_top 4s 3s 400 ease-in-out alternate;
  animation: fly_away 3s forwards, float_left_top 4s 3s 400 ease-in-out alternate;
}
.balloon:nth-child(2) {
  -webkit-animation: fly_away 1s forwards, float_right_bottom 4s 1s 400 ease-in-out alternate;
  animation: fly_away 1s forwards, float_right_bottom 4s 1s 400 ease-in-out alternate;
}
.balloon:nth-child(3) {
  -webkit-animation: fly_away 5s forwards, float_left_top 4s 5s 400 ease-in-out alternate;
  animation: fly_away 5s forwards, float_left_top 4s 5s 400 ease-in-out alternate;
}
.balloon:nth-child(4) {
  -webkit-animation: fly_away 4s forwards, float_left_top 4s 4s 400 ease-in-out alternate;
  animation: fly_away 4s forwards, float_left_top 4s 4s 400 ease-in-out alternate;
}
.balloon:nth-child(5) {
  -webkit-animation: fly_away 2s forwards, float_right_bottom 4s 2s 400 ease-in-out alternate;
  animation: fly_away 2s forwards, float_right_bottom 4s 2s 400 ease-in-out alternate;
}

@-webkit-keyframes fly_away {
  100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
}

@keyframes fly_away {
  100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
}
@-webkit-keyframes float_right_bottom {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(calc(var(--knot) * -1), 0);
    transform: rotate(-135deg) translate(calc(var(--knot) * -1), 0);
  }
}
@keyframes float_right_bottom {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(calc(var(--knot) * -1), 0);
    transform: rotate(-135deg) translate(calc(var(--knot) * -1), 0);
  }
}
@-webkit-keyframes float_left_top {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(0, var(--knot));
    transform: rotate(-135deg) translate(0, var(--knot));
  }
}
@keyframes float_left_top {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(0, var(--knot));
    transform: rotate(-135deg) translate(0, var(--knot));
  }
}
@-webkit-keyframes float_left_bottom {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(0, calc(var(--knot) * -1));
    transform: rotate(-135deg) translate(0, calc(var(--knot) * -1));
  }
}
@keyframes float_left_bottom {
  0%, 100% {
    -webkit-transform: rotate(-135deg) translate(0, 0);
    transform: rotate(-135deg) translate(0, 0);
  }
  50% {
    -webkit-transform: rotate(-135deg) translate(0, calc(var(--knot) * -1));
    transform: rotate(-135deg) translate(0, calc(var(--knot) * -1));
  }
}
</style>
