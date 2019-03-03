import Vue from 'vue';
import VueRouter from 'vue-router';
import Welcome from './component/welcome.vue';
import login from './component/login.vue';
import register from './component/register.vue';
import infoNews from './component/infoNews.vue';
import myZone from './component/myZone.vue';
import myTest from './component/myTest.vue';
const routes=[
    { path: '/', redirect: '/welcome' },
    {path:'/welcome',name:"welcome",component:Welcome},
    {path:'/login',name:"login",component:login},
    {path:'/register',name:"register",component:register},
    {path:'/infoNews',name:"infoNews",component:infoNews},
    {path:'/myZone',name:"myZone",component:myZone},
    {path:'/myTest',name:"myTest",component:myTest}
];
const router=new VueRouter(
    {
        routes:routes,
        linkActiveClass:'active'
    }
);
export default router;