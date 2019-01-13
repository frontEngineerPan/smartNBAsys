import Vue from 'vue';
import VueRouter from 'vue-router';
import Welcome from './component/welcome.vue';
import login from './component/login.vue';
import register from './component/register.vue';
const routes=[
    { path: '/', redirect: '/welcome' },
    {path:'/welcome',name:"welcome",component:Welcome},
    {path:'/login',name:"login",component:login},
    {path:'/register',name:"register",component:register}

];
const router=new VueRouter(
    {
        routes:routes,
        linkActiveClass:'active'
    }
);

export default router;